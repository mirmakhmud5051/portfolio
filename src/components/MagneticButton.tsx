import type { MouseEvent, PointerEvent, ReactNode } from 'react'
import gsap from 'gsap'

type MagneticButtonProps = {
  children: ReactNode
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  variant?: 'solid' | 'ghost'
  className?: string
  ariaLabel?: string
}

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  ariaLabel,
}: MagneticButtonProps) {
  const classes = ['btn', variant === 'solid' ? 'btn--solid' : '', className]
    .filter(Boolean)
    .join(' ')

  const handleMove = (event: PointerEvent<HTMLElement>) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    gsap.to(element, {
      x: x * 0.24,
      y: y * 0.32,
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  const handleLeave = (event: PointerEvent<HTMLElement>) => {
    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.35)',
    })
  }

  const content = (
    <>
      <span>{children}</span>
      <span className="btn__arrow" aria-hidden="true">
        ↗
      </span>
    </>
  )

  const shared = {
    className: classes,
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    onClick,
    'aria-label': ariaLabel,
  }

  if (href) {
    return (
      <a href={href} {...shared}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" {...shared}>
      {content}
    </button>
  )
}
