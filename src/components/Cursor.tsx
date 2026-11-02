import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('has-cursor')
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' })

    let visible = false

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
      }
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    const onOver = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      const interactive = target.closest('a, button, [data-cursor]')
      const view = target.closest('[data-cursor="view"]')
      ring.classList.toggle('is-hover', Boolean(interactive) && !view)
      ring.classList.toggle('is-view', Boolean(view))
    }

    const onLeave = () => {
      visible = false
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 })
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor cursor--ring" ref={ringRef} aria-hidden="true">
        <span className="cursor__label">View</span>
      </div>
      <div className="cursor cursor--dot" ref={dotRef} aria-hidden="true" />
    </>
  )
}
