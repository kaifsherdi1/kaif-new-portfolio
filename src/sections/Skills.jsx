import { useRef } from 'react'
import { gsap } from '../animations/gsap'
import { revealSplit, rise } from '../animations/scroll'
import { useGsap } from '../hooks/useGsap'
import SplitText from '../components/SplitText'
import SkillGlobe from '../components/SkillGlobe'
import { skillGroups, globeSkills } from '../data/skills'

export default function Skills() {
  const root = useRef(null)

  useGsap(
    () => {
      const q = gsap.utils.selector(root)
      revealSplit(q('[data-title] [data-split]'), root.current, { stagger: 0.06 })
      rise(q('[data-globe]'), q('[data-globe]')[0], { y: 80 })
      rise(q('[data-group]'), q('[data-groups]')[0], { stagger: 0.07 })
    },
    [],
    root,
  )

  return (
    <section ref={root} id="skills" className="gutter relative overflow-hidden py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-40 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-ion/[0.07] blur-[120px]" />
      <div className="relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="section-index mb-5">04 — Skills</p>
          <h2 data-title className="font-display text-huge font-extrabold uppercase">
            <SplitText text="The toolkit" />
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-chalk/70">
            React and Laravel at the core, with everything around them needed to take a product from Figma to production — state,
            auth, real-time, testing and deployment.
          </p>
          <p className="label mt-6 text-chalk-dim">Drag the globe ↻</p>
        </div>
        <div data-globe>
          <SkillGlobe words={globeSkills} />
        </div>
      </div>

      <ul data-groups className="relative mt-20 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {skillGroups.map((g) => (
          <li key={g.title} data-group className="glow-border group rounded-2xl border hairline bg-void-800/70 p-6 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold uppercase">{g.title}</h3>
              <span aria-hidden="true" className="text-xl text-ember transition-transform duration-700 group-hover:rotate-180">
                {g.icon}
              </span>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <li key={s} className="chip !py-1 transition-colors duration-300 hover:!border-ember hover:!text-chalk">
                  {s}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
