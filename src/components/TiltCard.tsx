import { useRef, type PointerEvent, type ReactNode } from 'react'
import gsap from 'gsap'

type TiltCardProps = {
  children: ReactNode
  className?: string
  max?: number
}

export function TiltCard({ children, className = '', max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    gsap.to(element, {
      rotateY: x * max,
      rotateX: -y * max,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  const handleLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.9,
      ease: 'power3.out',
    })
  }

  return (
    <div
      className={`tilt ${className}`.trim()}
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </div>
  )
}
