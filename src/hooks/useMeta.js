import { useEffect } from 'react'
import { profile } from '../data/profile'

const SITE = `${profile.fullName} — ${profile.role}`

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/** Per-route title, description and canonical URL. */
export function useMeta({ title, description }) {
  useEffect(() => {
    const full = title ? `${title} — ${profile.fullName}` : SITE
    document.title = full
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', window.location.href)
    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = window.location.origin + window.location.pathname
  }, [title, description])
}
