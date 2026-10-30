"use client"

import {
  Database,
  FileSpreadsheet,
  FileText,
  Lock,
  Mail,
  MessageSquare,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react"
import { useRef, useState } from "react"

import { SplitReveal } from "@/components/split-reveal"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

const problems = [
  {
    title: "Your knowledge is scattered.",
    body: "Policies, manuals, spreadsheets, and chats live in different places.",
  },
  {
    title: "AI stops at the demo.",
    body: "Pilots look good in a meeting, then never reach daily work.",
  },
  {
    title: "Your data has to stay inside.",
    body: "Regulated teams can't send sensitive data to someone else's cloud.",
  },
] as const

const scattered: { icon: LucideIcon; label: string; x: string; y: string; r: number }[] = [
  { icon: FileText, label: "Policy.pdf", x: "8%", y: "12%", r: -8 },
  { icon: FileSpreadsheet, label: "Q3 data.xlsx", x: "56%", y: "6%", r: 6 },
  { icon: Mail, label: "Email thread", x: "62%", y: "44%", r: -4 },
  { icon: MessageSquare, label: "Team chat", x: "14%", y: "52%", r: 5 },
  { icon: Database, label: "CRM records", x: "38%", y: "74%", r: -3 },
  { icon: FileText, label: "SOP v3.docx", x: "30%", y: "30%", r: 3 },
]

function ScatteredVisual({ reduce }: Readonly<{ reduce: boolean }>) {
  return (
    <div className="relative h-full w-full">
      {scattered.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.label}
            className="absolute flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            style={{ left: item.x, top: item.y, rotate: item.r }}
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={
              reduce
                ? undefined
                : { opacity: 1, scale: 1, y: [0, index % 2 ? -6 : 6, 0] }
            }
            transition={{
              opacity: { duration: 0.4, delay: index * 0.06 },
              scale: { duration: 0.4, delay: index * 0.06, ease },
              y: { duration: 4 + index * 0.4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Icon aria-hidden="true" className="size-4 text-neutral-500" strokeWidth={1.75} />
            <span className="text-sm whitespace-nowrap text-neutral-700">{item.label}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

const stages = ["Idea", "Demo", "Pilot", "Production"] as const

function StalledVisual({ reduce }: Readonly<{ reduce: boolean }>) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 px-2 sm:px-6">
      <div className="relative h-2 rounded-full bg-neutral-200">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-neutral-900"
          initial={reduce ? false : { width: "0%" }}
          animate={{ width: "62%" }}
          transition={{ duration: 1.4, ease }}
        />
        <motion.span
          className="absolute top-1/2 left-[62%] size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500"
          animate={reduce ? undefined : { scale: [1, 1.35, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        />
      </div>
      <ol className="grid grid-cols-4 text-sm">
        {stages.map((stage, index) => (
          <li
            key={stage}
            className={cn(
              "flex flex-col gap-1",
              index === 3 ? "items-end text-right text-neutral-400" : "text-neutral-900",
              index > 0 && index < 3 && "items-center text-center"
            )}
          >
            <span className="font-medium">{stage}</span>
            {index === 2 && <span className="text-xs text-amber-600">Stuck here</span>}
            {index === 3 && <span className="text-xs">Never reached</span>}
          </li>
        ))}
      </ol>
    </div>
  )
}

function BoundaryVisual({ reduce }: Readonly<{ reduce: boolean }>) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative flex w-[78%] flex-col gap-4 rounded-3xl border-2 border-dashed border-neutral-300 p-6">
        <span className="absolute -top-3 left-5 bg-neutral-100 px-2 text-xs font-medium tracking-[0.08em] text-neutral-500 uppercase">
          Your infrastructure
        </span>
        <div className="flex items-center justify-center gap-4 pt-2">
          {[Server, Database, ShieldCheck].map((Icon, index) => (
            <motion.span
              key={index}
              className="flex size-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease }}
            >
              <Icon aria-hidden="true" className="size-6 text-neutral-800" strokeWidth={1.75} />
            </motion.span>
          ))}
        </div>
        <motion.div
          className="mx-auto flex items-center gap-2 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
        >
          <Lock aria-hidden="true" className="size-3.5" />
          Data never leaves
        </motion.div>
      </div>
    </div>
  )
}

export function HomeProblem() {
  const ref = useRef<HTMLElement>(null)
  const reduce = Boolean(useReducedMotion())
  const [index, setIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setIndex(Math.min(problems.length - 1, Math.floor(Math.max(value, 0) * problems.length)))
  })

  const problem = problems[index]

  return (
    <section
      ref={ref}
      aria-labelledby="problem-heading"
      className="relative h-[300svh]"
    >
      <h2 id="problem-heading" className="sr-only">
        Why AI projects stall
      </h2>
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-8 px-5 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-14">
          <div className="order-2 lg:order-1">
            <div className="grid min-h-[11rem] sm:min-h-[14rem]">
              <AnimatePresence initial={false}>
                <div key={index} className="col-start-1 row-start-1">
                  <SplitReveal
                    as="p"
                    text={problem.title}
                    trigger="mount"
                    className="text-[clamp(2.5rem,5.4vw,5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance text-neutral-950"
                  />
                  <motion.p
                    className="mt-5 max-w-md text-lg leading-relaxed text-neutral-600"
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, ease, delay: 0.3 }}
                  >
                    {problem.body}
                  </motion.p>
                </div>
              </AnimatePresence>
            </div>
            <div className="mt-8 flex gap-2" aria-hidden="true">
              {problems.map((item, i) => (
                <span
                  key={item.title}
                  className={cn(
                    "h-1 rounded-full transition-[width,background-color] duration-500",
                    i === index ? "w-10 bg-neutral-900" : "w-4 bg-neutral-300"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="order-1 grid aspect-[4/3] w-full overflow-hidden rounded-3xl bg-neutral-100 p-6 sm:aspect-[5/4] lg:order-2">
            <AnimatePresence initial={false}>
              <motion.div
                key={index}
                className="col-start-1 row-start-1 h-full w-full"
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease }}
                aria-hidden="true"
              >
                {index === 0 && <ScatteredVisual reduce={reduce} />}
                {index === 1 && <StalledVisual reduce={reduce} />}
                {index === 2 && <BoundaryVisual reduce={reduce} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
