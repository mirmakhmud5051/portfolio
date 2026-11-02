import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'
import { SectionHeading } from '../components/SectionHeading'
import { projects } from '../data/projects'
import { scrollToId } from '../lib/scroll'

gsap.registerPlugin(ScrollTrigger)

export function Projects() {
  const { t, lang } = useLang()
  const stackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return

    const trigger = ScrollTrigger.create({
      trigger: stack,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const next = Math.floor(self.progress * projects.length)
        setActive(Math.min(projects.length - 1, Math.max(0, next)))
      },
    })

    return () => trigger.kill()
  }, [])

  const goContact = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollToId('#contact')
  }

  return (
    <section className="projects section" id="work">
      <div className="container">
        <SectionHeading
          index="04"
          label={t.projects.label}
          title={t.projects.title}
          aside={t.projects.aside}
        />

        <div className="projects__intro" data-reveal>
          <p>{t.projects.intro}</p>
          <span className="mono">{t.projects.count}</span>
        </div>
      </div>

      <div className="project-stack" ref={stackRef}>
        {projects.map((project, index) => (
          <article
            className={`project-card${index < active ? ' is-behind' : ''}${
              index === active ? ' is-active' : ''
            }`}
            key={project.id}
            style={
              {
                zIndex: index + 1,
                '--project-accent': project.accent,
              } as CSSProperties
            }
          >
            <div className="project-card__inner" data-cursor="view">
              <div className="project-card__body">
                <div className="project-card__top">
                  <span className="project-card__no">{project.no}</span>
                  <span className="project-card__category mono">
                    {project.category[lang]}
                  </span>
                </div>

                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description[lang]}</p>

                <div className="project-card__bottom">
                  <dl className="project-card__meta">
                    <div>
                      <dt className="mono">{t.projects.role}</dt>
                      <dd>{project.role[lang]}</dd>
                    </div>
                    <div>
                      <dt className="mono">{t.projects.year}</dt>
                      <dd>{project.year}</dd>
                    </div>
                    <div className="project-card__tech">
                      <dt className="mono">{t.projects.stack}</dt>
                      <dd>{project.tech.join(' / ')}</dd>
                    </div>
                  </dl>

                  <a
                    className="project-card__cta"
                    href={project.href}
                    onClick={goContact}
                    data-cursor="view"
                  >
                    <span>{t.projects.cta}</span>
                    <span className="project-card__cta-icon" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </div>
              </div>

              <div className="project-media" aria-hidden="true">
                <div className="project-media__grid" />
                <div className="project-media__orb" />
                <div className="project-media__ring" />
                <span className="project-media__mono">{project.monogram}</span>
                <span className="project-media__label">{project.title}</span>
                <span className="project-media__scan" />
                <span className="project-media__index">{project.no}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="container">
        <p className="projects__note mono" data-reveal>
          {t.projects.note}
        </p>
      </div>
    </section>
  )
}
