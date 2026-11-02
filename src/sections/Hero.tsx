import { lazy, Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'
import { useLocalTime } from '../hooks/useLocalTime'
import { site } from '../data/site'
import { scrollToId } from '../lib/scroll'
import { MagneticButton } from '../components/MagneticButton'

const HeroScene = lazy(() =>
  import('../three/HeroScene').then((module) => ({ default: module.HeroScene })),
)

gsap.registerPlugin(ScrollTrigger)

function renderChars(text: string) {
  return Array.from(text).map((char, index) => (
    <span className="hero__char" key={`${char}-${index}`}>
      {char}
    </span>
  ))
}

export function Hero({ started }: { started: boolean }) {
  const { t } = useLang()
  const time = useLocalTime(site.timezone)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!started || !rootRef.current) return

    const root = rootRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      root.classList.add('is-ready')
      return () => root.classList.remove('is-ready')
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => root.classList.add('is-ready'),
      })

      timeline
        .from('.hero__status', { y: 18, autoAlpha: 0, duration: 0.7 })
        .from('.hero__coords', { y: 14, autoAlpha: 0, duration: 0.7 }, '-=0.55')
        .from('.hero__role', { y: 16, autoAlpha: 0, duration: 0.6 }, '-=0.45')
        .from(
          '.hero__char',
          {
            yPercent: 120,
            duration: 1.15,
            stagger: 0.032,
            ease: 'power4.out',
          },
          '-=0.35',
        )
        .from('.hero__tagline', { y: 28, autoAlpha: 0, duration: 0.8 }, '-=0.75')
        .from(
          '.hero__actions > *',
          { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.08 },
          '-=0.6',
        )
        .from(
          '.hero__meta-item',
          { y: 16, autoAlpha: 0, duration: 0.6 },
          '-=0.55',
        )
        .from('.hero__scroll', { autoAlpha: 0, duration: 0.6 }, '-=0.4')
    }, rootRef)

    return () => {
      root.classList.remove('is-ready')
      context.revert()
    }
  }, [started])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const hero = rootRef.current

    const context = gsap.context(() => {
      gsap.to('.hero__name', {
        yPercent: -18,
        autoAlpha: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero__bottom', {
        yPercent: -24,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero__canvas', {
        scale: 0.9,
        autoAlpha: 0.18,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, rootRef)

    return () => context.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero__canvas" aria-hidden="true">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>
      <div className="hero__ambient" aria-hidden="true" />
      <div className="hero__noise" aria-hidden="true" />

      <div className="hero__inner container">
        <div className="hero__top">
          <span className="hero__status">
            <span className="hero__status-dot" aria-hidden="true" />
            {t.hero.status}
          </span>
          <span className="hero__coords mono">{t.hero.coords}</span>
        </div>

        <div className="hero__title-block">
          <p className="hero__role">
            <span className="hero__role-mark" aria-hidden="true" />
            {t.hero.role}
          </p>
          <h1 className="hero__name" aria-label={site.name}>
            <span className="hero__name-line">
              <span className="hero__name-line-inner">{renderChars(site.first)}</span>
            </span>
            <span className="hero__name-line hero__name-line--stroke">
              <span className="hero__name-line-inner">{renderChars(site.last)}</span>
            </span>
          </h1>
        </div>

        <div className="hero__bottom">
          <p className="hero__tagline">{t.hero.tagline}</p>

          <div className="hero__actions">
            <MagneticButton
              href="#work"
              variant="solid"
              onClick={(event) => {
                event.preventDefault()
                scrollToId('#work')
              }}
            >
              {t.hero.ctaWork}
            </MagneticButton>
            <MagneticButton
              href="#contact"
              variant="ghost"
              onClick={(event) => {
                event.preventDefault()
                scrollToId('#contact')
              }}
            >
              {t.hero.ctaContact}
            </MagneticButton>
          </div>

          <div className="hero__meta">
            <div className="hero__meta-item">
              <span className="hero__meta-label mono">{t.hero.location}</span>
              <span className="hero__meta-value mono">
                {t.hero.localTime} — {time}
              </span>
            </div>
            <div className="hero__scroll">
              <span className="hero__scroll-line" aria-hidden="true">
                <span />
              </span>
              <span className="mono">{t.hero.scroll}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
