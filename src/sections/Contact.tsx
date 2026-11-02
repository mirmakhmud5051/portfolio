import { useLang } from '../i18n/LanguageContext'
import { useLocalTime } from '../hooks/useLocalTime'
import { SectionHeading } from '../components/SectionHeading'
import { site } from '../data/site'

export function Contact() {
  const { t } = useLang()
  const time = useLocalTime(site.timezone)
  const socials = site.socials

  return (
    <section className="contact" id="contact">
      <div className="contact__glow" aria-hidden="true" />
      <div className="container">
        <SectionHeading
          index="05"
          label={t.contact.label}
          title={t.contact.title}
          aside={t.contact.aside}
        />

        <div className="contact__grid">
          <div className="contact__main" data-reveal>
            <p className="contact__note">{t.contact.note}</p>

            <a
              className="contact__email"
              href={site.socials.find((s) => s.label === 'Telegram')?.href || `mailto:${site.email}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="contact__email-label mono">{t.contact.emailLabel}</span>
              <span className="contact__email-value">
                {site.socials.find((s) => s.label === 'Telegram')?.handle || site.email}
              </span>
              <span className="contact__email-arrow" aria-hidden="true">
                ↗
              </span>
            </a>

            <span className="contact__availability">
              <span className="hero__status-dot" aria-hidden="true" />
              {t.contact.available}
            </span>
          </div>

          <div className="contact__side">
            <div className="contact__block" data-reveal>
              <span className="contact__block-label mono">{t.contact.socialLabel}</span>
              <ul className="socials">
                {socials.map((social, index) => (
                  <li key={social.label}>
                    <a
                      className="socials__link"
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="socials__index">0{index + 1}</span>
                      <span className="socials__label">{social.label}</span>
                      <span className="socials__handle">{social.handle}</span>
                      <span className="socials__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact__block" data-reveal>
              <span className="contact__block-label mono">{t.contact.timeLabel}</span>
              <p className="contact__time">{time}</p>
              <p className="contact__place">
                {t.hero.location} — GMT+5
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
