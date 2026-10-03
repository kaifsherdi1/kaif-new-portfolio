import { useEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import { useExperience } from '../context/ExperienceContext'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'
import { profile } from '../data/profile'
import photo from '../assets/kaif.webp'
import photoJpg from '../assets/kaif.jpg'

/* deterministic "barcode" from the name */
const BARS = Array.from(profile.fullName.replace(/\s/g, '') + 'FULLSTACK', (c, i) => ((c.charCodeAt(0) * (i + 3)) % 4) + 1)

/**
 * A developer ID badge hanging from a lanyard. It swings in when the site
 * opens, tilts toward the pointer in 3D, and flips to a contact card on click.
 */
export default function IdBadge() {
  const { ready } = useExperience()
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const swing = useRef(null)
  const tilt = useRef(null)
  const sheen = useRef(null)
  const [flipped, setFlipped] = useState(false)

  // drop in and swing to rest like a pendulum
  useEffect(() => {
    if (!ready) return
    if (reduce) {
      gsap.set(swing.current, { y: 0, rotate: 0, opacity: 1 })
      return
    }
    const tl = gsap.timeline({ delay: 0.5 })
    tl.fromTo(swing.current, { y: '-120vh', rotate: -18, opacity: 1 }, { y: 0, duration: 1.3, ease: 'power3.out' })
      .to(swing.current, { rotate: 0, duration: 2.6, ease: 'elastic.out(1.1, 0.22)' }, 0.55)
      .to(swing.current, { rotate: 1.6, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    return () => tl.kill()
  }, [ready, reduce])

  // pointer tilt
  useEffect(() => {
    if (!fine || reduce) return
    const el = tilt.current
    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.8, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.8, ease: 'power3.out' })
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
      const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
      rx(-y * 26)
      ry(x * 34)
      gsap.to(sheen.current, { backgroundPosition: `${50 + x * 120}% ${50 + y * 120}%`, duration: 0.6, overwrite: 'auto' })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine, reduce])

  return (
    <div ref={swing} className="relative flex origin-top flex-col items-center opacity-0" style={{ perspective: '1400px' }}>
      {/* lanyard */}
      <div aria-hidden="true" className="relative h-[22vh] w-7 lg:h-[28vh]">
        <div className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 bg-gradient-to-b from-ember/0 via-ember to-ember shadow-[0_0_30px_rgba(255,90,31,0.35)]">
          <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent_0_10px,rgba(0,0,0,0.18)_10px_11px)]" />
        </div>
        <span className="absolute bottom-6 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap font-mono text-[0.55rem] uppercase tracking-[0.3em] text-void/80">
          kaif.dev
        </span>
      </div>
      {/* clip */}
      <div aria-hidden="true" className="relative z-10 -mt-1 h-7 w-12 rounded-md border border-chalk/30 bg-gradient-to-b from-zinc-300 to-zinc-500 shadow-lg">
        <div className="mx-auto mt-2 h-2 w-6 rounded-full bg-void/60" />
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Flip badge to the front' : 'Flip badge to see contact details'}
        data-cursor={flipped ? 'Front' : 'Flip'}
        className="relative -mt-3 block"
        style={{ perspective: '1400px' }}
      >
        <div ref={tilt} className="relative" style={{ transformStyle: 'preserve-3d' }}>
          <div
            className="relative h-[24rem] w-[16rem] transition-transform duration-[1100ms] ease-expo sm:h-[27rem] sm:w-[18rem]"
            style={{ transformStyle: 'preserve-3d', transform: `rotateY(${flipped ? 180 : 0}deg)` }}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.6rem] border border-white/60 bg-[#F6F3EC] text-void shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex items-center justify-between bg-void px-5 py-3 text-chalk">
                <span className="font-display text-sm font-extrabold tracking-wide">KS<span className="text-ember">.</span>DEV</span>
                <span className="flex items-center gap-1.5 font-mono text-[0.55rem] uppercase tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> Access
                </span>
              </div>
              <div className="mx-auto mt-3 h-2 w-14 rounded-full bg-void/15" />
              <div className="relative mx-5 mt-3 aspect-[4/4.3] overflow-hidden rounded-2xl bg-white">
                <picture>
                  <source srcSet={photo} type="image/webp" />
                  <img src={photoJpg} alt={`Portrait of ${profile.fullName}`} className="h-full w-full scale-[1.32] object-cover object-[50%_32%]" width="760" height="1013" />
                </picture>
                <span className="absolute left-2 top-2 rounded-full bg-void px-2 py-1 font-mono text-[0.5rem] uppercase tracking-[0.18em] text-chalk">
                  ID · KAS-2024
                </span>
              </div>
              <div className="px-5 pt-3 text-left">
                <p className="font-display text-[1.35rem] font-extrabold uppercase leading-none tracking-tight">{profile.fullName}</p>
                <p className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ember">{profile.role}</p>
              </div>
              <div className="mt-auto flex items-end justify-between px-5 pb-4">
                <div className="flex h-8 items-end gap-[2px]" aria-hidden="true">
                  {BARS.map((w, i) => (
                    <span key={i} className="h-full bg-void" style={{ width: `${w}px`, height: `${60 + (w % 3) * 20}%` }} />
                  ))}
                </div>
                <span className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-void/50">React · Laravel</span>
              </div>
              <div ref={sheen} aria-hidden="true" className="holo pointer-events-none absolute inset-0" />
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.6rem] border border-chalk/15 bg-void-800 p-6 text-left shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
              <div className="relative">
                <p className="label text-ember">Contact card</p>
                <p className="mt-3 font-display text-lg font-extrabold uppercase leading-tight">Let&rsquo;s build something.</p>
              </div>
              <dl className="relative space-y-3 font-mono text-[0.68rem]">
                {[
                  ['Email', profile.email],
                  ['Phone', profile.phone],
                  ['GitHub', 'kaifsherdi1'],
                  ['Based', 'Hubli, India'],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-chalk/10 pb-2">
                    <dt className="uppercase tracking-[0.18em] text-chalk-dim">{k}</dt>
                    <dd className="mt-1 break-all text-chalk">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="relative flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mint">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" /> Open to work
              </p>
            </div>
          </div>
        </div>
      </button>
      <p className="label mt-5 text-chalk-dim/70">Tap the badge</p>
    </div>
  )
}
