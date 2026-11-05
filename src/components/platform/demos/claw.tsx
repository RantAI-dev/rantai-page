"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  Archive,
  CalendarDays,
  Check,
  Clock,
  Flag,
  Hash,
  Mail,
  Receipt,
  Send,
  ThumbsUp,
  TrendingUp,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { ProductLogo, ProductTile } from "@/components/shared/product-logo"
import { cn } from "@/lib/utils"

import { Stage, Card, useScript, usePlaying, Chips } from "./shared"

/* ------------------------------------------------------------------ */
/*  RantAI Claw: a scheduled skill runs in the terminal, and each run  */
/*  delivers its own result: a chat brief, a sorted inbox, a report.   */
/* ------------------------------------------------------------------ */

type RunId = "brief" | "triage" | "report"

// Terminal output stays in English; step k of the script shows k lines,
// and the result card on the right follows the same steps.
// Schedules come from messages (platform.demos.claw.schedules, same order).
const clawRuns: {
  id: RunId
  chip: string
  lines: string[]
  timing: number[]
}[] = [
  {
    id: "brief",
    chip: "daily-brief",
    lines: [
      "load skills · calendar, inbox",
      "✓ 6 meetings · 14 emails read",
      "run summarizer",
      "✓ brief posted to #ops",
      "✓ done in 2.1s",
    ],
    timing: [700, 800, 800, 1500, 2000],
  },
  {
    id: "triage",
    chip: "triage-inbox",
    lines: [
      "load skills · inbox, classifier",
      "✓ 38 new emails fetched",
      "run classifier",
      "✓ 38 sorted · 5 urgent",
      "✓ summary sent to Telegram",
    ],
    timing: [700, 800, 700, 2500, 1300],
  },
  {
    id: "report",
    chip: "weekly-report",
    lines: [
      "load skills · research, sheets",
      "✓ 4 sources merged",
      "build report.pdf",
      "✓ report.pdf generated",
      "✓ shared with #leadership",
    ],
    timing: [700, 800, 1300, 1500, 1200],
  },
]

const mono = "[font-family:ui-monospace,SFMono-Regular,Menlo,monospace]"
const orange = "#f97316"

/* ----------------------------- daily-brief ----------------------------- */

/** The brief arrives in #ops: a typing indicator, then the bullets. */
function BriefChat({ s, compact }: Readonly<{ s: number; compact: boolean }>) {
  const t = useTranslations("platform.demos.claw.brief")
  const items = t.raw("items") as string[]
  const icons = [CalendarDays, Mail, Receipt, Clock]
  const shown = compact ? items.slice(0, 3) : items
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] px-4 py-3 text-[13px] font-medium">
        <Hash className="size-3.5 text-neutral-400" />
        ops
        <span className="ml-auto text-[12px] font-normal text-neutral-400">
          {t("members")}
        </span>
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col justify-end",
          compact ? "px-3 py-3" : "px-4 py-4"
        )}
      >
        {!compact && (
          <>
            <div className="flex gap-2.5 opacity-50">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-neutral-200 text-[12px] font-medium text-neutral-600">
                D
              </span>
              <div className="text-[13px]">
                <p className="font-medium">
                  Dimas{" "}
                  <span className="text-[11px] font-normal text-neutral-400">
                    17:42
                  </span>
                </p>
                <p className="text-neutral-600">{t("earlier")}</p>
              </div>
            </div>
            <div className="my-4 flex items-center gap-3 text-[11px] text-neutral-400">
              <span className="h-px flex-1 bg-black/[0.07]" />
              {t("today")}
              <span className="h-px flex-1 bg-black/[0.07]" />
            </div>
          </>
        )}
        <div
          className={cn(
            "flex gap-2.5",
            compact ? "min-h-[190px]" : "min-h-[220px]"
          )}
        >
          <ProductTile id="claw" className="size-8 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 text-[13px]">
            <p className="flex items-center gap-1.5 font-medium">
              RantAI Claw
              <span className="rounded bg-neutral-100 px-1 text-[11px] font-medium text-neutral-500">
                APP
              </span>
              <span className="text-[11px] font-normal text-neutral-400">
                08:00
              </span>
            </p>
            {s < 4 ? (
              s >= 3 && (
                <motion.p
                  className="mt-1.5 flex items-center gap-2 text-[12px] text-neutral-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-neutral-400"
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </span>
                  {t("typing")}
                </motion.p>
              )
            ) : (
              <>
                <motion.p
                  className="mt-0.5 text-neutral-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {t("intro")}
                </motion.p>
                <ul className="mt-2 space-y-1.5">
                  {shown.map((item, i) => {
                    const Icon = icons[i] ?? Check
                    return (
                      <motion.li
                        key={item}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.32, duration: 0.3 }}
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#f97316]/10 text-[#ea580c]">
                          <Icon className="size-3.5" />
                        </span>
                        <span className="min-w-0 truncate">{item}</span>
                      </motion.li>
                    )
                  })}
                </ul>
                {s >= 5 && (
                  <div className="mt-3 flex items-center gap-1.5">
                    {[
                      { Icon: ThumbsUp, n: 3 },
                      { Icon: Check, n: 2 },
                    ].map(({ Icon, n }, i) => (
                      <motion.span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full border border-[#f97316]/25 bg-[#f97316]/[0.06] px-2 py-0.5 text-[12px] text-[#c2410c]"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: i * 0.25,
                          type: "spring",
                          stiffness: 500,
                          damping: 22,
                        }}
                      >
                        <Icon className="size-3" /> {n}
                      </motion.span>
                    ))}
                    <motion.span
                      className="ml-1 text-[12px] text-neutral-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {t("seen")}
                    </motion.span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- triage-inbox ---------------------------- */

type Bucket = "urgent" | "later" | "archive"
const bucketOrder: Bucket[] = ["urgent", "later", "archive"]
const bucketTotals: Record<Bucket, number> = {
  urgent: 5,
  later: 21,
  archive: 12,
}
// Which bucket each email in messages (triage.emails, same order) lands in.
const emailBuckets: Bucket[] = [
  "urgent",
  "archive",
  "later",
  "urgent",
  "archive",
  "later",
]
const bucketTone: Record<Bucket, { pill: string; tile: string }> = {
  urgent: {
    pill: "bg-[#ef4444]/10 text-[#b91c1c]",
    tile: "bg-[#ef4444]/[0.06] text-[#b91c1c]",
  },
  later: {
    pill: "bg-[#f59e0b]/15 text-[#b45309]",
    tile: "bg-[#f59e0b]/[0.08] text-[#b45309]",
  },
  archive: {
    pill: "bg-neutral-200/70 text-neutral-600",
    tile: "bg-neutral-100 text-neutral-600",
  },
}

/** Counts from 0 to `to` over `ms` once `on` turns true. */
function useCount(to: number, on: boolean, ms: number) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    const start = performance.now()
    const id = setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / ms)
      setN(Math.round(to * (1 - (1 - p) ** 2)))
      if (p >= 1) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [to, on, ms])
  return on ? n : 0
}

function BucketTile({
  bucket,
  on,
  instant,
  compact,
}: Readonly<{
  bucket: Bucket
  on: boolean
  instant: boolean
  compact: boolean
}>) {
  const t = useTranslations("platform.demos.claw.triage.buckets")
  const n = useCount(bucketTotals[bucket], on && !instant, 2200)
  const Icon = bucket === "urgent" ? Flag : bucket === "later" ? Clock : Archive
  return (
    <div
      className={cn(
        "min-w-0 flex-1 rounded-xl",
        compact
          ? "flex items-center justify-between gap-1 px-2 py-1.5"
          : "px-3 py-2",
        bucketTone[bucket].tile
      )}
    >
      <p className="flex min-w-0 items-center gap-1 text-[12px] font-medium">
        {!compact && <Icon className="size-3 shrink-0" />}
        <span className="truncate">{t(bucket)}</span>
      </p>
      <p
        className={cn(
          "leading-tight font-semibold tabular-nums",
          compact ? "text-[14px]" : "mt-0.5 text-[20px]"
        )}
      >
        {instant ? bucketTotals[bucket] : n}
      </p>
    </div>
  )
}

/** Emails come in, get a label each, then the urgent ones rise to the top. */
function TriageInbox({
  s,
  compact,
  reduce,
}: Readonly<{ s: number; compact: boolean; reduce: boolean }>) {
  const t = useTranslations("platform.demos.claw.triage")
  const emails = (t.raw("emails") as { from: string; subject: string }[])
    .map((e, i) => ({ ...e, bucket: emailBuckets[i] }))
    .slice(0, compact ? 4 : 5)
  const sorted =
    s >= 4
      ? [...emails].sort(
          (a, b) =>
            bucketOrder.indexOf(a.bucket) - bucketOrder.indexOf(b.bucket)
        )
      : emails
  const labelled = s >= 3
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] px-4 py-3 text-[13px] font-medium">
        <Mail className="size-3.5 text-neutral-400" />
        {t("inbox")}
        <span className="ml-auto text-[12px] font-normal text-neutral-400 tabular-nums">
          {!compact && s >= 5 ? (
            <motion.span
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Send className="size-3 text-[#0ea5e9]" /> {t("sent")}
            </motion.span>
          ) : s >= 2 ? (
            t("new")
          ) : (
            ""
          )}
        </span>
      </div>
      <div className={cn("flex-1", compact ? "p-3" : "p-4")}>
        <div className="flex gap-2">
          {bucketOrder.map((b) => (
            <BucketTile
              key={b}
              bucket={b}
              on={labelled}
              instant={reduce}
              compact={compact}
            />
          ))}
        </div>
        <ul
          className={cn(
            "divide-y divide-black/[0.06]",
            compact ? "mt-1" : "mt-2"
          )}
        >
          {s >= 2 &&
            sorted.map((e) => {
              const i = emails.indexOf(e)
              const urgent = labelled && e.bucket === "urgent"
              return (
                <motion.li
                  key={e.subject}
                  layout
                  transition={{
                    layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className={cn(
                    "flex items-center gap-2 transition-opacity duration-500",
                    compact ? "h-9" : "py-2",
                    labelled && e.bucket === "archive" && "opacity-50"
                  )}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Urgent: a small red dot, no box around the row */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 shrink-0 rounded-full transition-colors duration-500",
                      urgent ? "bg-[#ef4444]" : "bg-transparent"
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    {!compact && (
                      <span className="block truncate text-[12px] text-neutral-500">
                        {e.from}
                      </span>
                    )}
                    <span className="block truncate text-[12.5px] font-medium">
                      {e.subject}
                    </span>
                  </span>
                  {labelled && (
                    <motion.span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        bucketTone[e.bucket].pill
                      )}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.3 }}
                    >
                      {t(`buckets.${e.bucket}`)}
                    </motion.span>
                  )}
                </motion.li>
              )
            })}
        </ul>
      </div>
    </div>
  )
}

/* ---------------------------- weekly-report ---------------------------- */

const weeks = [
  { w: "W41", v: 0.58 },
  { w: "W42", v: 0.7 },
  { w: "W43", v: 0.64 },
  { w: "W44", v: 0.78 },
  { w: "W45", v: 0.92 },
]

/** The report builds itself: title, KPIs, a chart, sections, then shared. */
function WeeklyReport({
  s,
  compact,
}: Readonly<{ s: number; compact: boolean }>) {
  const t = useTranslations("platform.demos.claw.report")
  const kpis = t.raw("kpis") as {
    label: string
    value: string
    delta: string
  }[]
  const points = t.raw("points") as string[]
  const chartH = compact ? 42 : 92
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] px-4 py-3 text-[13px] font-medium">
        <span className="rounded bg-[#ef4444]/10 px-1 text-[10px] leading-4 font-semibold text-[#b91c1c]">
          PDF
        </span>
        report.pdf
        <span className="ml-auto text-[12px] font-normal text-neutral-400">
          {s >= 2 ? (compact ? t("meta") : t("pages")) : ""}
        </span>
      </div>
      <div className={cn("flex-1", compact ? "px-3 pt-3" : "px-5 pt-4")}>
        {s >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p
              className={cn(
                "font-semibold",
                compact ? "text-[15px]" : "text-[17px]"
              )}
            >
              {t("title")}
            </p>
            {!compact && (
              <p className="text-[12px] text-neutral-500">{t("meta")}</p>
            )}
          </motion.div>
        )}
        {s >= 3 && (
          <>
            <div
              className={cn(
                "grid grid-cols-2 gap-2",
                compact ? "mt-2" : "mt-3"
              )}
            >
              {kpis.map((k, i) => (
                <motion.div
                  key={k.label}
                  className="rounded-lg bg-neutral-50 px-2.5 py-1.5"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <p className="truncate text-[11px] text-neutral-500">
                    {k.label}
                  </p>
                  <p className="flex items-baseline gap-1.5 text-[14px] font-semibold">
                    {k.value}
                    <span className="flex items-center gap-0.5 text-[11px] font-medium text-[#059669]">
                      <TrendingUp className="size-3" />
                      {k.delta}
                    </span>
                  </p>
                </motion.div>
              ))}
            </div>
            <div className={compact ? "mt-2" : "mt-3"}>
              <p className="text-[11px] text-neutral-500">{t("chart")}</p>
              <div
                className="mt-1.5 flex items-end gap-2"
                style={{ height: chartH }}
              >
                {weeks.map((wk, i) => (
                  <div
                    key={wk.w}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <motion.div
                      className="rounded-t-md"
                      style={{
                        height: `${wk.v * 100}%`,
                        originY: 1,
                        backgroundColor:
                          i === weeks.length - 1
                            ? orange
                            : "rgb(249 115 22 / 0.25)",
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        delay: 0.3 + i * 0.12,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className={cn("mt-1 flex gap-2", compact && "hidden")}>
                {weeks.map((wk) => (
                  <span
                    key={wk.w}
                    className="flex-1 text-center text-[11px] text-neutral-400 tabular-nums"
                  >
                    {wk.w}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
        {!compact && s >= 4 && (
          <div className="mt-3">
            <p className="text-[12px] font-medium">{t("highlights")}</p>
            <ul className="mt-1 space-y-1">
              {points.map((pt, i) => (
                <motion.li
                  key={pt}
                  className="flex items-center gap-2 text-[12.5px] text-neutral-700"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.3 }}
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-[#f97316]" />
                  {pt}
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div
        className={cn(
          "flex items-center gap-2 border-t border-black/[0.06] text-[12.5px] transition-colors duration-500",
          compact ? "px-3 py-2.5" : "px-5 py-3",
          s >= 5 ? "bg-[#10b981]/[0.06]" : "bg-transparent"
        )}
      >
        <span className="flex -space-x-1.5">
          {["#fb923c", "#60a5fa", "#a78bfa"].map((c, i) => (
            <motion.span
              key={c}
              className="size-5 rounded-full ring-2 ring-white"
              style={{ backgroundColor: c }}
              animate={{ scale: s >= 5 ? 1 : 0.6, opacity: s >= 5 ? 1 : 0.25 }}
              transition={{ delay: s >= 5 ? i * 0.12 : 0 }}
            />
          ))}
        </span>
        {s >= 5 ? (
          <motion.span
            className="flex items-center gap-1 font-medium text-[#047857]"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Check className="size-3.5" strokeWidth={3} /> {t("shared")}
          </motion.span>
        ) : (
          <span className="text-neutral-400">{t("building")}</span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------- the demo ------------------------------ */

export function ClawDemo({ active = true }: Readonly<{ active?: boolean }>) {
  const { ref, playing, reduce, compact } = usePlaying(active)
  const t = useTranslations("platform.demos.claw")
  const schedules = t.raw("schedules") as string[]
  const [pick, setPick] = useState(0)
  const run = clawRuns[pick]
  const step = useScript(run.timing, playing, `${pick}`, () =>
    setPick((v) => (v + 1) % clawRuns.length)
  )
  const s = reduce ? run.lines.length : step
  const lines = run.lines.slice(0, s)
  // Phones keep the terminal to a short strip: its latest line.
  const visible = compact ? lines.slice(-1) : lines
  const offset = lines.length - visible.length
  const progress = (
    <div className="h-1 overflow-hidden rounded-full bg-neutral-100">
      <motion.div
        className="h-full rounded-full bg-[#f97316]"
        animate={{ width: `${(s / run.lines.length) * 100}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  )

  return (
    <div ref={ref} className="size-full">
      <Stage desk="claw" compact={compact}>
        {/* Terminal */}
        <Card
          className={cn(
            "overflow-hidden border-white/10 bg-[#0d0f12] text-white",
            compact ? "inset-x-3 top-3" : "top-8 left-8 w-[400px]"
          )}
          key={`term-${pick}`}
        >
          <div
            className={cn(
              "flex items-center gap-2 border-b border-white/10",
              compact ? "px-3 py-2.5" : "px-4 py-3"
            )}
          >
            {!compact &&
              [0, 1, 2].map((i) => (
                <span key={i} className="size-2.5 rounded-full bg-white/15" />
              ))}
            <ProductLogo
              id="claw"
              variant="dark"
              className={cn("h-3.5", !compact && "ml-2")}
            />
            {compact ? (
              <span className="ml-auto flex items-center gap-1 text-[12px] text-white/55">
                <Clock className="size-3" /> {schedules[pick]}
              </span>
            ) : (
              <span className={cn(mono, "text-[11px] text-white/45")}>
                ~/ops
              </span>
            )}
          </div>
          <div
            className={cn(
              mono,
              "space-y-1.5",
              compact
                ? "h-[60px] px-3 py-2.5 text-[12px]"
                : "h-[206px] p-5 text-[13px]"
            )}
          >
            <p className="truncate">
              <span className="text-[#fb923c]">$</span> rantaiclaw run{" "}
              {run.chip}
            </p>
            {visible.map((l, j) => (
              <motion.p
                key={`${pick}-${offset + j}`}
                layout={compact ? "position" : false}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "truncate",
                  l.startsWith("✓") ? "pl-4 text-white/75" : "text-white/45"
                )}
              >
                {l.startsWith("✓") ? (
                  <>
                    <span className="text-[#34d399]">✓</span>
                    {l.slice(1)}
                  </>
                ) : (
                  <>▸ {l}</>
                )}
              </motion.p>
            ))}
            {s < run.lines.length && playing && !(compact && s > 0) && (
              <span className="inline-block h-4 w-2 animate-pulse bg-white/70" />
            )}
          </div>
          {compact && <div className="px-3 pb-2.5">{progress}</div>}
        </Card>

        {/* Schedule (desktop) */}
        <Card
          className="top-[298px] left-8 w-[400px] p-4"
          show={!compact}
          key={`sched-${pick}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-medium text-neutral-500">
                {t("schedule")}
              </p>
              <p className="mt-1.5 text-[15px] font-medium">{run.chip}</p>
            </div>
            <span className="mt-0.5 flex items-center gap-1.5 rounded-full bg-[#f97316]/10 px-2.5 py-1 text-[12px] text-[#c2410c]">
              <Clock className="size-3" /> {schedules[pick]}
            </span>
          </div>
          <div className="mt-3">{progress}</div>
          <div className="mt-3 flex items-center gap-3 text-[12px] text-neutral-500">
            {t("channels")}
            {["Telegram", "Slack", "Email"].map((c) => (
              <span key={c} className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#10b981]" /> {c}
              </span>
            ))}
          </div>
        </Card>

        {/* Result of this run */}
        <Card
          className={cn(
            "overflow-hidden",
            compact
              ? "inset-x-3 top-[132px] h-[256px]"
              : "top-8 right-8 h-[444px] w-[400px]"
          )}
          key={`out-${pick}`}
          delay={0.1}
        >
          {run.id === "brief" && <BriefChat s={s} compact={compact} />}
          {run.id === "triage" && (
            <TriageInbox s={s} compact={compact} reduce={reduce} />
          )}
          {run.id === "report" && <WeeklyReport s={s} compact={compact} />}
        </Card>

        <Chips
          options={clawRuns.map((r) => r.chip)}
          value={pick}
          onPick={setPick}
          compact={compact}
        />
      </Stage>
    </div>
  )
}
