"use client"

import { useState } from "react"
import { motion } from "motion/react"
import {
  ArrowUp,
  Check,
  Crown,
  Database,
  Loader2,
  Sparkles,
  Table2,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { ProductLogo } from "@/components/shared/product-logo"
import { cn } from "@/lib/utils"

import {
  ease,
  Stage,
  Card,
  Typed,
  useScript,
  usePlaying,
  Chips,
} from "./shared"

/* ------------------------------------------------------------------ */
/*  RantAI Lakehouse: ask in plain language, see the SQL, get a chart  */
/* ------------------------------------------------------------------ */

// SQL, codes and values stay in code; questions, titles and labels come from
// messages (platform.demos.lake.asks, same order).
const lakeAsks = [
  {
    kind: "rank",
    sql: "SELECT country, SUM(visitors)\nFROM visitors_clean\nWHERE year = 2024\nGROUP BY country ORDER BY 2 DESC LIMIT 5;",
    codes: ["MY", "SG", "AU", "CN", "JP"],
    values: [1.6, 1.5, 1.2, 1.0, 0.7],
  },
  {
    kind: "series",
    sql: "SELECT month, SUM(visitors)\nFROM visitors_clean\nWHERE year = 2024\nGROUP BY month ORDER BY month;",
    codes: [],
    values: [0.9, 0.8, 0.85, 0.9, 0.95, 1.05, 1.3, 1.45, 1.0, 1.05, 0.85, 1.25],
  },
] as const
type LakeAsk = {
  chip: string
  q: string
  title: string
  labels: string[]
  peak?: string
}
const lakeTiming = [1700, 1900, 600]
const blue = "#0b6ab0"

/** Top countries: a ranking whose bars grow one after another. */
function Ranking({
  labels,
  codes,
  values,
  compact,
  reduce,
}: Readonly<{
  labels: string[]
  codes: readonly string[]
  values: readonly number[]
  compact: boolean
  reduce: boolean
}>) {
  const t = useTranslations("platform.demos.lake")
  const max = Math.max(...values)
  const settled = 0.2 + values.length * 0.3 + 0.3
  return (
    <ul className={compact ? "mt-1.5 space-y-1" : "mt-4 space-y-1.5"}>
      {values.map((v, i) => {
        const lead = i === 0
        return (
          <motion.li
            key={codes[i]}
            className={cn(
              "relative grid items-center gap-2 rounded-lg text-[12px]",
              compact
                ? "h-5 grid-cols-[12px_26px_minmax(0,72px)_1fr_30px] px-1.5"
                : "h-8 grid-cols-[14px_30px_84px_1fr_40px] px-2.5"
            )}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.3 }}
          >
            {lead && (
              <motion.span
                className="absolute inset-0 rounded-lg bg-[#0b6ab0]/[0.07] ring-1 ring-[#0b6ab0]/20"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: settled, duration: 0.4 }}
              />
            )}
            <span
              className={cn(
                "relative text-right tabular-nums",
                lead ? "font-semibold text-[#0b6ab0]" : "text-neutral-400"
              )}
            >
              {i + 1}
            </span>
            <span className="relative rounded bg-neutral-100 py-px text-center [font-family:ui-monospace,monospace] text-[11px] text-neutral-600">
              {codes[i]}
            </span>
            <span
              className={cn(
                "relative flex min-w-0 items-center gap-1 truncate",
                lead ? "font-medium text-neutral-900" : "text-neutral-600"
              )}
            >
              <span className="truncate">{labels[i]}</span>
              {lead && !compact && (
                <motion.span
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: settled, type: "spring", bounce: 0.5 }}
                >
                  <Crown className="size-3 text-[#f59e0b]" />
                </motion.span>
              )}
            </span>
            <span
              className={cn(
                "relative overflow-hidden rounded bg-neutral-100",
                compact ? "h-2.5" : "h-3.5"
              )}
            >
              <motion.span
                className="block h-full rounded"
                style={{ backgroundColor: lead ? blue : `${blue}59` }}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${(v / max) * 100}%` }}
                transition={{ duration: 0.6, ease, delay: 0.2 + i * 0.3 }}
              />
            </span>
            <span
              className={cn(
                "relative text-right tabular-nums",
                lead ? "font-medium text-neutral-900" : "text-neutral-500"
              )}
            >
              {t("value", { v })}
            </span>
          </motion.li>
        )
      })}
      {!compact && (
        <motion.li
          className="flex items-center gap-1.5 pt-1.5 pl-2.5 text-[12px] text-[#0b6ab0]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: settled + 0.2 }}
        >
          <Crown className="size-3.5 text-[#f59e0b]" /> {t("leader")} ·{" "}
          {labels[0]}
        </motion.li>
      )}
    </ul>
  )
}

/** Busiest months: a line that draws through the year, peak called out. */
function Season({
  labels,
  values,
  peakName,
  compact,
  reduce,
}: Readonly<{
  labels: string[]
  values: readonly number[]
  peakName: string
  compact: boolean
  reduce: boolean
}>) {
  const t = useTranslations("platform.demos.lake")
  const w = compact ? 264 : 440
  const h = compact ? 104 : 200
  const top = compact ? 30 : 40
  const pad = 10
  const lo = 0.6
  const hi = 1.5
  const x = (i: number) => pad + (i * (w - 2 * pad)) / (values.length - 1)
  const y = (v: number) => top + ((hi - v) / (hi - lo)) * (h - top - 6)
  const line = values
    .map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ")
  const area = `${line} L${x(values.length - 1)},${h} L${x(0)},${h} Z`
  const peak = values.indexOf(Math.max(...values))
  const avg = values.reduce((s, v) => s + v, 0) / values.length
  const draw = 1.5
  const after = draw + 0.1
  // Keep the callout inside the chart near either edge.
  const calloutX = Math.min(Math.max(x(peak), 70), w - 70)

  return (
    <div className={compact ? "mt-2" : "mt-4"}>
      <div className="relative" style={{ width: w, height: h }}>
        <svg width={w} height={h} className="absolute inset-0 overflow-visible">
          <defs>
            <linearGradient id="lake-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={blue} stopOpacity={0.22} />
              <stop offset="100%" stopColor={blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <motion.line
            x1={0}
            x2={w}
            y1={y(avg)}
            y2={y(avg)}
            stroke="#a3a3a3"
            strokeDasharray="3 4"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.path
            d={area}
            fill="url(#lake-area)"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: draw * 0.6, duration: 0.8 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke={blue}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: draw, ease: "easeInOut" }}
          />
          {values.map((v, i) => (
            <motion.circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r={i === peak ? 4.5 : 2.5}
              fill={i === peak ? blue : "#fff"}
              stroke={blue}
              strokeWidth={1.5}
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              style={{ transformOrigin: `${x(i)}px ${y(v)}px` }}
              transition={{ delay: (draw * i) / (values.length - 1) }}
            />
          ))}
          {!reduce && (
            <motion.circle
              cx={x(peak)}
              cy={y(values[peak])}
              r={4.5}
              fill="none"
              stroke={blue}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 3], opacity: [0.6, 0] }}
              style={{ transformOrigin: `${x(peak)}px ${y(values[peak])}px` }}
              transition={{
                delay: after,
                duration: 1.4,
                repeat: Infinity,
                repeatDelay: 0.6,
              }}
            />
          )}
        </svg>
        <motion.span
          className="absolute left-0 text-[11px] leading-none text-neutral-500 tabular-nums"
          style={{ top: y(avg) - 15 }}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t("avg", { v: avg })}
        </motion.span>
        <motion.span
          className="absolute top-0 -translate-x-1/2 rounded-md bg-neutral-900 px-2 py-1 text-[12px] font-medium whitespace-nowrap text-white"
          style={{ left: calloutX }}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: after, duration: 0.4, ease }}
        >
          {t("peak", { month: peakName, v: values[peak] })}
        </motion.span>
      </div>
      <div className="relative mt-1.5 h-4" style={{ width: w }}>
        {labels.map((l, i) => (
          <span
            key={l}
            className={cn(
              "absolute top-0 -translate-x-1/2 text-[11px] text-neutral-400",
              i === peak && "font-semibold text-[#0b6ab0]"
            )}
            style={{ left: x(i) }}
          >
            {/* Phones: initials keep twelve months on one row. */}
            {compact ? l.slice(0, 1) : l}
          </span>
        ))}
      </div>
    </div>
  )
}

export function LakeDemo({ active = true }: Readonly<{ active?: boolean }>) {
  const { ref, playing, reduce, compact } = usePlaying(active)
  const t = useTranslations("platform.demos.lake")
  const asks = t.raw("asks") as LakeAsk[]
  const [pick, setPick] = useState(0)
  const a = asks[pick]
  const data = lakeAsks[pick]
  const step = useScript(lakeTiming, playing, `${pick}`, () =>
    setPick((v) => (v + 1) % lakeAsks.length)
  )
  const s = reduce ? 3 : step

  return (
    <div ref={ref} className="size-full">
      <Stage desk="lake" compact={compact}>
        {compact ? (
          /* Phones: the cards stack with even gaps; the SQL and the answer
             share one slot, as one replaces the other. */
          <div className="absolute inset-3 flex flex-col gap-3">
            {/* Ask */}
            <Card
              className={cn(
                "p-3",
                compact
                  ? "relative"
                  : "top-8 left-1/2 w-[560px] -translate-x-1/2"
              )}
              key={`ask-${pick}`}
            >
              <div className="flex items-center gap-3 px-1">
                <ProductLogo id="lake" className="h-4" />
                <span
                  className={cn(
                    "flex-1",
                    compact ? "text-[13px] leading-snug" : "text-[14px]"
                  )}
                >
                  {/* The full question, invisible, holds the size while it types */}
                  <span className="grid">
                    <span
                      aria-hidden="true"
                      className="invisible col-start-1 row-start-1"
                    >
                      {a.q}
                    </span>
                    <span className="col-start-1 row-start-1">
                      <Typed text={a.q} on={s >= 0} />
                    </span>
                  </span>
                </span>
                <span className="grid size-7 place-items-center rounded-full bg-[#0b6ab0] text-white">
                  <ArrowUp className="size-3.5" />
                </span>
              </div>
            </Card>

            <div className="grid">
              {/* SQL */}
              <Card
                className={cn(
                  "overflow-hidden",
                  compact
                    ? "relative col-start-1 row-start-1"
                    : "top-[110px] left-8 w-[300px]"
                )}
                show={s >= 1 && (!compact || s < 2)}
                key={`sql-${pick}`}
              >
                <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5 text-[12px] font-medium text-neutral-500">
                  {t("sql")}
                  {s === 1 ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check
                      className="size-3.5 text-[#10b981]"
                      strokeWidth={3}
                    />
                  )}
                </div>
                <pre
                  className={cn(
                    "px-4 py-3 [font-family:ui-monospace,monospace] leading-relaxed whitespace-pre-wrap text-[#1e3a8a]",
                    compact ? "text-[12px]" : "text-[11.5px]"
                  )}
                >
                  <Typed text={data.sql} on={s >= 1} speed={12} />
                </pre>
              </Card>

              {/* Answer: a ranking or a time series, per question */}
              <Card
                className={cn(
                  compact
                    ? "relative col-start-1 row-start-1 px-4 py-3"
                    : "top-[110px] right-8 w-[480px] p-5"
                )}
                show={s >= 2}
                key={`chart-${pick}`}
              >
                <div
                  className={cn(
                    !compact && "flex items-baseline justify-between gap-2"
                  )}
                >
                  <p className="truncate text-[14px] font-medium">{a.title}</p>
                  <p className="shrink-0 text-[12px] text-neutral-500">
                    {t("unit")}
                  </p>
                </div>
                {data.kind === "rank" ? (
                  <Ranking
                    labels={a.labels}
                    codes={data.codes}
                    values={data.values}
                    compact={compact}
                    reduce={reduce}
                  />
                ) : (
                  <Season
                    labels={a.labels}
                    values={data.values}
                    peakName={a.peak ?? ""}
                    compact={compact}
                    reduce={reduce}
                  />
                )}
              </Card>
            </div>
            {/* Lineage */}
            <Card
              className={cn(
                "p-4",
                compact ? "relative" : "bottom-20 left-8 w-[300px]"
              )}
              show={s >= 3}
            >
              <p className="text-[12px] font-medium text-neutral-500">
                {t("lineage")}
              </p>
              <div
                className={cn(
                  "mt-3 flex items-center",
                  compact ? "text-[12px]" : "text-[11px]",
                  compact ? "gap-1.5" : "gap-2"
                )}
              >
                {[
                  [Database, "raw"],
                  [Table2, "clean"],
                  [Sparkles, "answer"],
                ].map(([Icon, l], i) => {
                  const I = Icon as typeof Database
                  return (
                    <span
                      key={l as string}
                      className={cn(
                        "flex items-center",
                        compact ? "gap-1.5" : "gap-2",
                        compact && i < 2 && "flex-1"
                      )}
                    >
                      <span className="flex items-center gap-1.5 rounded-lg border border-black/[0.08] px-2 py-1.5">
                        <I className="size-3.5 text-[#2563eb]" /> {l as string}
                      </span>
                      {i < 2 && (
                        <span
                          className={cn(
                            "h-px bg-neutral-300",
                            compact ? "min-w-2 flex-1" : "w-4"
                          )}
                        />
                      )}
                    </span>
                  )
                })}
              </div>
            </Card>
          </div>
        ) : (
          <>
            {/* Ask */}
            <Card
              className={cn(
                "p-3",
                compact
                  ? "relative"
                  : "top-8 left-1/2 w-[560px] -translate-x-1/2"
              )}
              key={`ask-${pick}`}
            >
              <div className="flex items-center gap-3 px-1">
                <ProductLogo id="lake" className="h-4" />
                <span
                  className={cn(
                    "flex-1",
                    compact ? "text-[13px] leading-snug" : "text-[14px]"
                  )}
                >
                  {/* The full question, invisible, holds the size while it types */}
                  <span className="grid">
                    <span
                      aria-hidden="true"
                      className="invisible col-start-1 row-start-1"
                    >
                      {a.q}
                    </span>
                    <span className="col-start-1 row-start-1">
                      <Typed text={a.q} on={s >= 0} />
                    </span>
                  </span>
                </span>
                <span className="grid size-7 place-items-center rounded-full bg-[#0b6ab0] text-white">
                  <ArrowUp className="size-3.5" />
                </span>
              </div>
            </Card>

            {/* SQL */}
            <Card
              className={cn(
                "overflow-hidden",
                compact
                  ? "relative col-start-1 row-start-1"
                  : "top-[110px] left-8 w-[300px]"
              )}
              show={s >= 1 && (!compact || s < 2)}
              key={`sql-${pick}`}
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-2.5 text-[12px] font-medium text-neutral-500">
                {t("sql")}
                {s === 1 ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5 text-[#10b981]" strokeWidth={3} />
                )}
              </div>
              <pre
                className={cn(
                  "px-4 py-3 [font-family:ui-monospace,monospace] leading-relaxed whitespace-pre-wrap text-[#1e3a8a]",
                  compact ? "text-[12px]" : "text-[11.5px]"
                )}
              >
                <Typed text={data.sql} on={s >= 1} speed={12} />
              </pre>
            </Card>

            {/* Answer: a ranking or a time series, per question */}
            <Card
              className={cn(
                compact
                  ? "relative col-start-1 row-start-1 px-4 py-3"
                  : "top-[110px] right-8 w-[480px] p-5"
              )}
              show={s >= 2}
              key={`chart-${pick}`}
            >
              <div
                className={cn(
                  !compact && "flex items-baseline justify-between gap-2"
                )}
              >
                <p className="truncate text-[14px] font-medium">{a.title}</p>
                <p className="shrink-0 text-[12px] text-neutral-500">
                  {t("unit")}
                </p>
              </div>
              {data.kind === "rank" ? (
                <Ranking
                  labels={a.labels}
                  codes={data.codes}
                  values={data.values}
                  compact={compact}
                  reduce={reduce}
                />
              ) : (
                <Season
                  labels={a.labels}
                  values={data.values}
                  peakName={a.peak ?? ""}
                  compact={compact}
                  reduce={reduce}
                />
              )}
            </Card>

            {/* Lineage */}
            <Card
              className={cn(
                "p-4",
                compact ? "relative" : "bottom-20 left-8 w-[300px]"
              )}
              show={s >= 3}
            >
              <p className="text-[12px] font-medium text-neutral-500">
                {t("lineage")}
              </p>
              <div
                className={cn(
                  "mt-3 flex items-center",
                  compact ? "text-[12px]" : "text-[11px]",
                  compact ? "gap-1.5" : "gap-2"
                )}
              >
                {[
                  [Database, "raw"],
                  [Table2, "clean"],
                  [Sparkles, "answer"],
                ].map(([Icon, l], i) => {
                  const I = Icon as typeof Database
                  return (
                    <span
                      key={l as string}
                      className={cn(
                        "flex items-center",
                        compact ? "gap-1.5" : "gap-2",
                        compact && i < 2 && "flex-1"
                      )}
                    >
                      <span className="flex items-center gap-1.5 rounded-lg border border-black/[0.08] px-2 py-1.5">
                        <I className="size-3.5 text-[#2563eb]" /> {l as string}
                      </span>
                      {i < 2 && (
                        <span
                          className={cn(
                            "h-px bg-neutral-300",
                            compact ? "min-w-2 flex-1" : "w-4"
                          )}
                        />
                      )}
                    </span>
                  )
                })}
              </div>
            </Card>
          </>
        )}

        <Chips
          options={asks.map((x) => x.chip)}
          value={pick}
          onPick={setPick}
          compact={compact}
        />
      </Stage>
    </div>
  )
}
