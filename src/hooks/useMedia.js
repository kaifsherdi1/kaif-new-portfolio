import { useEffect, useState } from 'react'
import { MEDIA } from '../animations/gsap'

export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMediaQuery(MEDIA.reduce)
export const useIsDesktop = () => useMediaQuery(MEDIA.desktop)
export const useFinePointer = () => useMediaQuery(MEDIA.fine)
