import { useEffect, useRef } from 'react'

type PixelSample = { x: number; y: number; bright: number }
type Particle = {
  x: number
  y: number
  ox: number
  oy: number
  vx: number
  vy: number
  tx: number
  ty: number
  bright: number
  size: number
}

const PORTRAIT_SRC = '/portrait-cinematic.jpg?v=2'
const IMAGE_ASPECT = 1091 / 1442
const ASSEMBLY_START = 1.2
const ASSEMBLY_END = 4.2
const REVEAL = 5.4
const FINISH = 6.4

export function GenerativePortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const ctx = canvasEl.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    let width = 0
    let height = 0
    let pixels: PixelSample[] = []
    let particles: Particle[] = []
    let frame = 0
    let started = false
    let isInView = false
    let revealed = false
    let startedAt = 0
    let destroyed = false

    const mouse = { x: 0.5, y: 0.5 }
    const targetMouse = { x: 0.5, y: 0.5 }

    const resize = () => {
      const host = canvasEl.parentElement ?? canvasEl
      const rect = host.getBoundingClientRect()
      const nextW = Math.max(1, rect.width)
      const nextH = Math.max(1, rect.height)
      if (Math.abs(nextW - width) < 1 && Math.abs(nextH - height) < 1) return
      width = nextW
      height = nextH
      canvasEl.width = Math.max(1, Math.round(width * dpr))
      canvasEl.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (particles.length > 0) layoutTargets()
    }

    const layoutTargets = () => {
      const pad = 0.94
      let drawW = width * pad
      let drawH = drawW / IMAGE_ASPECT
      if (drawH > height * pad) {
        drawH = height * pad
        drawW = drawH * IMAGE_ASPECT
      }
      for (const p of particles) {
        p.tx = width / 2 + (p.ox - 0.5) * drawW
        p.ty = height / 2 + (p.oy - 0.5) * drawH
      }
    }

    const onMouse = (e: MouseEvent) => {
      const rect = canvasEl.getBoundingClientRect()
      targetMouse.x = (e.clientX - rect.left) / rect.width
      targetMouse.y = (e.clientY - rect.top) / rect.height
    }

    const samplePixels = (img: HTMLImageElement) => {
      const sw = 150
      const sh = Math.round(sw / IMAGE_ASPECT)
      const off = document.createElement('canvas')
      off.width = sw
      off.height = sh
      const octx = off.getContext('2d')
      if (!octx) return
      octx.drawImage(img, 0, 0, sw, sh)
      const data = octx.getImageData(0, 0, sw, sh).data

      const lum = (x: number, y: number) => {
        const i = (y * sw + x) * 4
        const alpha = data[i + 3] / 255
        return ((data[i] + data[i + 1] + data[i + 2]) / 3 / 255) * alpha
      }

      let topSum = 0
      let topN = 0
      const topEdge = Math.max(2, Math.floor(sh * 0.16))
      for (let y = 0; y < topEdge; y++) {
        for (let x = 0; x < sw; x++) {
          topSum += lum(x, y)
          topN++
        }
      }
      const brightBackground = topN > 0 && topSum / topN > 0.75

      const raw: PixelSample[] = []
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const b = lum(x, y)
          const keep = brightBackground ? b < 0.84 : b > 0.05
          if (keep) raw.push({ x: x / sw, y: y / sh, bright: b })
        }
      }

      let source = raw
      if (source.length < 300) {
        source = []
        for (let y = 0; y < sh; y++) {
          for (let x = 0; x < sw; x++) {
            source.push({ x: x / sw, y: y / sh, bright: lum(x, y) })
          }
        }
      }

      let min = 1
      let max = 0
      for (const s of source) {
        if (s.bright < min) min = s.bright
        if (s.bright > max) max = s.bright
      }
      const range = Math.max(0.14, max - min)
      pixels = source.map((s) => ({
        x: s.x,
        y: s.y,
        bright: 0.18 + 0.82 * Math.min(1, Math.max(0, (s.bright - min) / range)),
      }))
      buildParticles()
    }

    const buildParticles = () => {
      const target = reduce ? 6000 : width < 480 ? 11000 : 22000
      const count = Math.min(target, pixels.length)
      const maxDist = Math.max(width, height) * 1.1
      particles = []
      for (let i = 0; i < count; i++) {
        const pt = pixels[Math.floor((i * pixels.length) / count)]
        const angle = Math.random() * Math.PI * 2
        const dist = Math.random() * maxDist
        particles.push({
          x: width / 2 + Math.cos(angle) * dist,
          y: height / 2 + Math.sin(angle) * dist,
          ox: pt.x,
          oy: pt.y,
          vx: 0,
          vy: 0,
          tx: width / 2,
          ty: height / 2,
          bright: pt.bright,
          size: Math.random() * 1.2 + 0.65,
        })
      }
      layoutTargets()
    }

    const contrastColor = (bright: number) => {
      const level = Math.round(bright * 255)
      return `rgb(${level},${level},${level})`
    }

    const reveal = () => {
      if (revealed) return
      revealed = true
      photoRef.current?.classList.add('is-revealed')
      canvasEl.classList.add('is-done')
    }

    const drawFinal = () => {
      ctx.fillStyle = '#08080a'
      ctx.fillRect(0, 0, width, height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.tx, p.ty, p.size * 0.8, 0, Math.PI * 2)
        ctx.fillStyle = contrastColor(p.bright)
        ctx.fill()
      }
    }

    const render = () => {
      const t = (performance.now() - startedAt) / 1000
      mouse.x += (targetMouse.x - mouse.x) * 0.06
      mouse.y += (targetMouse.y - mouse.y) * 0.06

      ctx.fillStyle = 'rgba(8,8,10,0.16)'
      ctx.fillRect(0, 0, width, height)

      const driftX = (mouse.x - 0.5) * 10
      const driftY = (mouse.y - 0.5) * 10
      const assembleProg = Math.min(1, Math.max(0, (t - ASSEMBLY_START) / (ASSEMBLY_END - ASSEMBLY_START)))

      for (const p of particles) {
        const targetX = p.tx + driftX
        const targetY = p.ty + driftY
        let ax = 0
        let ay = 0

        if (t < ASSEMBLY_START) {
          ax = (width / 2 - p.x) * 0.0006
          ay = (height / 2 - p.y) * 0.0006
          p.vx += (Math.random() - 0.5) * 0.016
          p.vy += (Math.random() - 0.5) * 0.016
        } else if (t < ASSEMBLY_END) {
          const pull = 0.002 + 0.008 * assembleProg
          ax = (targetX - p.x) * pull
          ay = (targetY - p.y) * pull
        } else {
          ax = (targetX - p.x) * 0.012
          ay = (targetY - p.y) * 0.012
        }

        p.vx = p.vx * 0.9 + ax
        p.vy = p.vy * 0.9 + ay
        p.x += p.vx
        p.y += p.vy

        let alpha: number
        if (t < ASSEMBLY_START) {
          alpha = 0.18 + p.bright * 0.25
        } else if (t < ASSEMBLY_END) {
          alpha = Math.min(1, 0.35 + assembleProg * 0.5 + p.bright * 0.4)
        } else {
          alpha = Math.min(1, 0.75 + p.bright * 0.35 + (t - ASSEMBLY_END) * 0.08)
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = contrastColor(p.bright)
        ctx.globalAlpha = alpha
        ctx.fill()
      }

      ctx.globalAlpha = 1

      if (t > FINISH - 1 && t < FINISH) {
        const sy = ((t - (FINISH - 1)) / 1) * height
        const grad = ctx.createLinearGradient(0, sy - 14, 0, sy + 14)
        grad.addColorStop(0, 'rgba(255,255,255,0)')
        grad.addColorStop(0.5, 'rgba(255,255,255,0.12)')
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, sy - 14, width, 28)
      }

      if (t >= REVEAL) reveal()

      if (t < FINISH) {
        frame = requestAnimationFrame(render)
      }
    }

    const start = () => {
      if (destroyed || !particles.length) return
      cancelAnimationFrame(frame)
      started = true
      revealed = false
      startedAt = performance.now()
      photoRef.current?.classList.remove('is-revealed')
      canvasEl.classList.remove('is-done')
      mouse.x = targetMouse.x = 0.5
      mouse.y = targetMouse.y = 0.5
      for (const p of particles) {
        const angle = Math.random() * Math.PI * 2
        const dist = Math.random() * Math.max(width, height) * 1.1
        p.x = width / 2 + Math.cos(angle) * dist
        p.y = height / 2 + Math.sin(angle) * dist
        p.vx = 0
        p.vy = 0
      }
      if (reduce) {
        drawFinal()
        reveal()
        return
      }
      render()
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvasEl.parentElement ?? canvasEl)
    canvasEl.addEventListener('mousemove', onMouse)
    canvasEl.addEventListener('click', start)

    const img = new Image()
    img.src = PORTRAIT_SRC
    img.onload = () => {
      if (destroyed) return
      samplePixels(img)
      if (isInView && !started) {
        start()
        visibility.disconnect()
      }
    }

    const visibility = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isInView = entry.isIntersecting
          if (isInView && !started && particles.length > 0) {
            start()
            visibility.disconnect()
          }
        }
      },
      { threshold: 0.3 },
    )
    visibility.observe(canvasEl)

    return () => {
      destroyed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      visibility.disconnect()
      canvasEl.removeEventListener('mousemove', onMouse)
      canvasEl.removeEventListener('click', start)
    }
  }, [])

  return (
    <>
      <img
        ref={photoRef}
        className="portrait__image"
        src={PORTRAIT_SRC}
        alt="Portrait"
      />
      <canvas
        ref={canvasRef}
        className="portrait__canvas"
        aria-hidden="true"
        title="Click to replay"
      />
    </>
  )
}
