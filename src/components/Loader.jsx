import { useRef } from 'react'
import { gsap, EASE, prefersReducedMotion } from '../animations/gsap'
import { useIsoLayoutEffect } from '../hooks/useGsap'
import { profile } from '../data/profile'

const SEEN = 'kas:booted'
const LINES = [
  '$ npm run kaif --mode=production',
  '✓ React UI compiled',
  '✓ Laravel API online · 35+ endpoints',
  '✓ Auth guards armed · Sanctum · JWT · OAuth',
  '✓ WebSockets connected',
  '→ launching portfolio',
]
const STRIPS = 7

function seen() {
  try {
    return sessionStorage.getItem(SEEN) === '1'
  } catch {
    return false
  }
}

export default function Loader({ onDone }) {
  const root = useRef(null)

  useIsoLayoutEffect(() => {
    let cancelled = false
    const q = gsap.utils.selector(root)
    const fast = seen() || prefersReducedMotion()
    const count = { v: 0 }
    const num = q('[data-num]')[0]
    const lines = q('[data-line]')

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo(q('[data-name] span'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: EASE.out, stagger: 0.05 }, 0)
      tl.to(
        count,
        {
          v: 100,
          duration: fast ? 0.8 : 2.6,
          ease: 'power2.inOut',
          onUpdate: () => {
            const v = Math.round(count.v)
            num.textContent = String(v).padStart(3, '0')
            const shown = Math.ceil((v / 100) * lines.length)
            lines.forEach((l, i) => (l.style.opacity = i < shown ? 1 : 0))
          },
        },
        0.1,
      )
      tl.to(q('[data-bar]'), { scaleX: 1, duration: fast ? 0.8 : 2.6, ease: 'power2.inOut' }, 0.1)

      const fonts = document.fonts?.ready ?? Promise.resolve()
      Promise.all([tl.then(), fonts]).then(() => {
        if (cancelled) return
        try {
          sessionStorage.setItem(SEEN, '1')
        } catch {
          /* fine */
        }
        const exit = gsap.timeline({ onComplete: () => !cancelled && onDone() })
        exit
          .to(q('[data-content]'), { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' })
          .to(q('[data-strip]'), { yPercent: -100, duration: 1, ease: EASE.inOut, stagger: { each: 0.06, from: 'center' } }, 0.35)
          .to(q('[data-strip-accent]'), { yPercent: -100, duration: 1, ease: EASE.inOut, stagger: { each: 0.06, from: 'center' } }, 0.45)
      })
    }, root)

    return () => {
      cancelled = true
      ctx.revert()
    }
  }, [onDone])

  return (
    <div ref={root} className="fixed inset-0 z-[200]" role="status" aria-live="polite" aria-label="Loading portfolio">
      {/* accent strips sit under the dark strips and leave a beat later */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: STRIPS }, (_, i) => (
          <div key={i} data-strip-accent className="h-full flex-1 bg-ember" />
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {Array.from({ length: STRIPS }, (_, i) => (
          <div key={i} data-strip className="-mr-px h-full flex-1 bg-void" />
        ))}
      </div>

      <div data-content className="gutter relative flex h-full flex-col justify-between py-8">
        <div className="label flex justify-between text-chalk-dim">
          <span>{profile.initials} / Portfolio</span>
          <span>{profile.location.split(',')[0]} · IN</span>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-2">
          <div className="font-mono text-[0.78rem] leading-7 text-chalk-dim" aria-hidden="true">
            {LINES.map((l) => (
              <p key={l} data-line style={{ opacity: 0 }} className={l.startsWith('✓') ? 'text-mint' : l.startsWith('→') ? 'text-ember' : ''}>
                {l}
              </p>
            ))}
          </div>
          <div className="text-right">
            <p data-name className="font-display text-big font-bold uppercase" aria-hidden="true">
              <span className="mask">
                <span className="inline-block">{profile.fullName}</span>
              </span>
            </p>
            {/* "100%" is ~3.8em wide: full width on phones, half the page beside the log on desktop */}
            <p className="whitespace-nowrap font-display text-[21vw] font-extrabold leading-[0.8] tracking-[-0.05em] lg:text-[min(10.5vw,18rem)]">
              <span data-num>000</span>
              <span className="text-ember">%</span>
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-chalk/10">
          <div data-bar className="h-full origin-left scale-x-0 bg-gradient-to-r from-ember to-ion" />
        </div>
      </div>
    </div>
  )
}
