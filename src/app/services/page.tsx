"use client"

import { useState } from "react"
import Link from "next/link"

import { ArrowRightIcon, CircleCheckBig } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SoftwareViewerPanel,
  AiViewerPanel,
} from "./_components/code-viewer-panel"
import { PartnersSection } from "./_components/partners-section"
import { WhyRantAISection } from "./_components/why-rantai-section"
import { softwareEngineering, aiEngineering, partners, whyRantAI } from "./data"

/* ────────────────────────────────────────────────────────────────────────────
   SVG grid pattern for CTA background
   ──────────────────────────────────────────────────────────────────────────── */
function GridPattern() {
  const size = 32
  const cols = 48
  const rows = 16
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="grid"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"software" | "ai">("software")
  const currentTab =
    activeTab === "software" ? softwareEngineering : aiEngineering

  return (
    <div>
      <Navbar />

      <main className="pt-16">
        {/* ── 1. Hero ──────────────────────────────────────────────── */}
        <MotionInView>
          <section className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-24 lg:px-0">
            <motion.h1
              className="text-6xl font-medium tracking-tight sm:text-8xl lg:text-9xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              Services.
            </motion.h1>
            <motion.p
              className="max-w-96 text-right leading-relaxed text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              Ship better software.
              <br />
              Faster than your team can plan it.
            </motion.p>
          </section>
        </MotionInView>

        {/* ── 2. Title Bar ─────────────────────────────────────────── */}
        <MotionInView>
          <OutlineSection className="flex items-center justify-center px-6 py-24">
            <h2 className="text-2xl tracking-tight italic sm:text-3xl lg:text-4xl">
              Focused on outcomes you can measure.
            </h2>
          </OutlineSection>
        </MotionInView>

        {/* ── 3. What We Do ────────────────────────────────────────── */}
        <MotionInView>
          <OutlineSection className="flex flex-col lg:flex-row">
            {/* Left panel — dynamic content based on active tab */}
            <div className="flex flex-1 flex-col justify-center p-8">
              <AnimatePresence mode="wait">
                <motion.h3
                  key={currentTab.title}
                  className="text-2xl font-normal lg:text-4xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentTab.title}
                </motion.h3>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTab.description}
                  className="mt-2 text-base leading-snug font-light text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  {currentTab.description}
                </motion.p>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.ul
                  key={activeTab + "-features"}
                  className="mt-6 flex flex-col gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {currentTab.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CircleCheckBig className="size-5 text-muted-foreground" />
                      <span className="text-base font-light text-muted-foreground">
                        {feat}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>

            {/* Right panel — tabs + content viewer */}
            <Tabs
              className="max-w-1/2 min-w-1/2 gap-4"
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "software" | "ai")}
            >
              <div className="px-4 pt-16">
                <TabsList className="w-full">
                  <TabsTrigger value="software" className="flex-1">
                    Software Engineering
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex-1">
                    AI Engineering
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="software">
                <SoftwareViewerPanel data={softwareEngineering} />
              </TabsContent>
              <TabsContent value="ai">
                <AiViewerPanel data={aiEngineering} />
              </TabsContent>
            </Tabs>
          </OutlineSection>
        </MotionInView>

        {/* ── 4. Our Partners ──────────────────────────────────────── */}
        <PartnersSection partners={partners} />

        {/* ── 5. Why RantAI ────────────────────────────────────────── */}
        <WhyRantAISection items={whyRantAI} />

        {/* ── 6. CTA ───────────────────────────────────────────────── */}
        <MotionInView>
          <OutlineSection>
            <div className="relative flex items-center justify-center overflow-hidden px-6 py-24 lg:min-h-[500px] lg:py-0">
              <GridPattern />
              <div className="relative z-10 flex max-w-[892px] flex-col items-center gap-6 text-center">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl lg:text-[32px]">
                    Stop paying for slow, fragile software.
                  </h2>
                  <p className="text-sm text-white/60 lg:text-base">
                    Get a free technical audit. We&apos;ll identify the biggest
                    risk in your stack — no commitment required.
                  </p>
                </div>
                <Link
                  href="/#contact"
                  className="group flex items-center justify-between border bg-foreground px-4 py-4 text-background transition-colors duration-300"
                >
                  <span className="font-mono font-medium tracking-wider uppercase">
                    GET MY FREE AUDIT
                  </span>
                  <ArrowRightIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </OutlineSection>
        </MotionInView>
      </main>

      <Footer />
    </div>
  )
}
