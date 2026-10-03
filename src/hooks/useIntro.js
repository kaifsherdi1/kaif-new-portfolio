import { useEffect, useRef } from 'react'
import { gsap } from '../animations/gsap'
import { useGsap } from './useGsap'
import { useExperience } from '../context/ExperienceContext'

/**
 * Builds a paused entrance timeline on mount (elements start hidden, no flash)
 * and plays it once the page is actually visible.
 */
export function useIntro(scope, build) {
  const { ready } = useExperience()
  const tlRef = useRef(null)
  const played = useRef(false)

  useGsap(() => {
    const tl = gsap.timeline({ paused: true })
    build(tl)
    tlRef.current = tl
    played.current = false
  }, [], scope)

  useEffect(() => {
    if (ready && !played.current && tlRef.current) {
      played.current = true
      tlRef.current.play()
    }
  }, [ready])
}
