import { useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import { revealSplit, rise } from '../animations/scroll'
import { useGsap } from '../hooks/useGsap'
import SplitText from '../components/SplitText'
import { certifications, achievements, education } from '../data/credentials'

/** Certificate card that flips over in 3D on hover / focus / tap. */
function CertCard({ cert, index }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      type="button"
      data-cert
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      aria-pressed={flipped}
      aria-label={`${cert.name}, ${cert.issuer}. ${cert.desc}`}
      data-cursor="Flip"
      className="block h-[22rem] w-full text-left"
      style={{ perspective: '1400px' }}
    >
      <div
        className="relative h-full w-full transition-transform duration-[900ms] ease-expo"
        style={{ transformStyle: 'preserve-3d', transform: `rotateY(${flipped ? 180 : 0}deg)` }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.75rem] border hairline bg-gradient-to-br from-void-700 to-void-800 p-7"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border-[18px] border-ember/10" />
          <div className="pointer-events-none absolute -right-2 -top-2 h-28 w-28 rounded-full border border-dashed border-ion/30" />
          <div className="relative flex items-center justify-between">
            <span className="chip">{cert.kind}</span>
            <span className="font-display text-4xl font-extrabold text-chalk/10">0{index + 1}</span>
          </div>
          <div className="relative">
            <span aria-hidden="true" className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-ember to-ion text-2xl text-void">
              ✦
            </span>
            <h3 className="font-display text-2xl font-extrabold uppercase leading-tight">{cert.name}</h3>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-ember">{cert.issuer}</p>
          </div>
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-[1.75rem] border border-ember/30 bg-void-800 p-7"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="label text-ember">What it covered</p>
          <p className="text-lg leading-relaxed text-chalk/85">{cert.desc}</p>
          <ul className="flex flex-wrap gap-1.5">
            {cert.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  )
}

export default function Credentials() {
  const root = useRef(null)

  useGsap(
    () => {
      const q = gsap.utils.selector(root)
      revealSplit(q('[data-title] [data-split]'), root.current, { stagger: 0.06 })
      gsap.fromTo(
        q('[data-cert]'),
        { rotateX: -35, y: 80, opacity: 0, transformPerspective: 1200 },
        { rotateX: 0, y: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: q('[data-certs]')[0], start: 'top 80%' } },
      )
      rise(q('[data-ach]'), q('[data-achs]')[0], { stagger: 0.1 })
      rise(q('[data-edu]'), q('[data-edus]')[0], { stagger: 0.1 })
    },
    [],
    root,
  )

  return (
    <section ref={root} id="credentials" className="gutter relative py-28 sm:py-36">
      <p className="section-index mb-5">05 — Credentials</p>
      <h2 data-title className="mb-16 font-display text-giant font-extrabold uppercase">
        <SplitText text="Proof of learning" />
      </h2>

      <div data-certs className="grid gap-5 md:grid-cols-3">
        {certifications.map((c, i) => (
          <CertCard key={c.name} cert={c} index={i} />
        ))}
      </div>

      <div className="mt-24 grid gap-14 lg:grid-cols-12">
        <div data-achs className="lg:col-span-6">
          <p className="label mb-6 text-chalk-dim">Achievements</p>
          <ul className="border-t hairline">
            {achievements.map((a) => (
              <li key={a.label} data-ach className="flex items-baseline gap-6 border-b hairline py-6">
                <span className="w-32 shrink-0 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none text-gradient">{a.value}</span>
                <span className="text-chalk/80">{a.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div data-edus className="lg:col-span-5 lg:col-start-8">
          <p className="label mb-6 text-chalk-dim">Education</p>
          <ol className="relative space-y-8 border-l border-chalk/10 pl-8">
            {education.map((e, i) => (
              <li key={e.school} data-edu className="relative">
                <span className={`absolute -left-[2.45rem] top-1 h-3.5 w-3.5 rounded-full border-2 border-void ${i === 0 ? 'bg-ember shadow-[0_0_20px_rgba(255,90,31,0.6)]' : 'bg-chalk/30'}`} />
                <p className="label text-chalk-dim">{e.period}</p>
                <h3 className="mt-2 font-display text-xl font-bold uppercase">{e.degree}</h3>
                <p className="text-chalk/80">{e.field}</p>
                <p className="mt-1 text-sm text-chalk-dim">{e.school}</p>
                {e.note && <span className="chip mt-3">{e.note}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
