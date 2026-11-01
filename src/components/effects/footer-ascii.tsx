"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "motion/react"

// Brightness ramp, from empty to dense.
const ramp = " .:-=+*#%@"

function hash(i: number, j: number) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function noise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy) + (hash(ix + 1, iy) - hash(ix, iy)) * ux
  const b = hash(ix, iy + 1) + (hash(ix + 1, iy + 1) - hash(ix, iy + 1)) * ux
  return a + (b - a) * uy
}

/**
 * A field of ASCII characters, in the style of the RantAI Claw terminal.
 * Waves ripple out from the bottom centre along an arc; the middle, where
 * the text sits, stays quieter.
 */
export function FooterAscii({ className }: Readonly<{ className?: string }>) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const cell = 13
    let frame = 0
    let last = 0
    let visible = false
    const start = performance.now()

    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      const pw = Math.round(w * dpr)
      const ph = Math.round(h * dpr)
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw
        canvas.height = ph
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.font = `500 ${cell - 2}px ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textBaseline = "top"

      const t = reduce ? 0 : (now - start) / 1000
      const aspect = w / h
      const radius = aspect < 1 ? 0.8 : 0.95
      const cols = Math.ceil(w / (cell * 0.62))
      const rows = Math.ceil(h / cell)
      const colWidth = w / cols
      const buckets: number[][] = ramp.split("").map(() => [])

      for (let r = 0; r < rows; r++) {
        const y = r / rows
        for (let c = 0; c < cols; c++) {
          const x = c / cols
          const arc = Math.hypot(((x - 0.5) * aspect) / 1.1, 1 - y)
          const wave =
            0.5 +
            0.5 *
              Math.sin(arc * 9 - t * 0.9 + noise(x * 4 + t * 0.15, y * 4) * 3)
          const shell = Math.max(0, 1 - Math.abs(arc - radius) * 1.6)
          const calm = Math.min(1, Math.abs(x - 0.5) * 2.4 + y * 0.2)
          const v = wave * shell * (0.35 + 0.65 * calm)
          const index = Math.min(ramp.length - 1, Math.floor(v * ramp.length))
          if (index > 0) buckets[index].push(c * colWidth, r * cell)
        }
      }

      // One fill colour per character, so the canvas state changes rarely.
      buckets.forEach((cells, i) => {
        if (!cells.length) return
        ctx.fillStyle = `rgba(255,255,255,${0.06 + i * 0.05})`
        for (let k = 0; k < cells.length; k += 2) {
          ctx.fillText(ramp[i], cells[k], cells[k + 1])
        }
      })
    }

    // ~15 fps: the wave is slow and the glyphs change in steps anyway, so
    // more frames don't show, while each one repaints the whole footer.
    const loop = (now: number) => {
      if (now - last > 66) {
        draw(now)
        last = now
      }
      frame = visible && !reduce ? requestAnimationFrame(loop) : 0
    }
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(loop)
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) kick()
    })
    intersection.observe(canvas)
    const resize = new ResizeObserver(() => {
      last = 0
      kick()
    })
    resize.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      intersection.disconnect()
      resize.disconnect()
    }
  }, [reduce])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className ?? ""}`}
    />
  )
}
