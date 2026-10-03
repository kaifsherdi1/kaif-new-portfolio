import { useRef } from 'react'
import { gsap, ScrollTrigger, MEDIA } from '../animations/gsap'
import { revealSplit, rise } from '../animations/scroll'
import { useGsap } from '../hooks/useGsap'
import SplitText from '../components/SplitText'
import TiltCard from '../components/TiltCard'
import ProjectVisual from '../components/ProjectVisual'
import { TransitionLink } from '../components/PageTransition'
import { projects, moreProjects } from '../data/projects'
import { profile } from '../data/profile'

const pad = (n) => String(n).padStart(2, '0')

function ProjectCard({ project, index }) {
  return (
    <TiltCard className="h-full" max={6}>
      <TransitionLink
        to={`/work/${project.slug}`}
        data-cursor="View"
        className="glow-border group flex h-full flex-col overflow-hidden rounded-[1.75rem] border hairline bg-void-800"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className="h-full w-full transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.05]">
            <ProjectVisual project={project} />
          </div>
          <span className="absolute bottom-4 left-4 rounded-full bg-void/80 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-chalk backdrop-blur">
            {pad(index + 1)} / {pad(projects.length)}
          </span>
          {project.live && (
            <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-[0.14em] text-void">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-void" /> Live
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <p className="label text-chalk-dim" style={{ color: project.hue }}>
            {project.category}
          </p>
          <h3 className="mt-3 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] font-extrabold uppercase leading-none">{project.title}</h3>
          <p className="mt-2 text-chalk/70">{project.tagline}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((s) => (
              <li key={s} className="chip !py-1 !text-[0.6rem]">
                {s}
              </li>
            ))}
          </ul>
          <span className="mt-auto flex items-center justify-between pt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em]">
            <span className="text-chalk-dim transition-colors group-hover:text-chalk">Case study</span>
            <span className="grid h-10 w-10 place-items-center rounded-full border hairline transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-ember group-hover:bg-ember group-hover:text-void">
              →
            </span>
          </span>
        </div>
      </TransitionLink>
    </TiltCard>
  )
}

/**
 * Desktop: the section pins and the cards travel sideways as you scroll,
 * each one swinging in from a 3D angle. Mobile / reduced motion: a plain grid.
 */
export default function Work() {
  const root = useRef(null)
  const track = useRef(null)

  useGsap(
    () => {
      const q = gsap.utils.selector(root)
      revealSplit(q('[data-title] [data-split]'), root.current, { stagger: 0.06 })
      rise(q('[data-more]'), q('[data-more-wrap]')[0], { stagger: 0.08 })

      const mm = gsap.matchMedia()
      mm.add(`${MEDIA.desktop} and (prefers-reduced-motion: no-preference)`, () => {
        const el = track.current
        const distance = () => el.scrollWidth - window.innerWidth
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: q('[data-pin]')[0],
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        q('[data-slide]').forEach((card) => {
          gsap.fromTo(
            card,
            { rotateY: -28, z: -160, opacity: 0.4 },
            {
              rotateY: 0,
              z: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 105%', end: 'left 55%', scrub: true },
            },
          )
        })
        gsap.to(q('[data-progress]'), {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: q('[data-pin]')[0], start: 'top top', end: () => `+=${distance()}`, scrub: true },
        })
      })
      mm.add(`(max-width: 1023px), (prefers-reduced-motion: reduce)`, () => {
        rise(q('[data-slide]'), track.current, { stagger: 0.1 })
      })
      return () => mm.revert()
    },
    [],
    root,
  )

  return (
    <section ref={root} id="work" className="relative">
      <div data-pin className="relative overflow-hidden lg:h-screen">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-void-800/60 to-void" />
        <div
          ref={track}
          className="gutter relative flex flex-col gap-8 py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-10 lg:py-0 lg:pt-[var(--nav-h)]"
          style={{ perspective: '1800px' }}
        >
          <div className="flex shrink-0 flex-col justify-center lg:w-[36vw] lg:pr-8">
            <p className="section-index mb-5">03 — Selected work</p>
            <h2 data-title className="font-display text-giant font-extrabold uppercase">
              <SplitText text="Things I've built" />
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-chalk/70">
              Multi-vendor commerce, real estate, SaaS ERP, microservices, real-time feeds and fintech — production systems built
              end to end.
            </p>
            <p className="label mt-8 hidden items-center gap-3 text-chalk-dim lg:flex">
              Scroll to explore <span className="arrow-x inline-block text-ember">→</span>
            </p>
          </div>

          {projects.map((p, i) => (
            <div key={p.slug} data-slide className="shrink-0 lg:w-[min(30rem,34vw)]" style={{ transformStyle: 'preserve-3d' }}>
              <ProjectCard project={p} index={i} />
            </div>
          ))}

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            data-slide
            data-cursor="GitHub"
            className="group grid shrink-0 place-items-center rounded-[1.75rem] border border-dashed border-chalk/15 p-10 text-center transition-colors hover:border-ember lg:h-[70vh] lg:w-[22rem]"
          >
            <span>
              <span className="block font-display text-huge font-extrabold uppercase leading-none transition-colors group-hover:text-ember">26+</span>
              <span className="label mt-4 block text-chalk-dim">Repositories on GitHub ↗</span>
            </span>
          </a>
        </div>
        <div className="absolute inset-x-[var(--gutter)] bottom-8 hidden h-px bg-chalk/10 lg:block">
          <div data-progress className="h-full origin-left scale-x-0 bg-gradient-to-r from-ember to-ion" />
        </div>
      </div>

      <div data-more-wrap className="gutter pb-10 pt-20 lg:pt-28">
        <p className="label mb-6 text-chalk-dim">More from the lab</p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moreProjects.map((m) => (
            <li key={m.title} data-more>
              <a
                href={m.href}
                target="_blank"
                rel="noreferrer"
                className="group flex h-full flex-col rounded-2xl border hairline bg-void-800/60 p-6 transition-colors duration-500 hover:border-ember/50 hover:bg-void-800"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="font-display text-xl font-bold uppercase leading-tight">{m.title}</span>
                  <span className="text-chalk-dim transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ember">↗</span>
                </span>
                <span className="mt-3 text-sm leading-relaxed text-chalk/65">{m.desc}</span>
                <span className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {m.stack.map((s) => (
                    <span key={s} className="chip !py-1 !text-[0.58rem]">
                      {s}
                    </span>
                  ))}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
