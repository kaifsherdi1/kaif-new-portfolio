import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import IdBadge from '../components/IdBadge'
import { TransitionLink } from '../components/PageTransition'
import { gsap, EASE, ScrollTrigger } from '../animations/gsap'
import { useIntro } from '../hooks/useIntro'
import { useGsap } from '../hooks/useGsap'
import { useReducedMotion } from '../hooks/useMedia'
import { profile, stats } from '../data/profile'
import { experience } from '../data/experience'

const HeroScene = lazy(() => import('../components/HeroScene'))

function RoleTicker() {
  const [i, setI] = useState(0)
  const el = useRef(null)
  useEffect(() => {
    const id = setInterval(() => {
      gsap.to(el.current, {
        yPercent: -110,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          setI((n) => (n + 1) % profile.roles.length)
          gsap.fromTo(el.current, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: EASE.out })
        },
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="mask align-bottom">
      <span ref={el} className="inline-block text-gradient">
        {profile.roles[i]}
      </span>
    </span>
  )
}

export default function Hero() {
  const root = useRef(null)
  const reduce = useReducedMotion()
  const current = experience[0]

  useIntro(root, (tl) => {
    const q = gsap.utils.selector(root)
    tl.fromTo(q('[data-scene]'), { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 2.4, ease: EASE.out }, 0)
      .fromTo(q('[data-char]'), { yPercent: 120, rotate: 8 }, { yPercent: 0, rotate: 0, duration: 1.3, ease: EASE.out, stagger: 0.035 }, 0.15)
      .fromTo(q('[data-fade]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, ease: EASE.out, stagger: 0.08 }, 0.6)
      .fromTo(q('[data-stat]'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.08 }, 0.9)
      .add(() => {
        q('[data-count]').forEach((n) => {
          const target = Number(n.dataset.count)
          const o = { v: 0 }
          gsap.to(o, { v: target, duration: 2, ease: 'power3.out', onUpdate: () => (n.textContent = Math.round(o.v)) })
        })
      }, 1)
  })

  // as the hero scrolls away, the copy drifts up and fades
  useGsap(
    () => {
      if (reduce) return
      const q = gsap.utils.selector(root)
      gsap.to(q('[data-drift]'), {
        yPercent: -18,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      return () => ScrollTrigger.getAll().forEach((t) => t.trigger === root.current && t.kill())
    },
    [reduce],
    root,
  )

  const nameLines = [
    { text: profile.firstName, cls: '' },
    { text: profile.middleName, cls: 'text-outline' },
    { text: profile.lastName, cls: 'text-gradient' },
  ]

  return (
    <section ref={root} id="top" className="relative min-h-[100svh] overflow-hidden">
      {/* backdrop */}
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[40rem] w-[40rem] rounded-full bg-ion/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-20 top-0 h-[36rem] w-[36rem] rounded-full bg-ember/10 blur-[140px]" />
      {!reduce && (
        <div data-scene className="absolute inset-0 opacity-0">
          <Suspense fallback={null}>
            <HeroScene className="h-full w-full" />
          </Suspense>
        </div>
      )}

      <div className="gutter relative z-10 grid min-h-[100svh] grid-cols-1 items-center gap-6 pb-10 pt-[calc(var(--nav-h)+3vh)] lg:grid-cols-12">
        <div data-drift className="lg:col-span-7 xl:col-span-8">
          <div data-fade className="mb-6 flex flex-wrap items-center gap-2">
            <span className="chip !border-mint/30 !text-mint">
              <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
              Available for work
            </span>
            <span className="chip">
              Now · {current.role} @ {current.company}
            </span>
          </div>

          <h1 aria-label={profile.fullName} className="font-display text-[15vw] font-extrabold uppercase leading-[0.84] tracking-[-0.04em] lg:text-[8vw] xl:text-[9.2vw] 2xl:text-[10rem]">
            {nameLines.map((line) => (
              <span key={line.text} aria-hidden="true" className="block whitespace-nowrap">
                {Array.from(line.text).map((c, i) => (
                  <span key={i} className="mask">
                    <span data-char className={`inline-block ${line.cls}`}>
                      {c}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p data-fade className="mt-6 font-display text-big font-bold">
            <RoleTicker />
          </p>
          <p data-fade className="mt-5 max-w-xl text-lg leading-relaxed text-chalk/75">
            {profile.intro}
          </p>
          <div data-fade className="mt-8 flex flex-wrap gap-3">
            <TransitionLink to="/#work" className="btn-solid">
              <span>View my work</span>
              <span aria-hidden="true">↓</span>
            </TransitionLink>
            <a href={profile.resumes[0].href} download className="btn-ghost">
              Download resume <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="relative -mt-4 flex justify-center self-start lg:col-span-5 lg:-mt-[calc(var(--nav-h)+3vh)] xl:col-span-4">
          <IdBadge />
        </div>
      </div>

      <div className="gutter relative z-10 pb-10">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-chalk/[0.06] md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} data-stat className="min-w-0 bg-void/80 p-4 backdrop-blur-md sm:p-6">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="font-display text-[clamp(1.8rem,4.5vw,3.75rem)] font-extrabold leading-none">
                  <span data-count={s.value}>{s.value}</span>
                  <span className="text-ember">{s.suffix}</span>
                </span>
                <span aria-hidden="true" className="label mt-2 block text-chalk-dim">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
