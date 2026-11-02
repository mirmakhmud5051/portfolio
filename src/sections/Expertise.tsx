import { useLang } from '../i18n/LanguageContext'
import { SectionHeading } from '../components/SectionHeading'
import { expertise } from '../data/expertise'

export function Expertise() {
  const { t, lang } = useLang()

  return (
    <section className="expertise section" id="expertise">
      <div className="container">
        <SectionHeading
          index="02"
          label={t.expertise.label}
          title={t.expertise.title}
          aside={t.expertise.aside}
        />

        <div className="expertise__grid" data-reveal-stagger>
          {expertise.map((item, index) => (
            <article
              className={`expertise-card${item.status === 'soon' ? ' is-soon' : ''}`}
              key={item.id}
            >
              <div className="expertise-card__top">
                <span className="expertise-card__index">0{index + 1}</span>
                <span
                  className={`expertise-card__status expertise-card__status--${item.status}`}
                >
                  <span aria-hidden="true" />
                  {item.status === 'active' ? t.expertise.active : t.expertise.soon}
                </span>
              </div>

              <h3 className="expertise-card__title">{item.title[lang]}</h3>
              <p className="expertise-card__text">{item.description[lang]}</p>

              <ul className="expertise-card__tags">
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>

              <span className="expertise-card__arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
