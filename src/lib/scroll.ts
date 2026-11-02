import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(next: Lenis | null) {
  instance = next
}

export function getLenis() {
  return instance
}

export function scrollToId(id: string) {
  const target = document.querySelector<HTMLElement>(id)
  if (!target) return
  const offset = id === '#top' ? 0 : -70
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.4 })
    return
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: 'smooth' })
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.4 })
    return
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function stopScroll() {
  instance?.stop()
}

export function startScroll() {
  instance?.start()
}
