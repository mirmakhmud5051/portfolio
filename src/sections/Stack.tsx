import { useLang } from '../i18n/LanguageContext'
import { SectionHeading } from '../components/SectionHeading'
import { TechOrbit } from '../components/TechOrbit'
import { SkillBar } from '../components/SkillBar'
import { skills, tools } from '../data/skills'

export function Stack() {
  const { t } = useLang()

  return (
    <section className="stack section" id="stack">
      <div className="container">
        <SectionHeading
          index="03"
          label={t.stack.label}
          title={t.stack.title}
          aside={t.stack.aside}
        />

        <div className="stack__grid">
          <div className="stack__orbit" data-reveal>
            <TechOrbit />
          </div>

          <div className="stack__content">
            <div className="stack__head" data-reveal>
              <span className="stack__label mono">{t.stack.skillsLabel}</span>
              <span className="stack__count mono">06 / 12</span>
            </div>

            <ul className="skills" data-reveal>
              {skills.map((skill, index) => (
                <SkillBar skill={skill} index={index} key={skill.name} />
              ))}
            </ul>

            <div className="stack__tools" data-reveal>
              <span className="stack__label mono">{t.stack.toolsLabel}</span>
              <ul className="tool-list">
                {tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
