import { useEffect, useRef } from 'react'
import gsap from 'gsap'

type PreloaderProps = {
  onDone: () => void
}

export function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const content = contentRef.current
    const count = countRef.current
    const bar = barRef.current
    if (!root || !content || !count || !bar) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const loadDuration = reduced ? 0.15 : 0.7
    const panels = Array.from(root.querySelectorAll<HTMLElement>('.preloader__panel'))

    document.documentElement.classList.add('is-loading')

    const counter = { value: 0 }
    const timeline = gsap.timeline({
      onComplete: () => onDone(),
    })

    timeline.to(
      counter,
      {
        value: 100,
        duration: loadDuration,
        ease: 'power2.out',
        onUpdate: () => {
          count.textContent = String(Math.round(counter.value)).padStart(3, '0')
        },
      },
      0,
    )

    timeline.to(
      bar,
      { scaleX: 1, duration: loadDuration, ease: 'power2.out' },
      0,
    )

    timeline.to(
      content,
      { autoAlpha: 0, duration: reduced ? 0.08 : 0.25, ease: 'power2.out' },
      loadDuration + 0.05,
    )

    if (reduced) {
      timeline.set(panels, { scaleY: 0 }, loadDuration + 0.1)
    } else {
      timeline.to(
        panels,
        {
          scaleY: 0,
          duration: 0.5,
          ease: 'power3.inOut',
          stagger: 0.03,
        },
        loadDuration + 0.15,
      )
    }

    return () => {
      timeline.kill()
      document.documentElement.classList.remove('is-loading')
    }
  }, [onDone])

  return (
    <div className="preloader" ref={rootRef}>
      <div className="preloader__panels" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <span className="preloader__panel" key={index} />
        ))}
      </div>

      <div className="preloader__content" ref={contentRef}>
        <div className="preloader__row">
          <div className="preloader__brand">
            MJ<span>.</span>
          </div>
          <div className="preloader__meta">
            Portfolio / 2026
            <br />
            Mirmakhmud Junaydullaev
          </div>
        </div>

        <div className="preloader__center" aria-hidden="true">
          <p className="preloader__name">
            <span>Mirmakhmud</span>
            <span>Junaydullaev</span>
          </p>
        </div>

        <div className="preloader__bottom">
          <p className="preloader__label">
            Coder
            <br />
            Loading experience
          </p>
          <div className="preloader__count" ref={countRef} aria-hidden="true">
            000
          </div>
        </div>
      </div>

      <div className="preloader__bar" aria-hidden="true">
        <span className="preloader__bar-fill" ref={barRef} />
      </div>
      <span className="sr-only" role="status">
        Loading portfolio
      </span>
    </div>
  )
}
