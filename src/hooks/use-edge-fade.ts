import { useEffect, useState } from "react"

/**
 * For a row that scrolls sideways: fades out each edge only while more
 * content sits beyond it, so a scrolled row never ends in a hard cut on one
 * side and a fade on the other. Returns the ref for the row and the style
 * (a CSS mask) to put on it.
 */
export function useEdgeFade<T extends HTMLElement>(fade = "2rem") {
  // A callback ref, so it also works for a row that mounts later.
  const [el, ref] = useState<T | null>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  useEffect(() => {
    if (!el) return
    const update = () =>
      setEdges({
        left: el.scrollLeft > 2,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
      })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    el.addEventListener("scroll", update, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener("scroll", update)
    }
  }, [el])

  const left = edges.left ? `transparent, black ${fade}` : "black, black"
  const right = edges.right
    ? `black calc(100% - ${fade}), transparent`
    : "black, black"
  const style =
    edges.left || edges.right
      ? {
          maskImage: `linear-gradient(to right, ${left}), linear-gradient(to right, ${right})`,
          maskComposite: "intersect",
          WebkitMaskImage: `linear-gradient(to right, ${left}), linear-gradient(to right, ${right})`,
          WebkitMaskComposite: "source-in",
        }
      : undefined

  return { ref, style }
}
