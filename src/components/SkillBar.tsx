import type { CSSProperties } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useInView } from '../hooks/useInView'
import type { Skill } from '../data/skills'

type SkillBarProps = {
  skill: Skill
  index: number
}

export function SkillBar({ skill, index }: SkillBarProps) {
  const { lang } = useLang()
  const { ref, inView } = useInView<HTMLLIElement>(0.35)

  return (
    <li
      className={`skill${inView ? ' is-in' : ''}`}
      ref={ref}
      style={{ '--level': `${skill.level}%` } as CSSProperties}
    >
      <div className="skill__row">
        <span className="skill__index">0{index + 1}</span>
        <span className="skill__name">{skill.name}</span>
        <span className="skill__meta">
          {skill.category[lang]}
          <span className="skill__pct">{skill.level}%</span>
        </span>
      </div>
      <div className="skill__track">
        <span className="skill__fill" />
      </div>
    </li>
  )
}
