import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.config({ nullTargetWarn: false })

export const EASE = {
  out: 'expo.out',
  inOut: 'expo.inOut',
  soft: 'power3.out',
}

const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches

export const MEDIA = {
  desktop: '(min-width: 1024px)',
  fine: '(hover: hover) and (pointer: fine)',
  reduce: '(prefers-reduced-motion: reduce)',
}

export const prefersReducedMotion = () => mq(MEDIA.reduce)
export const isDesktop = () => mq(MEDIA.desktop)
export const hasFinePointer = () => mq(MEDIA.fine)

export { gsap, ScrollTrigger }
