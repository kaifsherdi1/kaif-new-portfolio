import { useRef } from 'react'
import { gsap, prefersReducedMotion } from '../animations/gsap'
import { rise, revealSplit } from '../animations/scroll'
import { useGsap } from '../hooks/useGsap'
import SplitText from '../components/SplitText'
import { profile } from '../data/profile'
import { experience } from '../data/experience'

const STATEMENT =
  'I turn ideas into fast, secure, beautifully animated web products — React on the front, Laravel underneath, and obsessive attention to the details in between.'

/** The code card: Kaif as a JS object, typed line by line as it scrolls in. */
const CODE = [
  ['const', ' kaif', ' = {'],
  ['  role', ': ', `'${profile.role}'`, ','],
  ['  basedIn', ': ', "'Hubli, India'", ','],
  ['  now', ': ', `'${experience[0].company}'`, ','],
  ['  frontend', ': [', "'React'", ', ', "'Next.js'", ', ', "'Redux'", '],'],
  ['  backend', ': [', "'Laravel'", ', ', "'REST'", ', ', "'MySQL'", '],'],
  ['  loves', ': [', "'GSAP'", ', ', "'clean UI'", ', ', "'fast apps'", '],'],
  ['  openToWork', ': ', 'true', ','],
  ['}'],
]

function tokenClass(tok) {
  if (tok === 'const') return 'text-ion'
  if (tok.startsWith("'")) return 'text-mint'
  if (tok === 'true') return 'text-ember'
  if (/^\s+\w+$/.test(tok) || tok === ' kaif') return 'text-chalk'
  return 'text-chalk-dim'
}

export default function About() {
  const root = useRef(null)

  useGsap(
    () => {
      const q = gsap.utils.selector(root)
      revealSplit(q('[data-title] [data-split]'), root.current, { stagger: 0.06 })
      rise(q('[data-rise]'), q('[data-rise]')[0], { stagger: 0.1 })

      // statement words light up as you scroll through them
      const words = q('[data-word]')
      if (prefersReducedMotion()) gsap.set(words, { opacity: 1 })
      else
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: q('[data-statement]')[0], start: 'top 80%', end: 'bottom 45%', scrub: true } },
        )

      // code lines type in
      gsap.fromTo(
        q('[data-code-line]'),
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: q('[data-code]')[0], start: 'top 75%' } },
      )
    },
    [],
    root,
  )

  return (
    <section ref={root} id="about" className="gutter relative py-28 sm:py-40">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="section-index mb-5">01 — About</p>
          <h2 data-title className="font-display text-giant font-extrabold uppercase">
            <SplitText text="Hello, I'm Kaif" />
          </h2>
        </div>
        <p data-rise className="label max-w-xs text-chalk-dim">
          {profile.availability}
        </p>
      </div>

      <p data-statement className="max-w-6xl font-display text-[clamp(1.7rem,3.8vw,3.6rem)] font-bold leading-[1.12] tracking-[-0.02em]">
        {STATEMENT.split(' ').map((w, i) => (
          <span key={i} data-word className={/React|Laravel|animated/.test(w) ? 'text-gradient' : ''}>
            {w}{' '}
          </span>
        ))}
      </p>

      <div className="mt-20 grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          {profile.about.map((p) => (
            <p key={p} data-rise className="text-lg leading-relaxed text-chalk/75">
              {p}
            </p>
          ))}
          <div data-rise className="flex flex-wrap gap-3 pt-2">
            {profile.resumes.map((r) => (
              <a key={r.href} href={r.href} download className="btn-ghost">
                {r.label} <span aria-hidden="true">↓</span>
              </a>
            ))}
          </div>
        </div>

        <div data-code data-rise className="glow-border is-active rounded-3xl lg:col-span-6 lg:col-start-7">
          <div className="overflow-hidden rounded-3xl border hairline bg-void-800/90 shadow-2xl">
            <div className="flex items-center gap-2 border-b hairline px-5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 font-mono text-xs text-chalk-dim">kaif.config.js</span>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-[0.8rem] leading-7 sm:text-[0.9rem]">
              <code>
                {CODE.map((line, i) => (
                  <span key={i} data-code-line className="block">
                    <span className="mr-5 inline-block w-4 select-none text-right text-chalk-dim/40">{i + 1}</span>
                    {line.map((tok, j) => (
                      <span key={j} className={tokenClass(tok)}>
                        {tok}
                      </span>
                    ))}
                  </span>
                ))}
                <span className="ml-9 inline-block h-5 w-2 translate-y-1 animate-pulse bg-ember" />
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
