import { useEffect, useLayoutEffect } from 'react'
import { gsap } from '../animations/gsap'

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** Runs `setup` in a gsap.context scoped to `scope`; reverts everything on unmount / deps change. */
export function useGsap(setup, deps = [], scope) {
  useIsoLayoutEffect(() => {
    let cleanup
    const ctx = gsap.context((self) => {
      cleanup = setup(self)
    }, scope?.current ?? undefined)
    return () => {
      if (typeof cleanup === 'function') cleanup()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
