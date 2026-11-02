import { useEffect, useRef } from 'react'

export function SideRail() {
  const fillRef = useRef<HTMLSpanElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${progress})`
      }
      if (pctRef.current) {
        pctRef.current.textContent = String(Math.round(progress * 100)).padStart(2, '0')
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <aside className="rail" aria-hidden="true">
      <span className="rail__text">Mirmakhmud / Portfolio 2026</span>
      <span className="rail__track">
        <span className="rail__fill" ref={fillRef} />
      </span>
      <span className="rail__pct" ref={pctRef}>
        00
      </span>
    </aside>
  )
}
