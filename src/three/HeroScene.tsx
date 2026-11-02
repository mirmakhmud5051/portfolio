import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const noise = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

const vertexShader = `
uniform float uTime;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying float vNoise;

${noise}

void main() {
  float n1 = snoise(position * 1.25 + vec3(0.0, 0.0, uTime * 0.16));
  float n2 = snoise(position * 2.6 + vec3(uTime * 0.1, 0.0, 0.0));
  float displacement = n1 * 0.23 + n2 * 0.075;

  vec3 newPosition = position + normal * displacement;

  vNoise = n1 * 0.5 + 0.5;
  vNormal = normalize(normalMatrix * normal);

  vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
  vWorldPosition = worldPosition.xyz;
  vViewPosition = -(viewMatrix * worldPosition).xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`

const fragmentShader = `
uniform float uTime;
uniform vec3 uBase;
uniform vec3 uSilver;
uniform vec3 uAccent;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying float vNoise;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  float facing = clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0);
  float fresnel = pow(1.0 - facing, 2.3);

  float bands = smoothstep(0.2, 0.9, vNoise);
  vec3 color = mix(uBase, uSilver, bands * 0.42);

  color += fresnel * uSilver * 1.15;
  color = mix(color, uAccent, smoothstep(0.7, 1.0, fresnel) * 0.32);

  float shimmer = 0.022 * sin(vWorldPosition.y * 26.0 + uTime * 1.4);
  color += shimmer * uSilver;

  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

function Blob({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.38, 16), [])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBase: { value: new THREE.Color('#0b0c0e') },
      uSilver: { value: new THREE.Color('#c9d1c4') },
      uAccent: { value: new THREE.Color('#d7ff3e') },
    }),
    [],
  )

  useEffect(() => {
    return () => geometry.dispose()
  }, [geometry])

  useFrame((state, delta) => {
    if (reduced) return
    uniforms.uTime.value += delta
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.04
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      state.pointer.y * 0.18,
      0.08,
    )
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      state.pointer.x * 0.12,
      0.08,
    )
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      state.pointer.y * 0.08,
      0.08,
    )
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

function Rings({ reduced }: { reduced: boolean }) {
  if (reduced) return null
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.z += delta * 0.03
    groupRef.current.rotation.x += delta * 0.01
  })

  return (
    <group ref={groupRef} rotation={[1.15, 0.2, 0]}>
      <mesh>
        <torusGeometry args={[2.08, 0.006, 6, 140]} />
        <meshBasicMaterial color="#c9d1c4" transparent opacity={0.25} />
      </mesh>
      <mesh rotation={[0.4, 0.2, 0.85]}>
        <torusGeometry args={[2.5, 0.004, 6, 160]} />
        <meshBasicMaterial color="#d7ff3e" transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

function Particles({ reduced, count = 160 }: { reduced: boolean; count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      const radius = 2.4 + Math.random() * 2.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      array[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
      array[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72
      array[index * 3 + 2] = radius * Math.cos(phi)
    }
    return array
  }, [count])

  useFrame((_, delta) => {
    if (reduced || !pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.018
    pointsRef.current.rotation.x += delta * 0.005
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c9d1c4"
        size={0.015}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  )
}

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    if (reduced) return
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.32,
      0.1,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.18,
      0.1,
    )
    state.camera.lookAt(0, 0, 0)
  })

  return null
}

export function HeroScene() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      dpr={[1, 1.25]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}
      performance={{ min: 0.4 }}
    >
      <Suspense fallback={null}>
        <Blob reduced={reduced} />
        <Rings reduced={reduced} />
        <Particles reduced={reduced} />
        <CameraRig reduced={reduced} />
      </Suspense>
    </Canvas>
  )
}
