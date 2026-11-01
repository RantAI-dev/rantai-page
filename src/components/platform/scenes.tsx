"use client"

import { useSyncExternalStore } from "react"
import { motion, type MotionValue } from "motion/react"

import DotGrid from "@/components/effects/dot-grid"
import GhostFibers from "@/components/effects/ghost-fibers"
import LineWaves from "@/components/effects/line-waves"
import { hasFastWebGL } from "@/lib/webgl-support"

// A backdrop per product panel (three from React Bits, one in plain CSS),
// kept monochrome and quiet so it supports the screen instead of competing.
// They render at 1x: they sit dimmed behind a mask, so extra pixels only
// cost GPU time (and battery) without showing.

function AgentsScene() {
  // Dots that swell toward the cursor: many small pieces of knowledge
  return (
    <DotGrid
      dotSize={3}
      gap={22}
      baseColor="#2c2c30"
      activeColor="#ffffff"
      proximity={160}
      glow={0.4}
      intro={false}
      clickShock={false}
      dpr={1}
    />
  )
}

const runtimeLog = [
  "runtime   ready",
  "agent     spawned          #3",
  "skill     loaded           research-assistant",
  "skill     loaded           web-search",
  "channel   connected        telegram",
  "task      queued           summarize inbox",
  "task      running          summarize inbox",
  "memory    synced",
  "task      done             summarize inbox",
  "schedule  tick             daily-brief",
  "skill     loaded           summarizer",
  "agent     idle             #3",
]

function ClawScene() {
  return (
    // A runtime log scrolling past, like a terminal left running
    <div className="absolute inset-y-0 right-0 left-[38%] grid grid-cols-2 gap-10 overflow-hidden pr-6 [font-family:ui-monospace,SFMono-Regular,Menlo,monospace] text-[12px] leading-7 text-white/25">
      <style>{`@keyframes claw-log { to { transform: translateY(-50%) } }`}</style>
      {[0, 6].map((offset, c) => (
        <div key={offset} className="overflow-hidden">
          <div
            className="[animation:claw-log_linear_infinite] motion-reduce:animate-none"
            style={{ animationDuration: `${34 + c * 10}s` }}
          >
            {[0, 1].map((copy) =>
              [
                ...runtimeLog.slice(offset),
                ...runtimeLog.slice(0, offset),
                ...runtimeLog,
              ].map((line, i) => (
                <p key={`${copy}-${i}`} className="whitespace-pre">
                  <span className="text-white/15">
                    {String(9 + ((i + c) % 3)).padStart(2, "0")}:
                    {String((i * 7 + c * 13) % 60).padStart(2, "0")}:
                    {String((i * 17) % 60).padStart(2, "0")}
                  </span>{" "}
                  <span
                    className={
                      line.includes("done") || line.includes("ready")
                        ? "text-white/45"
                        : undefined
                    }
                  >
                    {line}
                  </span>
                </p>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function LlmopsScene() {
  return (
    // Bundles of glowing fibres folding through space
    <GhostFibers
      glowColor="#d4d4d8"
      gradient="depth"
      speed={0.25}
      threads={56}
      brightness={0.5}
      glow={0.5}
      grain={0.04}
      vignette={0.4}
      pulseOnClick={false}
      intro={false}
      dpr={1}
    />
  )
}

function LakeScene() {
  // Calm, warped lines like a lake surface
  return (
    <LineWaves
      color1="#ffffff"
      color2="#bdbdc2"
      color3="#6f6f75"
      speed={0.2}
      lineCount={48}
      lineWidth={1}
      brightness={0.35}
      glow={0.3}
      rotation={-12}
      clickRipple={false}
      intro={false}
      maxDevicePixelRatio={1}
    />
  )
}

// Scenes drawn with WebGL; skipped where there is no real GPU.
const webgl = new Set(["agents", "llmops", "lake"])
const noop = () => () => {}

const scenes: Record<string, () => React.ReactNode> = {
  agents: AgentsScene,
  claw: ClawScene,
  llmops: LlmopsScene,
  lake: LakeScene,
}

export function PanelScene({
  id,
  opacity,
  live,
}: Readonly<{ id: string; opacity: MotionValue<number>; live: boolean }>) {
  // Checked in the browser only; the server renders no scene either way.
  const gpu = useSyncExternalStore(noop, hasFastWebGL, () => false)
  const scene = scenes[id]?.()
  if (!scene || (webgl.has(id) && !gpu)) return null
  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_85%_at_62%_50%,#000_30%,transparent_85%)]"
    >
      {/* Only the panel in view (and its neighbours) keeps a canvas running */}
      {live && scene}
    </motion.div>
  )
}
