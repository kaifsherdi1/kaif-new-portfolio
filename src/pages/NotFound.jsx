import { TransitionLink } from '../components/PageTransition'
import { useMeta } from '../hooks/useMeta'

export default function NotFound() {
  useMeta({ title: 'Not found', description: 'This page does not exist.' })
  return (
    <section className="gutter relative grid min-h-screen place-items-center text-center">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="relative">
        <p className="font-mono text-sm text-ember">// error 404 — route not found</p>
        <h1 className="mt-4 font-display text-mega font-extrabold uppercase text-gradient">404</h1>
        <p className="mt-6 text-lg text-chalk/70">That endpoint returned nothing. Let&rsquo;s get you back.</p>
        <TransitionLink to="/" className="btn-solid mt-10">
          <span>Back home</span>
        </TransitionLink>
      </div>
    </section>
  )
}
