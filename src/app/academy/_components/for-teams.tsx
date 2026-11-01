"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, CalendarDays, Check, Users } from "lucide-react"

import { Eyebrow } from "@/components/eyebrow"
import { SplitReveal } from "@/components/split-reveal"
import { siteConfig } from "@/lib/config"

// "For teams": three ways a company can use the Academy, each told by a
// small visual. Names and figures are illustrative.

const ease = [0.22, 1, 0.36, 1] as const

function Desk({
  tone,
  children,
}: Readonly<{ tone: string; children: React.ReactNode }>) {
  return (
    <div
      className="flex h-[240px] items-center justify-center overflow-hidden rounded-xl"
      style={{
        backgroundColor: `${tone}10`,
        backgroundImage: `radial-gradient(${tone}2e 1.1px, transparent 1.3px)`,
        backgroundSize: "16px 16px",
      }}
    >
      {children}
    </div>
  )
}

/** A book made for your company: your name on the cover. */
function CustomBook() {
  return (
    <div className="relative h-[180px] w-[136px] transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:-translate-y-1 group-hover:[transform:rotateY(-10deg)]">
      <div className="absolute top-[5px] -right-[6px] bottom-[2px] w-[8px] rounded-r-[3px] bg-[repeating-linear-gradient(90deg,#fff_0_1.5px,#dcdad3_1.5px_2.5px)]" />
      <div className="relative flex size-full flex-col justify-between overflow-hidden rounded-l-[3px] rounded-r-[7px] bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] p-3.5 text-white shadow-[0_24px_40px_-20px_rgba(76,29,149,0.7)]">
        <span className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 to-transparent" />
        <span className="pl-1.5 text-[9px] tracking-[0.12em] text-white/70 uppercase">
          RantAI Academy
        </span>
        <span className="pl-1.5">
          <span className="block text-[15px] leading-tight font-medium">
            GenAI for
            <br />
            Your Company
          </span>
          <span className="mt-1.5 block text-[9px] text-white/60">
            Your data · your use cases
          </span>
        </span>
      </div>
    </div>
  )
}

/** A class with dates and seats. */
function Classes() {
  const days = [
    ["Mon", "Prompting basics"],
    ["Wed", "RAG on your docs"],
    ["Fri", "Build an agent"],
  ]
  return (
    <div className="w-[82%] rounded-xl border border-black/[0.07] bg-white p-3.5 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.35)]">
      <p className="flex items-center gap-1.5 text-[12px] font-medium">
        <CalendarDays className="size-3.5 text-[#0ea5e9]" /> Hands-on cohort
      </p>
      <ul className="mt-3 space-y-2">
        {days.map(([d, t], i) => (
          <li key={d} className="flex items-center gap-2.5 text-[12px]">
            <span className="w-8 rounded-md bg-[#0ea5e9]/10 py-0.5 text-center text-[10.5px] font-medium text-[#0369a1]">
              {d}
            </span>
            <span className="flex-1 text-neutral-700">{t}</span>
            <span
              className="grid size-4 place-items-center rounded-full text-white transition-colors duration-300"
              style={{ background: "#10b981", transitionDelay: `${i * 80}ms` }}
            >
              <Check className="size-2.5" strokeWidth={3.5} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Seats for the whole team. */
function Seats() {
  const people = [
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
  ]
  return (
    <div className="w-[82%] rounded-xl border border-black/[0.07] bg-white p-3.5 shadow-[0_18px_40px_-26px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[12px] font-medium">
          <Users className="size-3.5 text-[#10b981]" /> Team licence
        </p>
        <span className="text-[11px] text-neutral-500 tabular-nums">
          24 / 25 seats
        </span>
      </div>
      <div className="mt-3 flex">
        {people.map((c, i) => (
          <span
            key={c}
            className="-ml-1.5 size-7 rounded-full border-2 border-white transition-[margin] duration-300 group-hover:ml-0.5 first:ml-0"
            style={{ background: c, zIndex: 10 - i }}
          />
        ))}
        <span className="-ml-1.5 grid size-7 place-items-center rounded-full border-2 border-white bg-neutral-100 text-[9px] font-medium text-neutral-500 transition-[margin] duration-300 group-hover:ml-0.5">
          +18
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <span className="block h-full w-[96%] rounded-full bg-[#10b981]" />
      </div>
      <p className="mt-2 text-[11px] text-neutral-500">
        Every book, every update
      </p>
    </div>
  )
}

const offers = [
  {
    title: "A book written for you",
    line: "Built on your data, your stack, your use cases.",
    tone: "#8b5cf6",
    Visual: CustomBook,
    subject: "A custom RantAI Academy book",
  },
  {
    title: "Classes for your engineers",
    line: "Hands-on cohorts, from prompting to agents.",
    tone: "#0ea5e9",
    Visual: Classes,
    subject: "RantAI Academy classes",
  },
  {
    title: "The library for the team",
    line: "One licence: every book, every new edition.",
    tone: "#10b981",
    Visual: Seats,
    subject: "RantAI Academy team licence",
  },
]

export function ForTeams() {
  const reduce = useReducedMotion()
  return (
    <section
      id="for-teams"
      aria-labelledby="teams-heading"
      className="mx-auto max-w-[1440px] scroll-mt-20 px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32"
    >
      <Eyebrow className="text-neutral-500">For teams</Eyebrow>
      <SplitReveal
        id="teams-heading"
        text={"Bring the Academy\nto your team."}
        className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-neutral-950"
      />
      <ul className="mt-14 grid gap-3 md:grid-cols-3">
        {offers.map((o, i) => (
          <motion.li
            key={o.title}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease, delay: i * 0.08 }}
          >
            <a
              href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent(o.subject)}`}
              className="group flex h-full flex-col rounded-2xl bg-neutral-100 p-3"
            >
              <Desk tone={o.tone}>
                <o.Visual />
              </Desk>
              <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
                <h3 className="text-xl font-medium tracking-[-0.02em] text-neutral-950">
                  {o.title}
                </h3>
                <div className="mt-1.5 flex items-end justify-between gap-3">
                  <p className="text-[15px] text-neutral-500">{o.line}</p>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-neutral-500 transition-colors duration-200 group-hover:bg-neutral-950 group-hover:text-white">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
