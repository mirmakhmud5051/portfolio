import { useEffect, useState, type MouseEvent } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useLocalTime } from '../hooks/useLocalTime'
import { scrollToId, scrollToTop, startScroll, stopScroll } from '../lib/scroll'
import { site } from '../data/site'

export function Navbar() {
  const { t, lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const time = useLocalTime(site.timezone)

  const links = [
    { label: t.nav.work, href: '#work' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.expertise, href: '#expertise' },
    { label: t.nav.stack, href: '#stack' },
    { label: t.nav.contact, href: '#contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (open) {
      stopScroll()
    } else {
      startScroll()
    }

    return () => {
      document.documentElement.classList.remove('menu-open')
      startScroll()
    }
  }, [open])

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    setOpen(false)
    window.setTimeout(() => scrollToId(href), 60)
  }

  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setOpen(false)
    window.setTimeout(() => scrollToTop(), 60)
  }

  return (
    <>
      <header
        className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-menu-open' : ''}`}
      >
        <div className="nav__inner">
          <a className="nav__logo" href="#top" onClick={goHome} aria-label="Back to top">
            M<span className="nav__logo-mark">.</span>J
            <span className="nav__logo-sub">Coder</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {links.map((link) => (
              <a
                className="nav__link"
                href={link.href}
                key={link.href}
                onClick={(event) => navigate(event, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <div className="lang" role="group" aria-label={t.ui.language}>
              <button
                type="button"
                className={`lang__btn${lang === 'en' ? ' is-active' : ''}`}
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={`lang__btn${lang === 'uz' ? ' is-active' : ''}`}
                aria-pressed={lang === 'uz'}
                onClick={() => setLang('uz')}
              >
                UZ
              </button>
            </div>

            <a
              className="nav__cta"
              href="#contact"
              onClick={(event) => navigate(event, '#contact')}
            >
              {t.nav.talk} <span aria-hidden="true">↗</span>
            </a>

            <button
              type="button"
              className={`burger${open ? ' is-open' : ''}`}
              aria-label={open ? t.ui.close : t.ui.menu}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        <nav className="menu__links" aria-label="Mobile">
          {links.map((link, index) => (
            <a
              className="menu__link"
              href={link.href}
              key={link.href}
              onClick={(event) => navigate(event, link.href)}
            >
              <span>0{index + 1}</span>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="menu__foot">
          <a className="menu__mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <p className="menu__local">
            {t.hero.localTime} — {time}
            <br />
            {t.hero.location}
          </p>
        </div>
      </div>
    </>
  )
}
