import { useLang } from '../i18n/LanguageContext'
import { scrollToTop } from '../lib/scroll'
import { site } from '../data/site'

export function Footer() {
  const { t } = useLang()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <span className="footer__label">{t.footer.built}</span>
            <p className="footer__name">
              Mirmakhmud
              <em>Junaydullaev</em>
            </p>
          </div>

          <button
            type="button"
            className="icon-btn footer__back"
            aria-label={t.contact.backTop}
            onClick={scrollToTop}
          >
            <span aria-hidden="true">↑</span>
          </button>
        </div>

        <div className="footer__bottom">
          <span>{t.footer.copyright}</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <span>{t.footer.rights}</span>
        </div>
      </div>
    </footer>
  )
}
