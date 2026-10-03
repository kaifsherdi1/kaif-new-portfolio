import { useEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'

/**
 * A small dot plus a soft gradient aura that trails behind. Interactive
 * elements (a, button, [data-cursor]) grow the dot into a ring; `data-cursor="Label"`
 * shows text inside it.
 */
export default function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const dot = useRef(null)
  const aura = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (!fine) return
    document.documentElement.classList.add('has-cursor')
    const d = dot.current
    const a = aura.current
    gsap.set([d, a], { xPercent: -50, yPercent: -50 })
    const dx = gsap.quickTo(d, 'x', { duration: reduce ? 0.01 : 0.18, ease: 'power3.out' })
    const dy = gsap.quickTo(d, 'y', { duration: reduce ? 0.01 : 0.18, ease: 'power3.out' })
    const ax = gsap.quickTo(a, 'x', { duration: reduce ? 0.01 : 0.9, ease: 'power3.out' })
    const ay = gsap.quickTo(a, 'y', { duration: reduce ? 0.01 : 0.9, ease: 'power3.out' })
    let state = ''

    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      ax(e.clientX)
      ay(e.clientY)
      gsap.to([d, a], { opacity: 1, duration: 0.3, overwrite: 'auto' })
    }
    const over = (e) => {
      const el = e.target.closest('a, button, [data-cursor]')
      const text = el?.getAttribute('data-cursor') ?? ''
      const next = el ? `on|${text}` : 'off'
      if (next === state) return
      state = next
      label.current.textContent = text
      gsap.to(d, {
        width: el ? (text ? 92 : 46) : 10,
        height: el ? (text ? 92 : 46) : 10,
        backgroundColor: text ? 'rgba(255,90,31,1)' : el ? 'rgba(244,241,234,0)' : 'rgba(244,241,234,1)',
        borderColor: el ? 'rgba(244,241,234,0.8)' : 'rgba(244,241,234,0)',
        duration: 0.45,
        ease: 'expo.out',
      })
      gsap.to(label.current, { opacity: text ? 1 : 0, duration: 0.25 })
    }
    const leave = () => gsap.to([d, a], { opacity: 0, duration: 0.3 })

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
    }
  }, [fine, reduce])

  if (!fine) return null
  return (
    <>
      <div
        ref={aura}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[140] mix-blend-screen h-[34rem] w-[34rem] rounded-full opacity-0"
        style={{ background: 'radial-gradient(circle, rgba(255,90,31,0.10) 0%, rgba(139,108,255,0.06) 35%, transparent 65%)' }}
      />
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[250] grid h-[10px] w-[10px] place-items-center rounded-full border border-transparent bg-chalk opacity-0"
      >
        <span ref={label} className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-void opacity-0" />
      </div>
    </>
  )
}
