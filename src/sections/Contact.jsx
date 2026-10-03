import { useRef, useState } from 'react'
import { gsap } from '../animations/gsap'
import { revealSplit, rise } from '../animations/scroll'
import { useGsap } from '../hooks/useGsap'
import { useFinePointer } from '../hooks/useMedia'
import { profile, socials } from '../data/profile'

/** A round button that leans toward the pointer. */
function Magnetic({ children, href }) {
  const el = useRef(null)
  const fine = useFinePointer()
  const move = (e) => {
    if (!fine) return
    const r = el.current.getBoundingClientRect()
    gsap.to(el.current, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.6, ease: 'power3.out' })
  }
  const leave = () => gsap.to(el.current, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' })
  return (
    <a
      ref={el}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Message Kaif on WhatsApp (opens in a new tab)"
      onPointerMove={move}
      onPointerLeave={leave}
      data-cursor="WhatsApp"
      className="group relative grid h-44 w-44 shrink-0 place-items-center overflow-hidden rounded-full bg-ember text-void sm:h-56 sm:w-56"
    >
      <span className="absolute inset-0 translate-y-full rounded-full bg-chalk transition-transform duration-700 ease-expo group-hover:translate-y-0" />
      <span className="relative px-6 text-center font-display text-sm font-extrabold uppercase leading-tight sm:text-base">{children}</span>
    </a>
  )
}

export default function Contact() {
  const root = useRef(null)
  const [copied, setCopied] = useState(false)

  useGsap(
    () => {
      const q = gsap.utils.selector(root)
      revealSplit(q('[data-split]'), root.current, { stagger: 0.07, duration: 1.4 })
      rise(q('[data-rise]'), q('[data-rise]')[0], { stagger: 0.08 })
    },
    [],
    root,
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section ref={root} id="contact" className="gutter relative overflow-hidden pb-16 pt-28 sm:pt-40">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-ember/15 blur-[140px]" />

      <div className="relative">
        <p className="section-index mb-8">06 — Contact</p>
        <h2 aria-label="Let's build something great" className="font-display text-[8.6vw] font-extrabold uppercase leading-[0.86] tracking-[-0.04em] lg:text-[8.2vw]">
          <span aria-hidden="true" className="block">
            <span className="mask">
              <span data-split className="inline-block">Let&rsquo;s build</span>
            </span>
          </span>
          <span aria-hidden="true" className="flex flex-wrap items-center gap-x-[3vw]">
            <span className="mask">
              <span data-split className="inline-block text-outline">something</span>
            </span>
            <span className="mask">
              <span data-split className="inline-block text-gradient">great.</span>
            </span>
          </span>
        </h2>

        <div className="mt-16 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div data-rise className="max-w-xl">
            <p className="text-xl leading-relaxed text-chalk/75">
              Have a product to build, a dashboard to tame or a team that needs a React + Laravel developer? My inbox is open.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" onClick={copy} className="btn-ghost normal-case" aria-live="polite">
                <span className="font-sans text-base tracking-normal">{copied ? 'Copied to clipboard ✓' : profile.email}</span>
              </button>
              <a href={profile.phoneHref} className="btn-ghost">
                {profile.phone}
              </a>
            </div>
          </div>
          <div data-rise>
            <Magnetic href={`${profile.whatsapp}?text=${encodeURIComponent("Hi Kaif, I saw your portfolio and would like to connect.")}`}>Get in touch</Magnetic>
          </div>
        </div>

        <ul data-rise className="mt-20 grid grid-cols-1 border-t hairline min-[420px]:grid-cols-2 lg:grid-cols-4">
          {socials.map((s) => (
            <li key={s.label} className="border-b hairline lg:border-b-0 lg:border-r lg:last:border-r-0">
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-center justify-between gap-3 px-1 py-5 sm:px-6 sm:py-6"
              >
                <span className="font-display text-lg font-bold uppercase transition-colors group-hover:text-ember sm:text-xl">{s.label}</span>
                <span className="text-chalk-dim transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ember">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
