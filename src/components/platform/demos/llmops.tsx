"use client"

import { useEffect, useState } from "react"
import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { Check, FileText } from "lucide-react"
import { useTranslations } from "next-intl"
import { ProductTile } from "@/components/shared/product-logo"
import { cn } from "@/lib/utils"

import {
  ease,
  Stage,
  Card,
  Typed,
  useScript,
  usePlaying,
  Chips,
  Step,
} from "./shared"

/* ------------------------------------------------------------------ */
/*  RantAI LLMOps: dataset → fine-tune → evaluate → serve              */
/* ------------------------------------------------------------------ */

// Each use case shares the run (step rail, loss curve) and then shows its
// own evaluation: a generative model is judged answer against answer, a
// classifier is scored label by label.
type LlmRun = {
  chip: string
  data: string
  rows: number
  /** What the live endpoint sends back, shown under the route. */
  reply: string
}
const llmRuns: LlmRun[] = [
  {
    chip: "support-assistant",
    data: "support-tickets.jsonl",
    rows: 12480,
    reply: '→ "Sorry about that…" · 0.6s',
  },
  {
    chip: "contract-classifier",
    data: "contracts-labelled.jsonl",
    rows: 8215,
    reply: '→ {"label": "MSA", "p": 0.97}',
  },
]
// Load, fine-tune, evaluate (the long one: the main visual), serve.
const llmTiming = [800, 1800, 3600, 900]

const violet = "#8b5cf6"
const green = "#10b981"
const loss = "M0,6 C40,10 60,40 110,48 S190,60 240,64 S300,67 320,68"

/** The training loss, drawn while the fine-tune step runs. */
function LossCurve({
  on,
  className,
}: Readonly<{ on: boolean; className?: string }>) {
  return (
    <svg
      viewBox="0 0 320 74"
      className={cn("w-full overflow-visible", className)}
      preserveAspectRatio="none"
    >
      {[24, 48].map((y) => (
        <line
          key={y}
          x1="0"
          x2="320"
          y1={y}
          y2={y}
          stroke="rgb(0 0 0 / 0.06)"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <motion.path
        d={loss}
        fill="none"
        stroke={violet}
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: on ? 1 : 0 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
    </svg>
  )
}

/** A number that counts from `from` to `to` once `on` turns true. */
function CountUp({
  from,
  to,
  on,
  duration,
  delay = 0,
  format,
}: Readonly<{
  from: number
  to: number
  on: boolean
  duration: number
  delay?: number
  format: (v: number) => string
}>) {
  const v = useMotionValue(from)
  const text = useTransform(v, (x) => format(Math.round(x)))
  useEffect(() => {
    if (!on) {
      v.set(from)
      return
    }
    const c = animate(v, to, { duration, delay, ease: "easeOut" })
    return () => c.stop()
  }, [on, from, to, duration, delay, v])
  return <motion.span>{text}</motion.span>
}

/* ---------------------- support-assistant ------------------------- */

/** One model's answer to the test prompt, with the judge's score. */
function Answer({
  label,
  text,
  score,
  on,
  scored,
  winner,
  compact,
}: Readonly<{
  label: string
  text: string
  score: number
  on: boolean
  scored: boolean
  winner?: boolean
  compact: boolean
}>) {
  const t = useTranslations("platform.demos.llmops.support")
  return (
    // No box: a plain row, the score as text; the winner is told by colour.
    <div className={cn(compact ? "py-2" : "flex flex-col py-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-500">
          {label}
          {winner && scored && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] font-medium text-[#047857]"
            >
              · {t("winner")}
            </motion.span>
          )}
        </span>
        <motion.span
          className={cn(
            "shrink-0 text-[11px] font-medium tabular-nums",
            winner ? "text-[#047857]" : "text-neutral-400"
          )}
          initial={false}
          animate={{ opacity: scored ? 1 : 0, scale: scored ? 1 : 0.7 }}
        >
          {t("judge", { score })}
        </motion.span>
      </div>
      <p
        className={cn(
          compact
            ? "mt-1 text-[12px] leading-snug"
            : "mt-1.5 flex-1 text-[13px] leading-relaxed",
          winner ? "text-neutral-900" : "text-neutral-500"
        )}
      >
        {on ? (
          <Typed text={text} on speed={winner ? 13 : 15} />
        ) : (
          <span className="block space-y-1.5 pt-1">
            <span className="block h-1.5 w-full rounded-full bg-neutral-100" />
            <span className="block h-1.5 w-3/5 rounded-full bg-neutral-100" />
          </span>
        )}
      </p>
    </div>
  )
}

/** Generative eval: base vs fine-tuned answer to the same prompt. */
function SupportEval({
  s,
  compact,
}: Readonly<{ s: number; compact: boolean }>) {
  const t = useTranslations("platform.demos.llmops")
  const q = t("support.question")
  const base = t("support.baseAnswer")
  const tuned = t("support.tunedAnswer")
  // The fine-tuned answer starts once the base one has typed.
  const baseTime = base.length * 15 + 250
  const tunedTime = tuned.length * 13 + 250
  const [phase, setPhase] = useState(0)
  const evaluating = s >= 3
  useEffect(() => {
    if (!evaluating) return
    const a = setTimeout(() => setPhase(1), baseTime)
    const b = setTimeout(() => setPhase(2), baseTime + tunedTime)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [evaluating, baseTime, tunedTime])
  const p = evaluating ? phase : 0
  return (
    <>
      {/* Phones: the rail already says "Evaluate". */}
      <div className="flex items-baseline justify-between gap-2">
        {!compact && (
          <p className="text-[13px] font-medium">{t("support.eval")}</p>
        )}
        <p className="text-[12px] text-neutral-500 tabular-nums">
          {t("support.prompt", { n: 37, total: 500 })}
        </p>
      </div>
      <div className={cn("flex gap-2", compact ? "mt-1.5" : "mt-2.5")}>
        {!compact && (
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-500">
            Q
          </span>
        )}
        <p
          className={cn(
            "rounded-2xl rounded-tl-md bg-neutral-100 px-3 py-2 leading-snug",
            compact ? "text-[12px]" : "text-[13px]"
          )}
        >
          {q}
        </p>
      </div>
      <div
        className={cn(
          compact
            ? "mt-1.5 flex flex-col divide-y divide-black/[0.06]"
            : "mt-2 grid grid-cols-2 gap-6"
        )}
      >
        <Answer
          label={t("base")}
          text={base}
          score={2.1}
          on={evaluating}
          scored={p >= 1}
          compact={compact}
        />
        <Answer
          label={t("tuned")}
          text={tuned}
          score={4.7}
          on={p >= 1}
          scored={p >= 2}
          winner
          compact={compact}
        />
      </div>
      <motion.div
        className={cn(
          "mt-3 flex items-center gap-2 text-[12px] text-neutral-500",
          compact && "hidden"
        )}
        initial={false}
        animate={{ opacity: p >= 2 ? 1 : 0 }}
      >
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
          <motion.span
            className="block h-full rounded-full bg-[#10b981]"
            initial={{ width: 0 }}
            animate={{ width: p >= 2 ? "86%" : 0 }}
            transition={{ duration: 0.9, ease }}
          />
        </span>
        <span className="shrink-0">
          {t("support.winRate", { v: 0.86, total: 500 })}
        </span>
      </motion.div>
    </>
  )
}

/* --------------------- contract-classifier ------------------------ */

const classes = ["NDA", "MSA", "SOW", "DPA"] as const
// Held-out set (412 contracts): rows are the true class, columns the
// predicted one. The diagonal is 385 / 412 ≈ 93 %.
const confusion = [
  [118, 2, 0, 1],
  [3, 96, 6, 2],
  [0, 7, 88, 1],
  [1, 3, 1, 83],
]
const testDocs = [
  { name: "Acme mutual NDA.pdf", label: 0 },
  { name: "Cloud services MSA.pdf", label: 1 },
  { name: "Q3 migration SOW.docx", label: 2 },
  { name: "Supplier DPA v2.pdf", label: 3 },
  { name: "Pilot agreement 2026.pdf", label: 1 },
]
const labelTone = [
  "bg-[#8b5cf6]/12 text-[#6d28d9]",
  "bg-[#3b82f6]/12 text-[#1d4ed8]",
  "bg-[#f59e0b]/15 text-[#b45309]",
  "bg-[#10b981]/12 text-[#047857]",
]
const docGap = 0.5

/** Classifier eval: documents get labelled, the matrix fills in. */
function ClassifierEval({
  s,
  compact,
}: Readonly<{ s: number; compact: boolean }>) {
  const t = useTranslations("platform.demos.llmops")
  const on = s >= 3
  const docs = compact ? testDocs.slice(0, 4) : testDocs
  const pct = (v: number) => t("percent", { v: v / 100 })
  const max = 118
  return (
    <>
      {(() => {
        const accuracy = (
          // "Accuracy 93%" on one line
          <p className="flex shrink-0 items-baseline gap-1.5">
            <span className="text-[11px] text-neutral-500">
              {t("classifier.accuracy")}
            </span>
            <span
              className={cn(
                "leading-none font-semibold tracking-tight tabular-nums transition-colors duration-700",
                on ? "text-[#047857]" : "text-neutral-300",
                compact ? "text-[22px]" : "text-[28px]"
              )}
            >
              <CountUp
                from={64}
                to={93}
                on={on}
                duration={docs.length * docGap + 0.6}
                format={pct}
              />
            </span>
          </p>
        )
        const title = (
          <p className="truncate text-[13px] font-medium">
            {t("classifier.eval", { count: 412 })}
          </p>
        )
        const base = (
          <p className="text-[12px] text-neutral-500">
            {t("classifier.baseAcc", { v: 0.64 })}
          </p>
        )
        // Phones: the title gets its own line; the base score and the
        // accuracy share the next one.
        return compact ? (
          <div>
            {title}
            <div className="mt-1 flex items-baseline justify-between gap-3">
              {base}
              {accuracy}
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              {title}
              {base}
            </div>
            {accuracy}
          </div>
        )
      })()}

      <div className={cn("mt-3", !compact && "flex gap-5")}>
        {/* Documents stream in and get a label. */}
        <ul
          className={cn("divide-y divide-black/[0.06]", !compact && "flex-1")}
        >
          {docs.map((d, i) => (
            <motion.li
              key={d.name}
              className={cn(
                "flex items-center gap-2",
                compact ? "py-1.5" : "py-2"
              )}
              initial={false}
              animate={{ opacity: on ? 1 : 0.35 }}
              transition={{ delay: on ? i * docGap : 0, duration: 0.3 }}
            >
              <FileText className="size-3.5 shrink-0 text-neutral-400" />
              <span className="min-w-0 flex-1 truncate text-[12px]">
                {d.name}
              </span>
              <motion.span
                className={cn(
                  "shrink-0 rounded-full px-2 py-px text-[11px] font-medium",
                  labelTone[d.label]
                )}
                initial={false}
                animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.6 }}
                transition={{ delay: on ? i * docGap + 0.25 : 0 }}
              >
                {classes[d.label]}
              </motion.span>
              <motion.span
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ delay: on ? i * docGap + 0.35 : 0 }}
              >
                <Check className="size-3.5 text-[#10b981]" strokeWidth={3} />
              </motion.span>
            </motion.li>
          ))}
        </ul>

        {compact ? (
          /* Phones: accuracy per class. */
          <div className="mt-3 grid grid-cols-4 gap-2">
            {classes.map((c, i) => {
              const row = confusion[i]
              const v = Math.round(
                (row[i] / row.reduce((a, b) => a + b, 0)) * 100
              )
              return (
                <div key={c}>
                  <div className="flex items-baseline justify-between text-[12px]">
                    <span className="font-medium">{c}</span>
                    <motion.span
                      className="text-neutral-500 tabular-nums"
                      initial={false}
                      animate={{ opacity: on ? 1 : 0 }}
                      transition={{ delay: on ? 0.6 + i * docGap : 0 }}
                    >
                      {v}
                    </motion.span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: violet }}
                      initial={false}
                      animate={{ width: on ? `${v}%` : 0 }}
                      transition={{
                        delay: on ? 0.4 + i * docGap : 0,
                        duration: 0.7,
                        ease,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Desktop: a confusion matrix that fills in row by row. */
          <div className="w-[214px] shrink-0">
            <p className="pl-[38px] text-center text-[11px] text-neutral-400">
              {t("classifier.predicted")}
            </p>
            <div className="mt-1 grid grid-cols-[38px_repeat(4,1fr)] gap-1 text-[11px]">
              <span />
              {classes.map((c) => (
                <span
                  key={c}
                  className="text-center font-medium text-neutral-500"
                >
                  {c}
                </span>
              ))}
              {confusion.map((row, r) => (
                <div key={classes[r]} className="contents">
                  <span className="self-center font-medium text-neutral-500">
                    {classes[r]}
                  </span>
                  {row.map((n, c) => {
                    const diag = r === c
                    return (
                      <motion.span
                        key={c}
                        className={cn(
                          "grid h-9 place-items-center rounded-md tabular-nums",
                          diag ? "text-white" : "text-neutral-600"
                        )}
                        style={{
                          background: diag
                            ? `rgb(139 92 246 / ${0.45 + (0.55 * n) / max})`
                            : n > 0
                              ? `rgb(245 158 11 / ${0.08 + n / 40})`
                              : "rgb(0 0 0 / 0.03)",
                        }}
                        initial={false}
                        animate={{
                          opacity: on ? 1 : 0.15,
                          scale: on ? 1 : 0.85,
                        }}
                        transition={{
                          delay: on ? 0.3 + r * docGap + c * 0.06 : 0,
                          duration: 0.35,
                        }}
                      >
                        {n}
                      </motion.span>
                    )
                  })}
                </div>
              ))}
            </div>
            <p className="mt-1.5 pl-[38px] text-center text-[11px] text-neutral-400">
              {t("classifier.actual")}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

/* ----------------------------- demo ------------------------------- */

export function LlmopsDemo({ active = true }: Readonly<{ active?: boolean }>) {
  const { ref, playing, reduce, compact } = usePlaying(active)
  const t = useTranslations("platform.demos.llmops")
  const steps = t.raw("steps") as string[]
  const [pick, setPick] = useState(0)
  const r = llmRuns[pick]
  const step = useScript(llmTiming, playing, `${pick}`, () =>
    setPick((v) => (v + 1) % llmRuns.length)
  )
  const s = reduce ? 4 : step
  const serving = s >= 4
  const Eval = pick === 0 ? SupportEval : ClassifierEval
  const route = "POST /v1/chat/completions"
  const live = (
    <span className="flex items-center gap-1.5 text-[12px] text-[#10b981]">
      <span className="size-1.5 animate-pulse rounded-full bg-[#10b981]" />
      {t("live")}
    </span>
  )

  // Phones: one line under the rail says what the current step is doing.
  const status = [
    t("rows", { count: r.rows }),
    t("rows", { count: r.rows }),
    t("epoch", { n: 2, total: 3 }),
    t("done", { count: 3 }),
  ][Math.min(s, 3)]

  return (
    <div ref={ref} className="size-full">
      <Stage desk="llmops" compact={compact}>
        {compact ? (
          /* Run: a compact step rail. */
          <Card className="inset-x-3 top-3 p-3" key={`rail-${pick}`}>
            <p className="flex items-center gap-2 text-[12px] font-medium text-neutral-500">
              <ProductTile id="llmops" className="size-5" logoClassName="h-3" />
              <span className="min-w-0 flex-1 truncate">
                {t("run", { name: r.chip })}
              </span>
            </p>
            <div className="mt-2.5 grid grid-cols-4 gap-1.5">
              {steps.map((l, i) => (
                <span
                  key={l}
                  className="h-1 overflow-hidden rounded-full bg-neutral-200"
                >
                  <motion.span
                    className="block h-full rounded-full"
                    style={{ background: i === 3 ? green : violet }}
                    initial={false}
                    animate={{ width: s > i ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease }}
                  />
                </span>
              ))}
            </div>
            <div className="mt-2 flex h-[20px] items-center gap-2 text-[12px]">
              {serving ? (
                <>
                  {live}
                  <span className="min-w-0 flex-1 truncate [font-family:ui-monospace,monospace] text-neutral-700">
                    {route}
                  </span>
                </>
              ) : (
                <>
                  <span className="font-medium">
                    {steps[Math.max(0, Math.min(s, 4) - 1)]}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-neutral-500">
                    {status}
                  </span>
                  <LossCurve on={s >= 2} className="h-4 w-14" />
                </>
              )}
            </div>
          </Card>
        ) : (
          <>
            {/* Run: steps, dataset and the loss curve. */}
            <Card className="top-10 left-8 w-[250px] p-4" key={`run-${pick}`}>
              <p className="flex items-center gap-2 text-[12px] font-medium text-neutral-500">
                <ProductTile
                  id="llmops"
                  className="size-5"
                  logoClassName="h-3"
                />
                <span className="truncate">{t("run", { name: r.chip })}</span>
              </p>
              <ul className="mt-3 space-y-3">
                {steps.map((l, i) => (
                  <Step
                    key={l}
                    label={l}
                    done={s > i + 1 || (i === 3 && s >= 4)}
                    active={s === i + 1 && !(i === 3 && s >= 4)}
                  />
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-[12px]">
                <FileText className="size-3.5 text-[#8b5cf6]" />
                <span className="flex-1 truncate">{r.data}</span>
                <span className="text-neutral-400">
                  {t("rows", { count: r.rows })}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline justify-between text-[11px] text-neutral-500">
                  <span>{t("loss")}</span>
                  <span>
                    {s >= 3
                      ? t("done", { count: 3 })
                      : s >= 2
                        ? t("epoch", { n: 2, total: 3 })
                        : ""}
                  </span>
                </div>
                <LossCurve on={s >= 2} className="mt-1.5 h-[52px]" />
              </div>
            </Card>

            {/* Serve */}
            <Card className="top-[392px] left-8 w-[250px] p-4" show={serving}>
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium text-neutral-500">
                  {t("endpoint")}
                </p>
                {live}
              </div>
              <p className="mt-2 rounded-lg bg-neutral-50 px-2.5 py-2 [font-family:ui-monospace,monospace] text-[11px] leading-relaxed text-neutral-700">
                {route}
                <span className="block truncate text-neutral-500">
                  {r.reply}
                </span>
              </p>
            </Card>
          </>
        )}

        {/* Evaluate: its own visual per use case. */}
        <Card
          className={cn(
            "p-4",
            compact ? "inset-x-3 top-[112px]" : "top-10 right-8 w-[560px] p-5"
          )}
          show={s >= 2}
          key={`eval-${pick}`}
        >
          <Eval s={s} compact={compact} />
          {!compact && (
            <motion.p
              className="mt-4 text-[11px] text-neutral-500"
              initial={false}
              animate={{ opacity: serving ? 1 : 0 }}
            >
              {t("compat")}
            </motion.p>
          )}
        </Card>

        <Chips
          options={llmRuns.map((x) => x.chip)}
          value={pick}
          onPick={setPick}
          compact={compact}
        />
      </Stage>
    </div>
  )
}
