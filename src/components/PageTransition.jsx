import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, EASE, ScrollTrigger, prefersReducedMotion } from '../animations/gsap'
import { lockScroll, scrollTo } from '../animations/scroll'
import { useIsoLayoutEffect } from '../hooks/useGsap'
import { useExperience } from '../context/ExperienceContext'
import { getProject } from '../data/projects'

const TransitionContext = createContext(null)

const frames = (n = 2) =>
  new Promise((res) => {
    const step = () => (n-- <= 0 ? res() : requestAnimationFrame(step))
    requestAnimationFrame(step)
  })

const waitFor = async (selector, tries = 60) => {
  for (let i = 0; i < tries; i++) {
    if (document.querySelector(selector)) return
    await frames(1)
  }
}

function titleFor(pathname) {
  const [, first, second] = pathname.split('/')
  if (!first) return 'Home'
  if (first === 'work' && second) return getProject(second)?.title ?? 'Project'
  return 'Lost'
}

/**
 * A two-tone curtain (ember, then void) rises from the bottom, holds the
 * destination title, swaps the route underneath, then lifts away.
 */
export function PageTransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setCovered, setMenuOpen, entered } = useExperience()
  const accent = useRef(null)
  const panel = useRef(null)
  const title = useRef(null)
  const busy = useRef(false)
  const [heading, setHeading] = useState('')
  const path = useRef(location.pathname)
  path.current = location.pathname

  useIsoLayoutEffect(() => {
    gsap.set([accent.current, panel.current], { yPercent: 100 })
  }, [])

  /** `to` may carry a hash (e.g. "/#work") — we scroll to it after the swap. */
  const go = useCallback(
    async (to) => {
      if (busy.current || !entered) return
      const url = new URL(to, window.location.origin)
      setMenuOpen(false)

      if (url.pathname === path.current) {
        if (url.hash) scrollTo(url.hash, { offset: -10 })
        else scrollTo(0)
        return
      }

      busy.current = true
      lockScroll(true)
      setHeading(titleFor(url.pathname))
      const reduce = prefersReducedMotion()

      await gsap
        .timeline()
        .set(title.current, { yPercent: 110 })
        .to(accent.current, { yPercent: 0, duration: reduce ? 0.01 : 0.7, ease: EASE.inOut })
        .to(panel.current, { yPercent: 0, duration: reduce ? 0.01 : 0.7, ease: EASE.inOut }, reduce ? 0 : 0.12)
        .to(title.current, { yPercent: 0, duration: reduce ? 0.01 : 0.6, ease: EASE.out }, '-=0.25')
        .then()

      setCovered(true)
      navigate(url.pathname + url.hash)
      await frames(3)
      window.scrollTo(0, 0)
      scrollTo(0, { immediate: true })
      if (url.hash) {
        await waitFor(url.hash)
        await frames(2)
        ScrollTrigger.refresh()
        scrollTo(url.hash, { immediate: true })
      }
      ScrollTrigger.refresh()
      setCovered(false)
      lockScroll(false)

      await gsap
        .timeline()
        .to(title.current, { yPercent: -110, duration: reduce ? 0.01 : 0.45, ease: 'power2.in' })
        .to(panel.current, { yPercent: -100, duration: reduce ? 0.01 : 0.8, ease: EASE.inOut }, reduce ? 0 : 0.15)
        .to(accent.current, { yPercent: -100, duration: reduce ? 0.01 : 0.8, ease: EASE.inOut }, reduce ? 0 : 0.27)
        .set([accent.current, panel.current], { yPercent: 100 })
        .then()

      document.getElementById('main')?.focus({ preventScroll: true })
      busy.current = false
    },
    [entered, navigate, setCovered, setMenuOpen],
  )

  return (
    <TransitionContext.Provider value={go}>
      {children}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[190]">
        <div ref={accent} className="absolute inset-0 bg-gradient-to-br from-ember to-ion" />
        <div ref={panel} className="absolute inset-0 grid place-items-center bg-void">
          <span className="mask">
            <span ref={title} className="block px-4 text-center font-display text-[clamp(2rem,6.2vw,6.5rem)] font-extrabold uppercase leading-[0.9]">
              {heading}
              <span className="text-ember">.</span>
            </span>
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}

export const useTransitionNavigate = () => useContext(TransitionContext)

/** Drop-in <a> that routes through the curtain. Modified clicks keep browser behaviour. */
export function TransitionLink({ to, children, onClick, ...rest }) {
  const go = useTransitionNavigate()
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        go(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
