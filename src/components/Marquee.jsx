/** Infinite tilted ticker band. Two copies of the list make the loop seamless. */
export default function Marquee({ items, reverse = false, accent = false, speed = 38, className = '' }) {
  const row = (hidden) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-8 px-8 font-display text-[clamp(1.6rem,3.6vw,3.2rem)] font-extrabold uppercase">
          {t}
          <span aria-hidden="true" className={accent ? 'text-void' : 'text-ember'}>
            ✦
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div
      className={`overflow-hidden py-5 ${accent ? 'bg-ember text-void' : 'border-y hairline bg-void-800 text-chalk'} ${reverse ? 'marquee-reverse' : ''} ${className}`}
      style={{ '--marquee-speed': `${speed}s` }}
    >
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
