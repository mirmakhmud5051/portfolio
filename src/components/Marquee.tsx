type MarqueeProps = {
  items: string[]
  className?: string
}

export function Marquee({ items, className = '' }: MarqueeProps) {
  const renderGroup = (hidden: boolean) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <span className="marquee__item" key={`${item}-${index}`}>
          {item}
        </span>
      ))}
    </div>
  )

  return (
    <div className={`marquee ${className}`.trim()} aria-label="Skills marquee">
      <div className="marquee__track">
        {renderGroup(false)}
        {renderGroup(true)}
      </div>
    </div>
  )
}
