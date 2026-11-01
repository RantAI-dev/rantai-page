"use client"

import { useMediaQuery } from "@/hooks/use-media-query"

/** Enhanced scrolling is for mouse/trackpad desktops; touch keeps native inertia. */
export function useDesktopMotion() {
  return useMediaQuery(
    "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  )
}
