/**
 * A real screenshot when we have one, otherwise a generated mock interface
 * in the project's hue — a browser frame with a layout that hints at what
 * the product does. Pure CSS, so it is crisp at any size.
 */
const Bar = ({ w = '60%', o = 0.18, h = 6, c }) => (
  <div className="rounded-full" style={{ width: w, height: h, background: c ?? `rgba(244,241,234,${o})` }} />
)

function Sidebar({ hue, items = 6 }) {
  return (
    <div className="hidden w-[18%] shrink-0 flex-col gap-3 border-r border-white/5 p-[3%] sm:flex">
      <div className="mb-2 h-4 w-4 rounded-md" style={{ background: hue }} />
      {Array.from({ length: items }, (_, i) => (
        <Bar key={i} w={`${55 + ((i * 17) % 40)}%`} o={i === 1 ? 0.6 : 0.14} />
      ))}
    </div>
  )
}

function Chart({ hue, bars = 12 }) {
  return (
    <div className="flex h-full items-end gap-[4%]">
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{ height: `${30 + ((i * 37) % 65)}%`, background: i % 4 === 2 ? hue : 'rgba(244,241,234,0.12)' }}
        />
      ))}
    </div>
  )
}

function Line({ hue }) {
  return (
    <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="h-full w-full">
      <defs>
        <linearGradient id={`g${hue.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={hue} stopOpacity="0.45" />
          <stop offset="1" stopColor={hue} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 48 L20 40 L40 44 L60 30 L80 34 L100 20 L120 26 L140 14 L160 18 L180 8 L200 12 L200 60 L0 60Z" fill={`url(#g${hue.slice(1)})`} />
      <path d="M0 48 L20 40 L40 44 L60 30 L80 34 L100 20 L120 26 L140 14 L160 18 L180 8 L200 12" fill="none" stroke={hue} strokeWidth="1.6" />
    </svg>
  )
}

const Card = ({ children, className = '' }) => <div className={`rounded-lg border border-white/5 bg-white/[0.03] p-[4%] ${className}`}>{children}</div>

const LAYOUTS = {
  store: (hue) => (
    <div className="grid h-full grid-cols-4 gap-[3%] p-[4%]">
      {Array.from({ length: 8 }, (_, i) => (
        <Card key={i} className="flex flex-col gap-2">
          <div className="aspect-square rounded-md" style={{ background: `linear-gradient(135deg, ${hue}55, rgba(255,255,255,0.04))` }} />
          <Bar w="80%" o={0.3} />
          <Bar w="40%" c={hue} />
        </Card>
      ))}
    </div>
  ),
  estate: (hue) => (
    <div className="flex h-full gap-[3%] p-[4%]">
      <div className="relative flex-[1.4] overflow-hidden rounded-lg border border-white/5" style={{ background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 12px, transparent 12px 24px)' }}>
        {[[20, 30], [55, 45], [35, 70], [75, 25], [65, 75]].map(([x, y], i) => (
          <span key={i} className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4" style={{ left: `${x}%`, top: `${y}%`, background: hue, '--tw-ring-color': `${hue}40` }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-[6%]">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="flex flex-1 gap-3">
            <div className="aspect-square h-full rounded-md" style={{ background: `${hue}40` }} />
            <div className="flex flex-1 flex-col justify-center gap-2">
              <Bar w="90%" o={0.3} />
              <Bar w="50%" c={hue} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  ),
  saas: (hue) => (
    <div className="flex h-full">
      <Sidebar hue={hue} />
      <div className="flex flex-1 flex-col gap-[4%] p-[4%]">
        <div className="grid grid-cols-3 gap-[3%]">
          {['Stores', 'Revenue', 'EMI'].map((t, i) => (
            <Card key={t} className="space-y-2">
              <Bar w="40%" o={0.2} />
              <div className="h-3 w-3/5 rounded-full" style={{ background: i === 1 ? hue : 'rgba(244,241,234,0.5)' }} />
            </Card>
          ))}
        </div>
        <Card className="flex-1">
          <Chart hue={hue} />
        </Card>
      </div>
    </div>
  ),
  micro: (hue) => (
    <div className="relative grid h-full place-items-center">
      <svg viewBox="0 0 300 180" className="absolute inset-0 h-full w-full">
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2
          return <line key={i} x1="150" y1="90" x2={150 + Math.cos(a) * 110} y2={90 + Math.sin(a) * 62} stroke={hue} strokeOpacity="0.35" strokeDasharray="3 4" />
        })}
      </svg>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2
        return (
          <span
            key={i}
            className="absolute rounded-md border border-white/10 bg-void-700 px-1.5 py-0.5 font-mono text-[0.45rem] uppercase text-chalk/70 sm:text-[0.55rem]"
            style={{ left: `${50 + Math.cos(a) * 36.6}%`, top: `${50 + Math.sin(a) * 34.4}%`, transform: 'translate(-50%,-50%)' }}
          >
            {['auth', 'user', 'resto', 'menu', 'cart', 'order', 'review', 'geo', 'notify', 'stats'][i]}
          </span>
        )
      })}
      <span className="relative rounded-xl px-4 py-2 font-mono text-[0.6rem] font-bold uppercase text-void sm:text-xs" style={{ background: hue }}>
        API Gateway
      </span>
    </div>
  ),
  feed: (hue) => (
    <div className="flex h-full flex-col gap-[3%] p-[4%]">
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} className="flex items-center gap-3">
          <div className="h-6 w-6 shrink-0 rounded-full" style={{ background: i === 0 ? hue : 'rgba(244,241,234,0.15)' }} />
          <div className="flex flex-1 flex-col gap-2">
            <Bar w={`${70 - i * 10}%`} o={0.3} />
            <Bar w="35%" o={0.12} />
          </div>
          <span className="rounded-full px-2 py-0.5 font-mono text-[0.45rem] uppercase sm:text-[0.55rem]" style={{ color: hue, border: `1px solid ${hue}55` }}>
            {i === 0 ? 'live' : i % 2 ? 'cache' : 'db'}
          </span>
        </Card>
      ))}
    </div>
  ),
  finance: (hue) => (
    <div className="flex h-full">
      <Sidebar hue={hue} items={5} />
      <div className="flex flex-1 flex-col gap-[4%] p-[4%]">
        <Card className="h-[38%]">
          <Line hue={hue} />
        </Card>
        <div className="flex flex-1 flex-col gap-[6%]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between border-b border-white/5 pb-[2%]">
              <Bar w="30%" o={0.25} />
              <Bar w="12%" c={i === 1 ? '#FF5F57' : hue} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  dashboard: (hue) => (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-[3%] p-[4%]">
      <Card className="col-span-2">
        <Line hue={hue} />
      </Card>
      <Card className="grid place-items-center">
        <div className="aspect-square h-[80%] rounded-full" style={{ background: `conic-gradient(${hue} 0 62%, rgba(244,241,234,0.12) 62% 100%)`, mask: 'radial-gradient(circle, transparent 52%, #000 53%)', WebkitMask: 'radial-gradient(circle, transparent 52%, #000 53%)' }} />
      </Card>
      <Card className="col-span-3">
        <Chart hue={hue} bars={18} />
      </Card>
    </div>
  ),
  sites: (hue) => (
    <div className="grid h-full grid-cols-3 gap-[3%] p-[4%]">
      {['Red Fresh', 'IR Intl', 'Naba Al Masarat'].map((n, i) => (
        <div key={n} className="flex flex-col overflow-hidden rounded-lg border border-white/5 bg-white/[0.03]" style={{ transform: `translateY(${i === 1 ? -6 : 6}%)` }}>
          <div className="flex h-[45%] items-end p-[8%]" style={{ background: `linear-gradient(160deg, ${hue}${['aa', '66', '44'][i]}, transparent)` }}>
            <span className="font-display text-[0.55rem] font-extrabold uppercase leading-tight text-chalk sm:text-xs">{n}</span>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-[8%]">
            <Bar w="90%" o={0.2} />
            <Bar w="70%" o={0.12} />
            <Bar w="40%" c={hue} />
          </div>
        </div>
      ))}
    </div>
  ),
}

export default function ProjectVisual({ project, className = '' }) {
  const { image, hue, art, title } = project
  return (
    <div className={`relative h-full w-full overflow-hidden bg-void-800 ${className}`}>
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 80% 0%, ${hue}33, transparent 60%)` }} />
      <div className="absolute inset-[6%] flex flex-col overflow-hidden rounded-xl border border-white/10 bg-void shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex shrink-0 items-center gap-1.5 border-b border-white/5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
          <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
          <span className="h-2 w-2 rounded-full bg-[#28C840]" />
          <span className="ml-2 truncate rounded-md bg-white/5 px-3 py-0.5 font-mono text-[0.5rem] text-chalk-dim sm:text-[0.6rem]">
            {title.toLowerCase().replace(/\s+/g, '')}.app
          </span>
        </div>
        <div className="relative min-h-0 flex-1">
          {image ? (
            <img src={image.src} alt={image.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
          ) : (
            (LAYOUTS[art] ?? LAYOUTS.dashboard)(hue)
          )}
        </div>
      </div>
    </div>
  )
}
