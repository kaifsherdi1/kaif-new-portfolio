import { createContext, useContext, useMemo, useState } from 'react'

/**
 * phase:   'loading' → 'entered'
 * covered: true while the page-transition curtain hides the screen
 * ready:   the page is visible, so section intros may play
 */
const ExperienceContext = createContext(null)

export function ExperienceProvider({ children }) {
  const [phase, setPhase] = useState('loading')
  const [covered, setCovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const value = useMemo(
    () => ({
      phase,
      setPhase,
      covered,
      setCovered,
      menuOpen,
      setMenuOpen,
      entered: phase === 'entered',
      ready: phase === 'entered' && !covered,
    }),
    [phase, covered, menuOpen],
  )

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
}

export function useExperience() {
  const ctx = useContext(ExperienceContext)
  if (!ctx) throw new Error('useExperience must be used inside <ExperienceProvider>')
  return ctx
}
