"use client"

import { useEffect, useState } from "react"

export type SectionLink = { id: string; label: string }

/**
 * Keeps the URL in sync with the section being read: the address bar shows
 * #proof while you are on Proof, so a copied link opens right there, and
 * opening such a link lands on that section. Renders nothing.
 */
export function SectionNav({
  sections,
}: Readonly<{ sections: SectionLink[] }>) {
  const [active, setActive] = useState<string | null>(null)

  // Opening /page#section: wait for the page to settle (pinned sections
  // change height after they load), then land on the section.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    const el = id ? document.getElementById(id) : null
    if (!el) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- nothing to land on
      setReady(true)
      return
    }
    const t = setTimeout(() => {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 72,
        behavior: "instant",
      })
      setReady(true)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  // Which section is under a line 40% down the screen.
  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.4
      let current: string | null = null
      for (const s of sections) {
        const r = document.getElementById(s.id)?.getBoundingClientRect()
        if (r && r.top <= line && r.bottom > line) current = s.id
      }
      setActive(current)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [sections])

  // Keep the URL pointing at that section, without adding history entries.
  useEffect(() => {
    if (!ready) return
    const url = window.location.pathname + window.location.search
    const next = active ? `${url}#${active}` : url
    if (next !== url + window.location.hash) {
      window.history.replaceState(window.history.state, "", next)
    }
  }, [active, ready])

  return null
}
