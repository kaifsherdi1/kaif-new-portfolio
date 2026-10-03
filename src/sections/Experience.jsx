import { useRef } from 'react'
import { gsap, prefersReducedMotion } from '../animations/gsap'
import { revealSplit } from '../animations/scroll'
import { useGsap } from '../hooks/useGsap'
import SplitText from '../components/SplitText'
import { experience } from '../data/experience'

/** Stack only where a whole card fits on screen — otherwise its bottom would hide under the next one. */
const STACK_MEDIA = '(min-width: 1024px) and (min-height: 760px)'

/**
 * Sticky cards that stack: each card pins near the top, and as the next one
 * slides over it, it tips back in 3D, shrinks and dims.
 */
export default function Experience() {
  const root = useRef(null)

  useGsap(
    () => {
      const q = gsap.utils.selector(root)
      revealSplit(q('[data-title] [data-split]'), root.current, { stagger: 0.06 })
      if (prefersReducedMotion() || !window.matchMedia(STACK_MEDIA).matches) return
      const cards = q('[data-card]')
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        if (!next) return
        gsap.to(card.firstElementChild, {
          scale: 0.92,
          rotateX: 8,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
        })
      })
      q('[data-point-list]').forEach((list) =>
        gsap.fromTo(
          list.children,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: list, start: 'top 80%' } },
        ),
      )
    },
    [],
    root,
  )

  return (
    <section ref={root} id="experience" className="gutter relative py-28 sm:py-36">
      <p className="section-index mb-5">02 — Experience</p>
      <h2 data-title className="mb-16 font-display text-giant font-extrabold uppercase">
        <SplitText text="Where I've shipped" />
      </h2>

      <div className="space-y-[12vh]" style={{ perspective: '1600px' }}>
        {experience.map((job, i) => (
          <article key={job.company} data-card className="[@media(min-width:1024px)_and_(min-height:760px)]:sticky" style={{ top: `calc(var(--nav-h) + ${1 + i * 1.5}rem)` }}>
            <div className="glow-border relative origin-top overflow-hidden rounded-[2rem] border hairline bg-void-800 p-6 sm:p-10 lg:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ember/10 blur-3xl" />
              <div className="relative grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="chip">{job.period}</span>
                    {job.current && <span className="chip !border-mint/30 !text-mint">Current</span>}
                  </div>
                  <p className="font-display text-[clamp(4rem,9vw,8rem)] font-extrabold leading-none text-chalk/[0.06]">0{i + 1}</p>
                  <h3 className="-mt-6 font-display text-big font-extrabold uppercase sm:-mt-10">{job.role}</h3>
                  <p className="mt-3 text-xl text-ember">{job.company}</p>
                  <p className="label mt-2 text-chalk-dim">{job.place}</p>
                  <p className="mt-6 leading-relaxed text-chalk/75">{job.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {job.stack.map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <ul data-point-list className="space-y-0 border-t hairline lg:col-span-7">
                  {job.points.map((pt, j) => (
                    <li key={pt} className="flex gap-5 border-b hairline py-5">
                      <span className="label pt-1 text-ember">{String(j + 1).padStart(2, '0')}</span>
                      <span className="leading-relaxed text-chalk/85">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
