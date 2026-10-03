import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, EASE } from '../animations/gsap'
import { lockScroll } from '../animations/scroll'
import { useIsoLayoutEffect } from '../hooks/useGsap'
import { TransitionLink } from './PageTransition'
import { useExperience } from '../context/ExperienceContext'
import { nav, profile, socials } from '../data/profile'

export default function NavBar() {
  const { entered, menuOpen, setMenuOpen } = useExperience()
  const { pathname } = useLocation()
  const bar = useRef(null)
  const menu = useRef(null)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  // hidden until the loader is gone, then slides in
  useIsoLayoutEffect(() => {
    if (!entered) {
      gsap.set(bar.current, { yPercent: -120 })
      return
    }
    const t = gsap.to(bar.current, { yPercent: 0, duration: 1.2, ease: EASE.out, delay: 0.4 })
    return () => t.kill()
  }, [entered])

  // hide on scroll down, show on scroll up
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 400)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight the section in view (home only)
  useEffect(() => {
    if (pathname !== '/') return setActive('')
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname, entered])

  // mobile menu
  useEffect(() => {
    const el = menu.current
    if (!el) return
    if (menuOpen) {
      lockScroll(true)
      gsap
        .timeline()
        .set(el, { visibility: 'visible' })
        .fromTo(el, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.9, ease: EASE.inOut })
        .fromTo(el.querySelectorAll('[data-item]'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: EASE.out, stagger: 0.05 }, 0.35)
    } else {
      lockScroll(false)
      gsap
        .timeline()
        .to(el, { clipPath: 'circle(0% at 100% 0%)', duration: 0.7, ease: EASE.inOut })
        .set(el, { visibility: 'hidden' })
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setMenuOpen])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[120] transition-transform duration-700 ease-expo ${hidden && !menuOpen ? '-translate-y-full' : ''}`}>
        <div ref={bar}>
        <div className={`gutter flex h-[var(--nav-h)] items-center justify-between transition-colors duration-500 ${scrolled && !menuOpen ? 'bg-void/70 backdrop-blur-xl' : ''}`}>
          <TransitionLink to="/" aria-label={`${profile.fullName} — home`} className="group flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-chalk/15 font-display text-sm font-extrabold">
              <span className="absolute inset-0 translate-y-full bg-ember transition-transform duration-500 ease-expo group-hover:translate-y-0" />
              <span className="relative">KS</span>
            </span>
            <span className="hidden font-display text-sm font-bold uppercase tracking-wide sm:block">
              {profile.firstName} <span className="text-chalk-dim">{profile.lastName}</span>
            </span>
          </TransitionLink>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="glass flex items-center gap-1 rounded-full p-1.5">
              {nav.map((n) => (
                <li key={n.id}>
                  <TransitionLink
                    to={`/#${n.id}`}
                    className={`relative block rounded-full px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors duration-300 ${active === n.id ? 'bg-chalk text-void' : 'text-chalk-dim hover:text-chalk'}`}
                  >
                    {n.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a href={`mailto:${profile.email}`} className="btn-solid hidden !py-2.5 md:inline-flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-mint" />
              <span>Hire me</span>
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="grid h-11 w-11 place-items-center rounded-full border border-chalk/15 lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 top-0 h-px w-full bg-chalk transition-transform duration-500 ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
                <span className={`absolute bottom-0 left-0 h-px w-full bg-chalk transition-transform duration-500 ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        style={{ visibility: 'hidden' }}
        className="gutter fixed inset-0 z-[110] flex flex-col justify-between bg-void pb-10 pt-[calc(var(--nav-h)+4vh)] lg:hidden"
        aria-hidden={!menuOpen}
      >
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <ul className="relative space-y-1">
          {nav.map((n, i) => (
            <li key={n.id} className="overflow-hidden">
              <TransitionLink to={`/#${n.id}`} tabIndex={menuOpen ? 0 : -1} data-item className="flex items-baseline gap-4 py-1">
                <span className="label text-ember">0{i + 1}</span>
                <span className="font-display text-[7.2vw] font-extrabold uppercase leading-none sm:text-[3.25rem]">{n.label}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="relative flex flex-wrap gap-2">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1} className="chip">
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
