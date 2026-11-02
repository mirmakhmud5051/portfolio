import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimations(ready: boolean) {
  useEffect(() => {
    if (!ready) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const context = gsap.context(() => {
      if (reduced) return

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 46,
          opacity: 0,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            once: true,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
        gsap.from(Array.from(group.children), {
          y: 34,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: group,
            start: 'top 88%',
            once: true,
          },
        })
      })
    })

    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh).catch(() => undefined)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      context.revert()
    }
  }, [ready])
}
