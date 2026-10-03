import { lazy, Suspense, useCallback, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import NavBar from './components/NavBar'
import { PageTransitionProvider } from './components/PageTransition'
import Home from './pages/Home'
import { useExperience } from './context/ExperienceContext'
import { initSmoothScroll, lockScroll } from './animations/scroll'
import { ScrollTrigger } from './animations/gsap'

const Project = lazy(() => import('./pages/Project'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const { phase, setPhase } = useExperience()

  useEffect(() => {
    const destroy = initSmoothScroll()
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return destroy
  }, [])

  useEffect(() => {
    lockScroll(phase === 'loading')
    if (phase === 'entered') ScrollTrigger.refresh()
  }, [phase])

  const onLoaded = useCallback(() => setPhase('entered'), [setPhase])

  return (
    <PageTransitionProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {phase === 'loading' && <Loader onDone={onLoaded} />}
      <NavBar />
      <main id="main" tabIndex={-1} aria-hidden={phase === 'loading'}>
        <Suspense fallback={<div className="h-screen bg-void" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<Project />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Cursor />
      <div className="noise" aria-hidden="true" />
    </PageTransitionProvider>
  )
}
