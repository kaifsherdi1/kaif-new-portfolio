import { useEffect, useState } from 'react'
import { scrollTo } from '../animations/scroll'
import { profile } from '../data/profile'

function LocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 30000)
    return () => clearInterval(id)
  }, [])
  return <span>{t} IST</span>
}

export default function Footer() {
  return (
    <footer className="gutter relative overflow-hidden border-t hairline pt-10">
      <div className="label flex flex-wrap items-center justify-between gap-4 text-chalk-dim">
        <span>© {new Date().getFullYear()} {profile.fullName}</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> Hubli, India · <LocalTime />
        </span>
        <button type="button" onClick={() => scrollTo(0)} className="group flex items-center gap-2 hover:text-chalk">
          Back to top <span className="transition-transform duration-500 group-hover:-translate-y-1">↑</span>
        </button>
      </div>
      <p
        aria-hidden="true"
        className="pointer-events-none mt-6 select-none whitespace-nowrap text-center font-display text-[18.5vw] font-extrabold uppercase leading-[0.75] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(244,241,234,0.12)]"
      >
        Kaif Sherdi
      </p>
    </footer>
  )
}
