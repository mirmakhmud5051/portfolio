type SectionHeadingProps = {
  index: string
  label: string
  title: string
  aside?: string
}

export function SectionHeading({ index, label, title, aside }: SectionHeadingProps) {
  return (
    <div className="section-head" data-reveal>
      <div className="section-head__top">
        <span className="section-head__index">{index}</span>
        <span className="section-head__label">{label}</span>
        {aside ? <span className="section-head__aside">{aside}</span> : null}
      </div>
      <h2 className="section-head__title">
        {title.split('\n').map((line) => (
          <span className="line-mask" key={line}>
            <span>{line}</span>
          </span>
        ))}
      </h2>
    </div>
  )
}
