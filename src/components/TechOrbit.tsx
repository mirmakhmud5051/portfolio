import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useInView } from '../hooks/useInView'

type OrbitItem = {
  label: string
  ring: 0 | 1 | 2
  angle: number
  speed: number
}

const orbitItems: OrbitItem[] = [
  { label: 'React', ring: 0, angle: 0.2, speed: 0.42 },
  { label: 'TypeScript', ring: 0, angle: 2.3, speed: 0.42 },
  { label: 'Next.js', ring: 0, angle: 4.4, speed: 0.42 },
  { label: 'Three.js', ring: 1, angle: 0.7, speed: -0.24 },
  { label: 'GSAP', ring: 1, angle: 2.27, speed: -0.24 },
  { label: 'Tailwind', ring: 1, angle: 3.84, speed: -0.24 },
  { label: 'Vite', ring: 1, angle: 5.41, speed: -0.24 },
  { label: 'JavaScript', ring: 2, angle: 0.1, speed: 0.14 },
  { label: 'HTML', ring: 2, angle: 1.36, speed: 0.14 },
  { label: 'CSS', ring: 2, angle: 2.62, speed: 0.14 },
  { label: 'Git', ring: 2, angle: 3.88, speed: 0.14 },
  { label: 'Figma', ring: 2, angle: 5.14, speed: 0.14 },
]

const ringFactors = [0.6, 0.82, 1]

export function TechOrbit() {
  const { t } = useLang()
  const { ref, inView } = useInView<HTMLDivElement>(0.05, false)
  const [size, setSize] = useState(0)
  const itemRefs = useRef<Array<HTMLSpanElement | null>>([])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const updateSize = () => {
      setSize(element.getBoundingClientRect().width)
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  useEffect(() => {
    if (!inView || size === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const base = size / 2 - 54
    const start = performance.now()
    let frame = 0

    const loop = (now: number) => {
      const elapsed = reduced ? 0 : (now - start) / 1000

      orbitItems.forEach((item, index) => {
        const element = itemRefs.current[index]
        if (!element) return

        const radius = base * ringFactors[item.ring]
        const angle = item.angle + elapsed * item.speed
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const depth = (Math.sin(angle) + 1) / 2

        element.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(
          2,
        )}px, ${y.toFixed(2)}px, 0) scale(${(0.84 + depth * 0.2).toFixed(3)})`
        element.style.opacity = String(0.32 + depth * 0.68)
        element.style.zIndex = String(20 + Math.round(depth * 20))
      })

      if (!reduced) frame = requestAnimationFrame(loop)
    }

    loop(performance.now())
    return () => cancelAnimationFrame(frame)
  }, [inView, size])

  return (
    <div className="orbit" ref={ref} aria-hidden="true">
      <span className="orbit__ring orbit__ring--1" />
      <span className="orbit__ring orbit__ring--2" />
      <span className="orbit__ring orbit__ring--3" />

      <div className="orbit__core">
        <span className="orbit__core-num">12</span>
        <span className="orbit__core-label mono">
          {t.stack.orbitCore} <em>{t.stack.orbitCoreSub}</em>
        </span>
      </div>

      {orbitItems.map((item, index) => (
        <span
          className="orbit__item"
          key={item.label}
          ref={(element) => {
            itemRefs.current[index] = element
          }}
        >
          <span className="orbit__dot" />
          {item.label}
        </span>
      ))}

      <span className="orbit__hint mono">{t.stack.hint}</span>
    </div>
  )
}
