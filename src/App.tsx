import { useCallback, useEffect, useState } from 'react'
import { LanguageProvider } from './i18n/LanguageContext'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useScrollAnimations } from './hooks/useScrollAnimations'
import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Marquee } from './components/Marquee'
import { SideRail } from './components/SideRail'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Expertise } from './sections/Expertise'
import { Stack } from './sections/Stack'
import { Projects } from './sections/Projects'
import { Contact } from './sections/Contact'
import { useLang } from './i18n/LanguageContext'
import { startScroll } from './lib/scroll'

function Page() {
  const { t } = useLang()
  const [loaded, setLoaded] = useState(false)

  useSmoothScroll()
  useScrollAnimations(loaded)

  const handleLoaded = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    if (loaded) {
      document.documentElement.classList.remove('is-loading')
      startScroll()
      window.scrollTo(0, 0)
    }
  }, [loaded])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setLoaded(true)
    }
  }, [])

  return (
    <>
      {!loaded ? <Preloader onDone={handleLoaded} /> : null}
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <SideRail />
      <Navbar />

      <main>
        <Hero started={loaded} />
        <Marquee items={t.marquee} />
        <About />
        <Expertise />
        <Stack />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <Page />
    </LanguageProvider>
  )
}
