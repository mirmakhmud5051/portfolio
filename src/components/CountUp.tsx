import { useEffect } from 'react'
import gsap from 'gsap'
import { useInView } from '../hooks/useInView'

export function CountUp({ value }: { value: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5)
  const match = value.match(/^(\d+)(.*)$/)
  const numeric = match ? Number(match[1]) : 0
  const suffix = match ? match[2] : ''
  const isNumber = Boolean(match)

  useEffect(() => {
    if (!inView || !isNumber || !ref.current) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const counter = { value: 0 }

    const tween = gsap.to(counter, {
      value: numeric,
      duration: reduced ? 0 : 1.7,
      ease: 'power2.out',
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = String(Math.round(counter.value))
        }
      },
    })

    return () => {
      tween.kill()
    }
  }, [inView, isNumber, numeric, ref])

  if (!isNumber) {
    return <span>{value}</span>
  }

  return (
    <span>
      <span ref={ref}>0</span>
      {suffix}
    </span>
  )
}
