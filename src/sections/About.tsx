import { useLang } from '../i18n/LanguageContext'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { CountUp } from '../components/CountUp'
import { GenerativePortrait } from '../components/GenerativePortrait'

export function About() {
  const { t } = useLang()

  return (
    <section className="about section" id="about">
      <div className="container">
        <SectionHeading
          index="01"
          label={t.about.label}
          title={t.about.title}
          aside={t.about.aside}
        />

        <div className="about__grid">
          <div className="about__visual" data-reveal>
            <TiltCard className="portrait" max={8}>
              <div className="portrait__glow" aria-hidden="true" />
              <GenerativePortrait />
              <div className="portrait__grid" aria-hidden="true" />
              <div className="portrait__scan" aria-hidden="true" />
              <span className="portrait__tag portrait__tag--top">
                {t.about.portraitTop}
              </span>
              <span className="portrait__tag portrait__tag--bottom">
                {t.about.portraitBottom}
              </span>
              <div className="portrait__coords" aria-hidden="true">
                40.9983° N
                <br />
                71.6726° E
              </div>
            </TiltCard>

            <span className="portrait__badge">
              <span className="portrait__badge-dot" aria-hidden="true" />
              {t.about.availability}
            </span>
          </div>

          <div className="about__content">
            <p className="about__lead" data-reveal>
              {t.about.lead}
            </p>

            <div className="about__body" data-reveal>
              <p>{t.about.body}</p>
              <p>{t.about.body2}</p>
            </div>

            <div className="about__currently" data-reveal>
              <span className="about__small mono">{t.about.currently}</span>
              <ul>
                {t.about.currentlyItems.map((item) => (
                  <li key={item}>
                    <span className="about__dash" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="stats" data-reveal-stagger>
          {t.about.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <span className="stat__value">
                <CountUp value={stat.value} />
              </span>
              <span className="stat__label mono">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
