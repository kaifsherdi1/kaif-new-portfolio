import { useRef } from 'react'
import { gsap } from '../animations/gsap'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'

/** Tilts its child toward the pointer in 3D and moves a light spot across it. */
export default function TiltCard({ children, className = '', max = 10 }) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const inner = useRef(null)
  const glare = useRef(null)
  const on = fine && !reduce

  const move = (e) => {
    if (!on) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(inner.current, { rotateY: x * max * 2, rotateX: -y * max * 2, duration: 0.6, ease: 'power3.out' })
    gsap.to(glare.current, { opacity: 1, x: `${x * 100}%`, y: `${y * 100}%`, duration: 0.6 })
  }
  const leave = () => {
    if (!on) return
    gsap.to(inner.current, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1, 0.5)' })
    gsap.to(glare.current, { opacity: 0, duration: 0.6 })
  }

  return (
    <div className={className} style={{ perspective: '1200px' }} onPointerMove={move} onPointerLeave={leave}>
      <div ref={inner} className="relative h-full" style={{ transformStyle: 'preserve-3d' }}>
        {children}
        <div
          ref={glare}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0"
          style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.12), transparent 55%)' }}
        />
      </div>
    </div>
  )
}
