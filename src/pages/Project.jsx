import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import ProjectVisual from '../components/ProjectVisual'
import TiltCard from '../components/TiltCard'
import Footer from '../components/Footer'
import { TransitionLink } from '../components/PageTransition'
import { gsap, EASE } from '../animations/gsap'
import { rise } from '../animations/scroll'
import { useIntro } from '../hooks/useIntro'
import { useGsap } from '../hooks/useGsap'
import { useMeta } from '../hooks/useMeta'
import { projects, getProject } from '../data/projects'
import NotFound from './NotFound'
import { fitTitle } from '../animations/fit'

const pad = (n) => String(n).padStart(2, '0')

export default function Project() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound />
  return <ProjectCase key={slug} project={project} />
}

function ProjectCase({ project }) {
  const root = useRef(null)
  const index = projects.indexOf(project)
  const next = projects[(index + 1) % projects.length]

  useMeta({ title: project.title, description: project.summary })

  useIntro(root, (tl) => {
    const q = gsap.utils.selector(root)
    tl.fromTo(q('[data-char]'), { yPercent: 120 }, { yPercent: 0, duration: 1.2, ease: EASE.out, stagger: 0.03 }, 0.1)
      .fromTo(q('[data-fade]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: EASE.out, stagger: 0.07 }, 0.35)
      .fromTo(q('[data-shot]'), { opacity: 0, y: 120, rotateX: 25 }, { opacity: 1, y: 0, rotateX: 0, duration: 1.6, ease: EASE.out }, 0.4)
  })

  useGsap(
    () => {
      const q = gsap.utils.selector(root)
      rise(q('[data-point]'), q('[data-points]')[0], { stagger: 0.07 })
      rise(q('[data-metric]'), q('[data-metrics]')[0], { stagger: 0.1 })
    },
    [],
    root,
  )

  const links = [
    project.live && { label: 'Live site', href: project.live },
    project.repo && { label: 'Source code', href: project.repo },
    project.extraRepo,
  ].filter(Boolean)

  return (
    <article ref={root} className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[80vh]" style={{ background: `radial-gradient(ellipse at 70% 0%, ${project.hue}26, transparent 60%)` }} />
      <header className="gutter relative pb-14 pt-[calc(var(--nav-h)+8vh)]">
        <div data-fade className="label mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-chalk-dim">
          <TransitionLink to="/#work" className="group inline-flex items-center gap-2 hover:text-chalk">
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-x-1">←</span> All work
          </TransitionLink>
          <span>Case {pad(index + 1)} / {pad(projects.length)}</span>
          <span style={{ color: project.hue }}>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h1 aria-label={project.title} className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.045em]" style={{ fontSize: fitTitle(project.title, { max: '9rem' }) }}>
          {project.title.split(' ').map((word, w) => (
            <span key={w} aria-hidden="true" className="mr-[0.25em] inline-block whitespace-nowrap">
              {Array.from(word).map((c, i) => (
                <span key={i} className="mask">
                  <span data-char className="inline-block">{c}</span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p data-fade className="mt-6 max-w-3xl font-display text-big font-bold text-chalk/80">
          {project.tagline}
        </p>
      </header>

      <div className="gutter relative" style={{ perspective: '1600px' }}>
        <div data-shot>
          <TiltCard max={4}>
            <div className="aspect-[16/10] overflow-hidden rounded-[2rem] border hairline lg:aspect-[16/8.5]">
              <ProjectVisual project={project} />
            </div>
          </TiltCard>
        </div>
      </div>

      <div data-metrics className="gutter mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {project.metrics.map((m) => (
          <div
            key={m.label}
            data-metric
            className="flex min-w-0 items-baseline justify-between gap-4 rounded-2xl border hairline bg-void-800/70 px-5 py-4 [container-type:inline-size] sm:block sm:p-6 lg:p-7"
          >
            <p
              className="whitespace-nowrap font-display text-2xl font-extrabold leading-none sm:[font-size:var(--fit)]"
              style={{ color: project.hue, '--fit': fitTitle(m.value, { max: '3.5rem', space: '100cqw', ratio: 1.2 }) }}
            >
              {m.value}
            </p>
            <p className="label text-right text-chalk-dim sm:mt-2 sm:text-left">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="gutter grid gap-14 py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label mb-4 text-chalk-dim">Overview</p>
          <p className="text-lg leading-relaxed text-chalk/85">{project.summary}</p>
          {project.clients && (
            <>
              <p className="label mb-4 mt-10 text-chalk-dim">Clients</p>
              <ul className="space-y-2">
                {project.clients.map((c) => (
                  <li key={c} className="font-display text-lg font-bold uppercase">{c}</li>
                ))}
              </ul>
            </>
          )}
          <p className="label mb-4 mt-10 text-chalk-dim">Stack</p>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <li key={t} className="chip">{t}</li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <p className="label mb-6 text-chalk-dim">What I built</p>
          <ol data-points className="border-t hairline">
            {project.points.map((pt, i) => (
              <li key={pt} data-point className="flex gap-6 border-b hairline py-6">
                <span className="label pt-1" style={{ color: project.hue }}>{pad(i + 1)}</span>
                <span className="text-[1.05rem] leading-relaxed text-chalk/85">{pt}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {links.length > 0 && (
        <section aria-label="Project links" className="border-t hairline">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="Open"
              aria-label={`${l.label} (opens in a new tab)`}
              className="gutter group relative flex items-center justify-between gap-6 overflow-hidden border-b hairline py-8"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-void-800 transition-transform duration-700 ease-expo group-hover:scale-y-100" />
              <span className="relative font-display text-[clamp(2rem,6vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] transition-transform duration-700 ease-expo group-hover:translate-x-[2vw]">
                {l.label} <span className="text-ember">↗</span>
              </span>
              <span className="label relative hidden text-chalk-dim sm:block">{l.href.replace(/^https:\/\/|\/$/g, '')}</span>
            </a>
          ))}
        </section>
      )}

      <section aria-label="Next project" className="border-t hairline">
        <TransitionLink to={`/work/${next.slug}`} data-cursor="Next" className="gutter group relative block overflow-hidden py-20 sm:py-28">
          <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-expo group-hover:scale-y-100" style={{ background: `${next.hue}14` }} />
          <span className="label relative mb-6 block text-chalk-dim">Next project — {pad(((index + 1) % projects.length) + 1)}</span>
          <span className="relative flex items-center gap-[3vw] font-display font-extrabold uppercase leading-[0.85] tracking-[-0.045em]" style={{ fontSize: fitTitle(next.title, { max: '9rem', extra: '12vw' }) }}>
            <span className="min-w-0 transition-transform duration-700 ease-expo group-hover:translate-x-[2vw]">{next.title}</span>
            <span aria-hidden="true" className="arrow-x inline-block text-ember">→</span>
          </span>
        </TransitionLink>
      </section>
      <Footer />
    </article>
  )
}
