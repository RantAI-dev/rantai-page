"use client"

import { useEffect, useRef } from "react"

// Hero background: a panorama ring of product screens seen from inside a
// cylinder (centre card smallest, edges curving toward you), with the large
// ASCII Earth rising in front of it.

type Shot = {
  src: string
  /** How the screenshot is scaled/shifted inside its card (claw is cropped). */
  size: number
  x: number
  y: number
}

const agents: Shot = {
  src: "/products/rantai-agents-chat.png",
  size: 1,
  x: 0,
  y: 0,
}
const claw: Shot = {
  src: "/products/rantai-claw-console.png",
  size: 1.1035,
  x: -0.0517,
  y: -0.0573,
}
const lake = (name: string): Shot => ({
  src: `/products/lake-${name}.jpg`,
  size: 1,
  x: 0,
  y: 0,
})

/** A card shows a screenshot (bent in strips) or a demo video (one panel). */
type Item = { shot: Shot } | { video: string }
const vid = (path: string): Item => ({ video: `/videos/${path}.mp4` })

// The ring's order is shuffled on every visit (see `arrange`).
const items: Item[] = [
  { shot: agents },
  { shot: lake("dashboard") },
  vid("rantai-claw/claw-demo"),
  vid("rantai-agents/rag-prompt"),
  { shot: lake("home") },
  { shot: claw },
  vid("rantai-agents/prompt-artifact"),
  { shot: lake("login") },
  { shot: agents },
  vid("rantai-agents/skills"),
  { shot: claw },
  { shot: lake("dashboard") },
  vid("rantai-agents/file-upload"),
  { shot: claw },
  { shot: lake("home") },
  vid("rantai-claw/claw-demo"),
]
const CARDS = items.length

/** Which product a card belongs to, so neighbours can be kept apart. */
const productOf = (item: Item) => {
  const src = "shot" in item ? item.shot.src : item.video
  return src.includes("lake")
    ? "lake"
    : src.includes("claw")
      ? "claw"
      : "agents"
}

/**
 * A random order of the cards for the ring's first `used` slots, where no
 * two neighbours (the last and first included, as it is a circle) show the
 * same product. Returns each card's slot; slots from `used` on are hidden.
 */
function arrange(used: number): number[] {
  const all = items.map((_, i) => i)
  for (let attempt = 0; attempt < 200; attempt++) {
    const left = [...all]
    const order: number[] = []
    while (order.length < CARDS) {
      const prev = order.at(-1)
      const inRing = order.length < used
      const last = order.length === used - 1
      const options = left.filter(
        (c) =>
          !inRing ||
          ((prev === undefined ||
            productOf(items[c]) !== productOf(items[prev])) &&
            (!last || productOf(items[c]) !== productOf(items[order[0]])))
      )
      if (!options.length) break
      const pick = options[Math.floor(Math.random() * options.length)]
      order.push(pick)
      left.splice(left.indexOf(pick), 1)
    }
    if (order.length === CARDS) {
      const slot: number[] = []
      order.forEach((card, i) => (slot[card] = i))
      return slot
    }
  }
  return all // fallback: the authored order
}
const STRIPS = 14 // vertical slices per card, so each card bends with the ring
const ASPECT = 0.62 // card height / width

/* ----------------------------- ASCII Earth ----------------------------- */

const ramp = " .,:;-=+*#%@"
function hash(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}
function noise3(x: number, y: number, z: number) {
  const ix = Math.floor(x),
    iy = Math.floor(y),
    iz = Math.floor(z)
  const fx = x - ix,
    fy = y - iy,
    fz = z - iz
  const u = (v: number) => v * v * (3 - 2 * v)
  const l = (a: number, b: number, t: number) => a + (b - a) * t
  const c = (dx: number, dy: number, dz: number) =>
    hash(ix + dx, iy + dy, iz + dz)
  return l(
    l(
      l(c(0, 0, 0), c(1, 0, 0), u(fx)),
      l(c(0, 1, 0), c(1, 1, 0), u(fx)),
      u(fy)
    ),
    l(
      l(c(0, 0, 1), c(1, 0, 1), u(fx)),
      l(c(0, 1, 1), c(1, 1, 1), u(fx)),
      u(fy)
    ),
    u(fz)
  )
}

const SCRAMBLE = "@#%*+=-:;.01xX/<>"

function drawEarth(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  spin: number,
  /** Cursor in canvas pixels, with 0–1 strength (fades in and out). */
  lamp: { x: number; y: number; k: number }
) {
  ctx.clearRect(0, 0, w, h)
  const radius = Math.max(w, h) * 0.75
  const cx = w / 2
  const cy = h + radius * 0.58
  // Dark body behind the characters, so the ring is hidden by the planet.
  // It fades out past the rim, letting the cards sink softly behind it
  // instead of being cut by a hard edge.
  const outer = radius * 1.1
  const body = ctx.createRadialGradient(cx, cy, 0, cx, cy, outer)
  body.addColorStop(0, "rgba(0,0,0,1)")
  body.addColorStop(0.8 / 1.1, "rgba(0,0,0,1)")
  body.addColorStop(0.95 / 1.1, "rgba(0,0,0,0.8)")
  body.addColorStop(1, "rgba(0,0,0,0)")
  ctx.fillStyle = body
  ctx.fillRect(0, 0, w, h)
  const cell = 12
  const cw = cell * 0.62
  ctx.font = `500 ${cell - 1}px ui-monospace, SFMono-Regular, Menlo, monospace`
  ctx.textBaseline = "top"
  const buckets: number[][] = ramp.split("").map(() => [])
  // Characters under the cursor: brighter, and some flicker to random glyphs.
  const lit: { x: number; y: number; a: number; c: string }[] = []
  const reach = 150
  for (let y = 0; y < h; y += cell) {
    for (let x = 0; x < w; x += cw) {
      const nx = (x - cx) / radius
      const ny = (y - cy) / radius
      const d2 = nx * nx + ny * ny
      if (d2 > 1) continue
      const nz = Math.sqrt(1 - d2)
      const rx = nx * Math.cos(spin) + nz * Math.sin(spin)
      const rz = -nx * Math.sin(spin) + nz * Math.cos(spin)
      const land =
        noise3(rx * 3 + 10, ny * 3, rz * 3) * 0.65 +
        noise3(rx * 7, ny * 7, rz * 7) * 0.35
      const light = Math.max(0, nx * -0.35 + ny * -0.75 + nz * 0.55)
      const rim = Math.pow(1 - nz, 3)
      const v = Math.min(
        0.999,
        (land > 0.52 ? 0.55 + land * 0.5 : 0.12 + land * 0.15) *
          (0.25 + light) +
          rim * 0.9
      )
      const i = Math.floor(v * ramp.length)
      if (lamp.k > 0) {
        const d = Math.hypot(x - lamp.x, y - lamp.y)
        if (d < reach) {
          const f = (1 - d / reach) ** 2 * lamp.k
          const c =
            Math.random() < f * 0.35
              ? SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
              : ramp[Math.max(i, 2)]
          lit.push({ x, y, a: Math.min(1, 0.1 + i * 0.06 + f * 0.8), c })
          continue
        }
      }
      if (i > 0) buckets[i].push(x, y)
    }
  }
  buckets.forEach((cells, i) => {
    ctx.fillStyle = `rgba(255,255,255,${0.08 + i * 0.06})`
    for (let k = 0; k < cells.length; k += 2)
      ctx.fillText(ramp[i], cells[k], cells[k + 1])
  })
  for (const l of lit) {
    ctx.fillStyle = `rgba(255,255,255,${l.a})`
    ctx.fillText(l.c, l.x, l.y)
  }
}

/* ------------------------------ Panorama ------------------------------ */

export function HeroPanorama() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const earthRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const scene = sceneRef.current
    const ring = ringRef.current
    const canvas = earthRef.current
    const ctx = canvas?.getContext("2d")
    if (!scene || !ring || !canvas || !ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Every piece on the ring: screenshot strips and video panels.
    const strips = [...ring.querySelectorAll<HTMLElement>("[data-card]")]
    let seeded = false
    let slots: number[] = []
    let slotsFor = -1
    let angles: number[] = []
    let centres: number[] = [] // each strip's card centre angle
    let R = 1000
    let dim = 1
    let frame = 0
    let lastNow = 0
    let lastScroll = window.scrollY
    let boost = 0
    let rot = 0
    let earthSpin = 0
    let dragging = false
    let dragX = 0
    let dragVel = 0
    let tiltX = 0
    let tiltY = 0
    let lampK = 0
    const pointer = { x: -999, y: -999, tx: 0, ty: 0, inside: false }
    let lastEarth = 0
    let visible = false

    const layout = () => {
      const w = scene.clientWidth
      const h = scene.clientHeight
      // Camera sits at the ring's centre: perspective equals the radius.
      // Size by height: the front card runs from near the top down to the
      // buttons (about 68% of the hero).
      // Phones: a shorter card so the headline keeps a calm background.
      const narrow = w < 640
      const cardH = h * (narrow ? 0.34 : 0.68)
      const cardW = cardH / ASPECT
      R = Math.max(cardW * 1.4, w * 0.75)
      const gap = cardW * 0.07
      // Fit a whole (even) number of cards around the ring so the last card
      // never lands on top of the first; extra cards are hidden.
      const fit = Math.max(
        2,
        Math.floor((Math.PI * 2 * R) / (cardW + gap) / 2) * 2
      )
      const used = Math.min(CARDS, fit)
      const step = (Math.PI * 2) / used
      const sliceW = cardW / STRIPS
      const sliceA = sliceW / R
      scene.style.perspective = `${R}px`
      ring.style.top = `${h * (narrow ? 0.24 : 0.43)}px`
      dim = narrow ? 0.55 : 1
      angles = []
      centres = []
      // Start on a random card, so a returning visitor sees a different
      // product first.
      // A fresh random order per visit (and if the number of cards that fit
      // changes on resize).
      if (slotsFor !== used) {
        slots = arrange(used)
        slotsFor = used
      }
      if (!seeded) {
        rot = Math.floor(Math.random() * used) * step
        seeded = true
      }
      strips.forEach((el) => {
        const card = Number(el.dataset.card)
        const slot = slots[card]
        el.dataset.off = slot >= used ? "1" : ""
        const item = items[card]
        if (!("shot" in item)) {
          // A video panel: one flat card at the card's angle.
          angles.push(slot * step)
          centres.push(slot * step)
          el.style.width = `${cardW}px`
          el.style.height = `${cardH}px`
          el.style.marginLeft = `${-cardW / 2}px`
          el.style.marginTop = `${-cardH / 2}px`
          el.style.borderRadius = "14px"
          return
        }
        const shot = item.shot
        const i = Number(el.dataset.strip)
        const a = slot * step + (i - STRIPS / 2 + 0.5) * sliceA
        angles.push(a)
        centres.push(slot * step)
        el.style.width = `${sliceW + 2}px`
        el.style.height = `${cardH}px`
        el.style.marginLeft = `${-sliceW / 2}px`
        el.style.marginTop = `${-cardH / 2}px`
        el.style.backgroundSize = `${cardW * shot.size}px auto`
        el.style.backgroundPosition = `${cardW * shot.x - i * sliceW}px ${cardH * shot.y}px`
        el.style.borderRadius =
          i === 0 ? "14px 0 0 14px" : i === STRIPS - 1 ? "0 14px 14px 0" : "0"
      })
      lastEarth = 0
    }

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - (lastNow || now)) / 1000)
      lastNow = now
      // Scroll speed briefly speeds up the spin, then it settles.
      const y = window.scrollY
      const speed = Math.abs(y - lastScroll) / Math.max(dt, 0.016)
      lastScroll = y
      boost += (Math.min(1.2, speed / 900) - boost) * 0.08
      if (!reduce) {
        if (!dragging) {
          // Let go of a drag: glide on, then return to the idle drift.
          dragVel *= 0.94
          rot += dragVel
        }
        rot -= dt * (0.035 + boost * 0.25)
        earthSpin += dt * (0.06 + boost * 0.5)
      }
      // Ease the cursor tilt and the lamp toward their targets.
      tiltX += (pointer.tx - tiltX) * 0.06
      tiltY += (pointer.ty - tiltY) * 0.06
      lampK += ((pointer.inside ? 1 : 0) - lampK) * 0.1
      scene.style.perspectiveOrigin = `${50 + tiltX * 10}% ${50 + tiltY * 8}%`
      // Parallax as the hero scrolls away. It lives inside the 3D transform:
      // opacity or a separate translate here would flatten the ring.
      const away = Math.max(0, -scene.getBoundingClientRect().top)
      ring.style.transform = `translateY(${away * 0.12}px) translateZ(${R}px) rotateY(${rot}rad)`
      canvas.style.transform = `translate(${-tiltX * 10}px, ${away * 0.3 - tiltY * 6}px)`
      strips.forEach((el, k) => {
        const a = angles[k]
        // Angle from straight ahead, wrapped to [-π, π].
        // The strip ends up turned by (ring rotation - its own angle).
        let rel = (rot - a) % (Math.PI * 2)
        if (rel > Math.PI) rel -= Math.PI * 2
        if (rel < -Math.PI) rel += Math.PI * 2
        const shown = Math.abs(rel) < 1.2 && !el.dataset.off
        el.style.transform = `rotateY(${-a}rad) translateZ(${-R}px)`
        el.style.visibility = shown ? "visible" : "hidden"
        // Dim toward the sides so the centre stays calm. Measured from the
        // card's centre, so every strip of a card gets the same filter and
        // no seams show between them.
        let cardRel = (rot - centres[k]) % (Math.PI * 2)
        if (cardRel > Math.PI) cardRel -= Math.PI * 2
        if (cardRel < -Math.PI) cardRel += Math.PI * 2
        el.style.filter = `grayscale(1) brightness(${((0.75 - Math.min(0.35, Math.abs(cardRel) * 0.5)) * dim).toFixed(3)})`
        // Videos only play while their card is in view.
        const video = el.firstElementChild
        if (video instanceof HTMLVideoElement) {
          const play = shown && !reduce
          if (play && video.paused) video.play().catch(() => {})
          else if (!play && !video.paused) video.pause()
        }
      })
      if (now - lastEarth > (lampK > 0.01 ? 33 : 50)) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        if (
          canvas.width !== Math.round(w * dpr) ||
          canvas.height !== Math.round(h * dpr)
        ) {
          canvas.width = Math.round(w * dpr)
          canvas.height = Math.round(h * dpr)
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        const r = canvas.getBoundingClientRect()
        drawEarth(ctx, w, h, earthSpin, {
          x: pointer.x - r.left,
          y: pointer.y - r.top,
          k: reduce ? 0 : lampK,
        })
        lastEarth = now
      }
      frame = visible && !reduce ? requestAnimationFrame(render) : 0
    }

    // Pointer: tilt and lamp follow the cursor; drag spins the panorama.
    // The dark hero card (the scene sits in a pointer-events-none wrapper).
    const card = scene.closest<HTMLElement>(".dark") ?? scene
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const r = card.getBoundingClientRect()
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2
      pointer.inside = true
      if (dragging) {
        const dx = e.clientX - dragX
        dragX = e.clientX
        const step = (dx / Math.max(1, R)) * 1.2
        rot += step
        dragVel = step
      }
    }
    const onLeave = () => {
      pointer.inside = false
      pointer.tx = 0
      pointer.ty = 0
      dragging = false
      card.style.cursor = ""
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return
      if ((e.target as HTMLElement).closest("a,button,input,textarea")) return
      dragging = true
      dragX = e.clientX
      dragVel = 0
      card.style.cursor = "grabbing"
      card.style.userSelect = "none"
    }
    const onUp = () => {
      dragging = false
      card.style.cursor = ""
      card.style.userSelect = ""
    }
    if (!reduce) {
      card.addEventListener("pointermove", onMove)
      card.addEventListener("pointerleave", onLeave)
      card.addEventListener("pointerdown", onDown)
      window.addEventListener("pointerup", onUp)
    }

    layout()
    const ro = new ResizeObserver(() => {
      layout()
      if (!frame) frame = requestAnimationFrame(render)
    })
    ro.observe(scene)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) frame = requestAnimationFrame(render)
    })
    io.observe(scene)
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      card.removeEventListener("pointermove", onMove)
      card.removeEventListener("pointerleave", onLeave)
      card.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        ref={ringRef}
        className="absolute left-1/2 [transform-style:preserve-3d]"
      >
        {items.map((item, card) =>
          "shot" in item ? (
            Array.from({ length: STRIPS }, (_, i) => (
              <div
                key={`${card}-${i}`}
                data-card={card}
                data-strip={i}
                className="absolute top-0 left-0 bg-neutral-900 bg-no-repeat [backface-visibility:hidden]"
                style={{ backgroundImage: `url(${item.shot.src})` }}
              />
            ))
          ) : (
            <div
              key={card}
              data-card={card}
              className="absolute top-0 left-0 overflow-hidden bg-neutral-900 [backface-visibility:hidden]"
            >
              <video
                src={item.video}
                muted
                loop
                playsInline
                preload="metadata"
                className="size-full object-cover object-top-left"
              />
            </div>
          )
        )}
      </div>
      <canvas ref={earthRef} className="absolute inset-0 size-full" />
      {/* Shade behind the headline and copy */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_44%_30%_at_50%_58%,rgb(0_0_0/0.85),transparent)]" />
      <div className="absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[12%] bg-gradient-to-t from-black/80 to-transparent" />
      {/* Quiet patch behind the partner logos */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_42%_14%_at_50%_90%,rgb(0_0_0/0.95)_40%,transparent)]" />
    </div>
  )
}
