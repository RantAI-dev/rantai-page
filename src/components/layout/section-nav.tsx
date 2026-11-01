"use client"

import { useEffect } from "react"

export type SectionLink = { id: string; label: string }

/** Shareable section URLs, updated only after scrolling has settled. */
export function SectionNav({
  sections,
}: Readonly<{ sections: SectionLink[] }>) {
  useEffect(() => {
    let landing: ReturnType<typeof setTimeout> | undefined
    let idle: ReturnType<typeof setTimeout> | undefined
    let touching = false

    const updateUrl = () => {
      if (landing !== undefined || touching) return
      const line = window.innerHeight * 0.4
      let active: string | null = null
      for (const section of sections) {
        const rect = document
          .getElementById(section.id)
          ?.getBoundingClientRect()
        if (rect && rect.top <= line && rect.bottom > line) active = section.id
      }
      const url = window.location.pathname + window.location.search
      const next = active ? `${url}#${active}` : url
      if (next !== url + window.location.hash) {
        window.history.replaceState(window.history.state, "", next)
      }
    }

    // No layout reads, React updates or history writes during a swipe.
    // The timer covers browsers without scrollend; inertia resets it.
    const schedule = () => {
      clearTimeout(idle)
      idle = setTimeout(updateUrl, 250)
    }
    const settled = () => {
      clearTimeout(idle)
      updateUrl()
    }
    const cancelLanding = () => {
      clearTimeout(landing)
      landing = undefined
    }
    const touchStart = () => {
      touching = true
      clearTimeout(idle)
      cancelLanding()
    }
    const touchEnd = () => {
      touching = false
      schedule()
    }
    const keyDown = (event: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      ) {
        cancelLanding()
      }
    }

    // A direct link may need correction after hydration. Cancel it as soon
    // as the visitor takes control, instead of pulling them back mid-gesture.
    let id = ""
    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {}
    const target = id ? document.getElementById(id) : null
    if (target) {
      landing = setTimeout(() => {
        landing = undefined
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 72,
          behavior: "instant",
        })
        schedule()
      }, 400)
    } else {
      schedule()
    }

    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("scrollend", settled)
    window.addEventListener("resize", schedule)
    window.addEventListener("wheel", cancelLanding, { passive: true })
    window.addEventListener("touchstart", touchStart, { passive: true })
    window.addEventListener("touchend", touchEnd, { passive: true })
    window.addEventListener("touchcancel", touchEnd, { passive: true })
    window.addEventListener("keydown", keyDown)
    return () => {
      clearTimeout(landing)
      clearTimeout(idle)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("scrollend", settled)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("wheel", cancelLanding)
      window.removeEventListener("touchstart", touchStart)
      window.removeEventListener("touchend", touchEnd)
      window.removeEventListener("touchcancel", touchEnd)
      window.removeEventListener("keydown", keyDown)
    }
  }, [sections])

  return null
}
