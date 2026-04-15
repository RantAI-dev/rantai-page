"use client"

import { useRef, useState } from "react"
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "motion/react"
import {
  ShieldCheckIcon,
  MapPinIcon,
  BookOpenIcon,
  LayoutTemplateIcon,
  LayersIcon,
  LockIcon,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "./ui/badge"

export function StickyScrollSections() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const [activeSection, setActiveSection] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.35) setActiveSection(0)
    else if (latest < 0.65) setActiveSection(1)
    else setActiveSection(2)
  })

  // Morph transition variants for the inner content
  const variants = {
    initial: { opacity: 0, filter: "blur(12px)", scale: 0.98, y: 20 },
    animate: { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 },
    exit: { opacity: 0, filter: "blur(12px)", scale: 1.02, y: -20 },
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full py-20"
      style={{ height: "250vh" }}
    >
      <div className="sticky top-[10vh] px-4 md:px-8">
        {/* SINGLE STICKY CARD WRAPPER WITH LAYOUT MORPH */}
        <motion.div
          // layout // Enables height morphing as content swaps
          initial={{ opacity: 0, scale: 0.6, y: 30, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          // className="relative flex w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-6"
          className="max-w-7xl mx-auto rounded-[16px] border border-border bg-card p-4 shadow-2xl md:p-6"
        >
          {/* Animated Header Area */}
          <motion.div layout className="mb-8 flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative size-3.75 shrink-0 overflow-hidden rounded-full border border-white"
              >
                <motion.div
                  initial={false}
                  animate={{ scale: activeSection >= i ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "backOut" }}
                  className="absolute inset-0 origin-center bg-white"
                />
              </div>
            ))}
            <div className="relative ml-2 flex h-8 items-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={activeSection}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-xl font-light tracking-wide text-white"
                >
                  {activeSection === 0 && "VISION & MISSION"}
                  {activeSection === 1 && "OUR PLATFORMS"}
                  {activeSection === 2 && "WHY RANTAI"}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Shared Content Container with AnimatePresence */}
          <motion.div layout className="relative w-full">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeSection}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full"
              >
                {activeSection === 0 && <VisionMissionContent />}
                {activeSection === 1 && <OurPlatformsContent />}
                {activeSection === 2 && <WhyRantaiContent />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// ------ Inner Components (Figma Designs) ------

function VisionMissionContent() {
  return (
    <div className="flex w-full flex-col gap-8 md:flex-row">
      <div className="flex flex-1 flex-col gap-8">
        <div>
          <h2 className="mb-2 text-3xl font-normal text-white md:text-4xl">
            Vision
          </h2>
          <p className="font-mono text-muted-foreground">
            To be Indonesia&apos;s leading AI products company — enabling
            government and enterprise to operate intelligently through
            production-grade AI platforms.
          </p>
        </div>

        {/* Divider */}
        <Separator />

        <div>
          <h2 className="mb-2 text-3xl font-normal text-white md:text-4xl">
            Mission
          </h2>
          <ul className="ml-6 list-disc space-y-4 font-mono text-muted-foreground">
            <li>
              Build AI products that are production-ready, not just demos —
              solving real business and government operational challenges.
            </li>
            <li>
              Democratize access to AI capabilities through platforms that
              don&apos;t require deep technical expertise to use.
            </li>
            <li>
              Provide engineering services that help organizations go from AI
              strategy to deployed, measurable outcomes.
            </li>
            <li>
              Develop local AI talent through hands-on education in AI
              engineering and software development.
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <Separator orientation="vertical" />

      <div className="relative hidden min-h-100 w-full shrink-0 overflow-hidden rounded-[8px] md:block md:w-100">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
      </div>
    </div>
  )
}

function OurPlatformsContent() {
  return (
    <div className="w-full">
      <h2 className="mb-10 text-3xl leading-tight font-normal text-white md:text-4xl">
        Three platforms.
        <br />
        One intelligence layer.
      </h2>

      <div className="flex flex-col gap-0">
        {/* Agents */}
        <div className="flex flex-col items-stretch gap-8 rounded-xl p-6 transition-colors hover:bg-white/4 md:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="size-3 rounded-full bg-[#bb7851]" />
              <span className="font-mono text-xl font-light text-white/80">
                01
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-normal text-white">RantAI Agents</h3>
              <p className="font-mono text-sm font-light text-muted-foreground">
                Enterprise AI Platforms
              </p>
            </div>
            <p className="leading-relaxed font-light text-white/80">
              Enterprise-grade AI agent platform for building knowledge-driven
              applications — with RAG pipelines, multi-channel deployment, and
              human-in-the-loop workflows. Think of it as hiring an always-on
              expert employee who reads your entire document library and never
              forgets.
            </p>
          </div>
          <div className="relative hidden w-full shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5 md:block md:w-125">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
          </div>
        </div>

        <Separator />

        {/* Analytics and ZeroCode */}
        <div className="flex flex-col items-stretch gap-0 md:flex-row">
          {/* Analytics */}
          <div className="flex flex-1 flex-col gap-4 rounded-xl p-6 transition-colors hover:bg-white/4">
            <div className="mb-2 flex items-center gap-3">
              <div className="size-3 rounded-full bg-[#0d63d0]" />
              <span className="font-mono text-xl font-light text-white/80">
                02
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-normal text-white">
                RantAI Analytics
              </h3>
              <p className="font-mono text-sm font-light text-muted-foreground">
                AI-Powered Business Intelligence
              </p>
            </div>
            <p className="leading-relaxed font-light text-white/80">
              Your entire data warehouse, queryable in plain language. Like
              having a senior SQL engineer on call 24/7 — except it also
              explains the data and visualizes it automatically.
            </p>
          </div>

          <Separator orientation="vertical" />

          {/* ZeroCode */}
          <div className="flex flex-1 flex-col gap-4 rounded-xl p-6 transition-colors hover:bg-white/4">
            <div className="mb-2 flex items-center gap-3">
              <div className="size-3 rounded-full bg-[#80cb87]" />
              <span className="font-mono text-xl font-light text-white/80">
                03
              </span>
              <Badge className="bg-[#dbf0dd] text-[#255a2a]">COMING SOON</Badge>
            </div>
            <div>
              <h3 className="text-3xl font-normal text-white">
                RantAI ZeroCode
              </h3>
              <p className="font-mono text-sm font-light text-muted-foreground">
                Autonomous Dev Environment
              </p>
            </div>
            <p className="leading-relaxed font-light text-white/80">
              A fully autonomous development environment where AI agents manage
              entire projects — from requirements to deployment. Not just code
              snippets; complete production software.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function WhyRantaiContent() {
  const items = [
    {
      title: "Products, not just services",
      desc: "We build and own our platforms, guaranteeing long-term roadmap continuity independent of any single vendor or engagement.",
      color: "bg-[#388ca1]",
      icon: LayoutTemplateIcon,
    },
    {
      title: "No vendor lock-in",
      desc: "Support for 100+ LLMs means you can switch model providers without rebuilding anything. Your stack stays yours.",
      color: "bg-[#32836a]",
      icon: ShieldCheckIcon,
    },
    {
      title: "Local expertise",
      desc: "Deep understanding of Indonesian government regulations and compliance requirements — built into the architecture from day one.",
      color: "bg-[#bb7851]",
      icon: MapPinIcon,
    },
    {
      title: "Production-grade, always",
      desc: "Deployed in real production environments across government and enterprise. Built for scale, security, and operational reliability.",
      color: "bg-[#574399]",
      icon: LayersIcon,
    },
    {
      title: "End-to-end capability",
      desc: "One partner for the full lifecycle — from AI strategy and architecture design to deployment, monitoring, and ongoing support.",
      color: "bg-[#bb5153]",
      icon: LockIcon,
    },
    {
      title: "Open standards",
      desc: "Built on open-source foundations for full auditability. No black boxes, no proprietary traps, no hidden dependencies.",
      color: "bg-[#517fbb]",
      icon: BookOpenIcon,
    },
  ]

  return (
    <div className="w-full">
      <div className="mb-10 flex flex-col items-end justify-between gap-8 md:flex-row">
        <h2 className="text-3xl leading-tight font-normal text-white md:text-4xl">
          Built different.
          <br />
          Deployed for real.
        </h2>
        <p className="max-w-125 font-mono text-sm font-light text-muted-foreground md:text-base">
          Most AI vendors sell potential. We ship production systems — and we
          have the receipts to prove it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={`group border-border p-8 transition-colors hover:bg-white/3 ${
              i % 3 < 2 ? "border-r" : ""
            } ${i < 3 ? "border-b" : ""}`}
          >
            <div
              className={`${item.color} mb-6 flex size-12 items-center justify-center rounded-lg shadow-lg shadow-black/20`}
            >
              <item.icon className="size-6 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-normal text-white">
              {item.title}
            </h3>
            <p className="font-mono text-sm leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
