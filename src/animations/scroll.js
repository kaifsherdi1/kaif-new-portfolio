import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion, EASE } from './gsap'

let lenis = null

/** Lenis on GSAP's ticker so smooth scroll and ScrollTrigger share one clock. */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function lockScroll(locked) {
  document.documentElement.classList.toggle('is-locked', locked)
  if (!lenis) return
  locked ? lenis.stop() : lenis.start()
}

export function scrollTo(target, { immediate = false, offset = 0 } = {}) {
  if (lenis) {
    // the route may have just changed — re-measure so the old page height doesn't clamp the jump
    lenis.resize()
    lenis.scrollTo(target, { offset, immediate, force: true, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
  else document.querySelector(target)?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
}

/** Fade and rise a group as it enters the viewport. */
export function rise(targets, trigger, { stagger = 0.08, start = 'top 85%', y = 50 } = {}) {
  if (prefersReducedMotion()) {
    return gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: 0.4, scrollTrigger: { trigger, start } })
  }
  return gsap.fromTo(
    targets,
    { y, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: EASE.out, stagger, scrollTrigger: { trigger, start } },
  )
}

/** Masked line/char reveal: children of `[data-split]` slide up from below the mask. */
export function revealSplit(targets, trigger, { stagger = 0.04, start = 'top 85%', duration = 1.2 } = {}) {
  if (prefersReducedMotion()) {
    return gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, duration: 0.4, scrollTrigger: { trigger, start } })
  }
  return gsap.fromTo(
    targets,
    { yPercent: 115, rotate: 4 },
    { yPercent: 0, rotate: 0, duration, ease: EASE.out, stagger, scrollTrigger: trigger ? { trigger, start } : undefined },
  )
}
