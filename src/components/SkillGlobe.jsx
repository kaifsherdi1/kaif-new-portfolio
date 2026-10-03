import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useMedia'

/**
 * Words spread evenly over a sphere (Fibonacci lattice), projected to 2D each
 * frame. It spins on its own, leans toward the pointer and can be dragged.
 * DOM text keeps it crisp and readable for screen readers.
 */
export default function SkillGlobe({ words }) {
  const box = useRef(null)
  const items = useRef([])
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = box.current
    const n = words.length
    const pts = words.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = i * Math.PI * (3 - Math.sqrt(5))
      return [Math.cos(t) * r, y, Math.sin(t) * r]
    })

    let ax = 0.3
    let ay = 0
    let vx = reduce ? 0 : 0.0018
    let vy = reduce ? 0 : 0.0042
    let drag = null
    let visible = true
    let raf

    const render = () => {
      const R = el.clientWidth * 0.42
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay)
      pts.forEach(([x, y, z], i) => {
        // rotate around Y then X
        const x1 = x * cy + z * sy
        const z1 = -x * sy + z * cy
        const y2 = y * cx - z1 * sx
        const z2 = y * sx + z1 * cx
        const s = (z2 + 2.2) / 3.2
        const node = items.current[i]
        if (!node) return
        node.style.transform = `translate(-50%, -50%) translate3d(${x1 * R}px, ${y2 * R}px, 0) scale(${s})`
        node.style.opacity = String(0.18 + ((z2 + 1) / 2) * 0.82)
        node.style.zIndex = String(Math.round(s * 100))
        node.style.color = z2 > 0.55 ? 'var(--ember)' : ''
      })
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      if (!drag) {
        ax += vx
        ay += vy
        // ease back toward the idle spin
        vx += ((reduce ? 0 : 0.0018) - vx) * 0.02
        vy += ((reduce ? 0 : 0.0042) - vy) * 0.02
      }
      render()
    }
    render()
    tick()

    const down = (e) => {
      drag = { x: e.clientX, y: e.clientY }
      el.setPointerCapture?.(e.pointerId)
    }
    const move = (e) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      drag = { x: e.clientX, y: e.clientY }
      ay += dx * 0.006
      ax += dy * 0.006
      vy = dx * 0.0012
      vx = dy * 0.0012
      render()
    }
    const up = () => (drag = null)
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [words, reduce])

  return (
    <div
      ref={box}
      data-cursor="Drag"
      className="relative mx-auto aspect-square w-full max-w-[34rem] touch-pan-y select-none"
      role="img"
      aria-label={`Skills: ${words.join(', ')}`}
    >
      <div aria-hidden="true" className="absolute inset-[8%] rounded-full border border-chalk/[0.06]" />
      <div aria-hidden="true" className="absolute inset-[20%] rounded-full bg-gradient-to-br from-ember/15 to-ion/15 blur-3xl" />
      <div aria-hidden="true" className="absolute inset-[8%] rounded-full border border-dashed border-chalk/[0.05] [transform:rotateX(70deg)]" />
      {words.map((w, i) => (
        <span
          key={w}
          ref={(n) => (items.current[i] = n)}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 whitespace-nowrap font-display text-[clamp(0.85rem,1.6vw,1.25rem)] font-bold uppercase text-chalk will-change-transform"
        >
          {w}
        </span>
      ))}
    </div>
  )
}
