"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import {
  ArrowUp,
  Check,
  FileSpreadsheet,
  FileText,
  Loader2,
  MessageSquare,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { ProductTile } from "@/components/shared/product-logo"
import { cn } from "@/lib/utils"

import { Stage, Card, Typed, useScript, usePlaying, Chips } from "./shared"

/* ------------------------------------------------------------------ */
/*  RantAI Agents: ask, retrieve, answer with a citation, artifact     */
/* ------------------------------------------------------------------ */

// File names stay as they are in every language; the rest comes from
// messages (platform.demos.agents.prompts, same order).
const agentFiles = [
  {
    sources: ["HR Policy 2026.pdf", "Leave SOP v3.docx", "Benefits.xlsx"],
    artifact: "Leave summary.docx",
  },
  {
    sources: [
      "Procurement log.xlsx",
      "Approval matrix.pdf",
      "Vendor list.xlsx",
    ],
    artifact: "Procurement brief.pdf",
  },
  {
    sources: ["Vendor contract.pdf", "Delivery tracker.xlsx", "Email thread"],
    artifact: "Reply draft.eml",
  },
]
type AgentStatus = "approved" | "pending" | "returned"
type AgentPrompt = {
  chip: string
  assistant: string
  q: string
  a: string
  cite: string
  /** Procurement: the answer is a small table. */
  rows?: { item: string; team: string; amount: string; status: AgentStatus }[]
  summary?: string
  /** Vendor reply: the answer is an email the agent drafts, then sends. */
  email?: { to: string; subject: string; body: string }
}
const agentTiming = [1500, 1700, 2600]

const statusTone: Record<AgentStatus, string> = {
  approved: "bg-[#10b981]/12 text-[#047857]",
  pending: "bg-[#f59e0b]/15 text-[#b45309]",
  returned: "bg-neutral-200/70 text-neutral-600",
}

/** Procurement answer: the largest requests, one row at a time. */
function RequestTable({
  rows,
  summary,
  start,
  done,
  compact,
}: Readonly<{
  rows: NonNullable<AgentPrompt["rows"]>
  summary?: string
  /** Seconds to wait (while the intro line types) before the rows come in. */
  start: number
  done: boolean
  compact: boolean
}>) {
  const t = useTranslations("platform.demos.agents.status")
  return (
    <div className="mt-2.5 overflow-hidden rounded-xl border border-black/[0.07]">
      <ul className="divide-y divide-black/[0.06]">
        {rows.map((r, i) => (
          <motion.li
            key={r.item}
            className="flex items-center gap-2 px-3 py-2"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: start + i * 0.35, duration: 0.3 }}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-medium">
                {r.item}
              </span>
              <span className="block text-[11px] text-neutral-500">
                {r.team} · {r.amount}
              </span>
            </span>
            <motion.span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 font-medium",
                compact ? "text-[11px]" : "text-[10.5px]",
                statusTone[r.status]
              )}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: start + i * 0.35 + 0.2 }}
            >
              {t(r.status)}
            </motion.span>
          </motion.li>
        ))}
      </ul>
      {summary && (
        <motion.p
          className="border-t border-black/[0.06] bg-neutral-50 px-3 py-1.5 text-[11px] text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 1 : 0 }}
        >
          {summary}
        </motion.p>
      )}
    </div>
  )
}

/** Vendor reply: the agent writes the email, then sends it. */
function EmailDraft({
  email,
  start,
  send,
}: Readonly<{
  email: NonNullable<AgentPrompt["email"]>
  start: number
  send: boolean
}>) {
  const t = useTranslations("platform.demos.agents")
  const [writing, setWriting] = useState(false)
  const [sent, setSent] = useState(false)
  useEffect(() => {
    const w = setTimeout(() => setWriting(true), start * 1000)
    return () => clearTimeout(w)
  }, [start])
  useEffect(() => {
    if (!send) return
    const s = setTimeout(() => setSent(true), 900)
    return () => clearTimeout(s)
  }, [send])
  return (
    <motion.div
      className="mt-2.5 rounded-xl border border-black/[0.07] text-[12px]"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: start }}
    >
      <div className="space-y-1 border-b border-black/[0.06] px-3 py-2">
        <p className="truncate">
          <span className="text-neutral-400">{t("to")} </span>
          {email.to}
        </p>
        <p className="truncate font-medium">{email.subject}</p>
      </div>
      <p className="min-h-[4.5em] px-3 py-2 leading-relaxed text-neutral-700">
        <Typed text={email.body} on={writing} speed={14} />
      </p>
      <div className="flex justify-end px-3 pb-2.5">
        <motion.span
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-full px-3 font-medium transition-colors duration-300",
            sent
              ? "bg-[#10b981]/12 text-[#047857]"
              : "bg-neutral-900 text-white"
          )}
          animate={send && !sent ? { scale: [1, 0.92, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, delay: 0.5 }}
        >
          {sent ? (
            <>
              <Check className="size-3" strokeWidth={3} /> {t("sent")}
            </>
          ) : (
            <>
              {t("send")} <ArrowUp className="size-3 rotate-45" />
            </>
          )}
        </motion.span>
      </div>
    </motion.div>
  )
}

export function AgentsDemo({ active = true }: Readonly<{ active?: boolean }>) {
  const { ref, playing, reduce, compact } = usePlaying(active)
  const t = useTranslations("platform.demos.agents")
  const prompts = t.raw("prompts") as AgentPrompt[]
  const [pick, setPick] = useState(0)
  const p = { ...prompts[pick], ...agentFiles[pick] }
  const step = useScript(agentTiming, playing, `${pick}`, () =>
    setPick((v) => (v + 1) % agentFiles.length)
  )
  const s = reduce ? 3 : step
  const sourceIcons = [FileText, FileText, FileSpreadsheet]
  // Phones: a table or an email hides the input bar to make room.
  const rich = Boolean(p.rows || p.email)
  // The rich part comes in once the short intro line has typed.
  const introTime = p.a.length * 0.018 + 0.2

  return (
    <div ref={ref} className="size-full">
      <Stage desk="agents" compact={compact}>
        {/* Knowledge */}
        <Card className="top-16 left-8 w-[220px] p-4" show={!compact && s >= 1}>
          <p className="text-[12px] font-medium text-neutral-500">
            {t("knowledge")}
          </p>
          <ul className="mt-3 space-y-2.5">
            {p.sources.map((src, i) => {
              const Icon = sourceIcons[i] ?? MessageSquare
              return (
                <motion.li
                  key={src}
                  className="flex items-center gap-2.5 text-[13px]"
                  initial={{ opacity: 0.35 }}
                  animate={{ opacity: s >= 1 ? 1 : 0.35 }}
                  transition={{ delay: 0.25 + i * 0.35 }}
                >
                  <span className="grid size-7 place-items-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="flex-1 truncate">{src}</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: s >= 1 ? 1 : 0 }}
                    transition={{ delay: 0.35 + i * 0.35 }}
                  >
                    <Check
                      className="size-3.5 text-[#10b981]"
                      strokeWidth={3}
                    />
                  </motion.span>
                </motion.li>
              )
            })}
          </ul>
        </Card>

        {/* Chat */}
        <Card
          className={cn(
            "flex flex-col overflow-hidden",
            compact
              ? "inset-x-3 top-3 h-[376px]"
              : "top-10 left-[270px] h-[400px] w-[380px]"
          )}
          key={`chat-${pick}`}
        >
          <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3 text-[13px] font-medium">
            <ProductTile id="agents" />
            {p.assistant}
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-hidden p-4">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-neutral-100 px-3.5 py-2.5 text-[13px]">
              <Typed text={p.q} on={s >= 0} />
            </div>
            {s >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[13px] leading-relaxed"
              >
                {s === 1 ? (
                  <span className="inline-flex items-center gap-2 text-neutral-500">
                    <Loader2 className="size-3.5 animate-spin" />{" "}
                    {t("searching", { count: p.sources.length })}
                  </span>
                ) : (
                  <>
                    <Typed text={p.a} on={s >= 2} speed={18} />
                    {p.rows && (
                      <RequestTable
                        rows={p.rows}
                        summary={p.summary}
                        start={introTime}
                        done={s >= 3}
                        compact={compact}
                      />
                    )}
                    {p.email && (
                      <EmailDraft
                        email={p.email}
                        start={introTime}
                        send={s >= 3}
                      />
                    )}
                    {/* Phones: the email's intro already names the clause. */}
                    {s >= 3 && !(compact && p.email) && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "mt-2.5 flex w-fit items-center gap-1.5 rounded-full border border-[#3b82f6]/25 bg-[#3b82f6]/[0.06] px-2.5 py-1 text-[#2563eb]",
                          compact ? "text-[12px]" : "text-[11px]"
                        )}
                      >
                        <FileText className="size-3" /> {p.cite}
                      </motion.span>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
          <div
            className={cn(
              "mx-4 mb-4 flex items-center justify-between gap-2 rounded-xl border border-black/[0.08] px-3 py-2 text-[12px] text-neutral-400",
              compact && rich && "hidden"
            )}
          >
            <span className="min-w-0 truncate">{t("placeholder")}</span>
            <span className="grid size-6 place-items-center rounded-full bg-neutral-900 text-white">
              <ArrowUp className="size-3" />
            </span>
          </div>
        </Card>

        {/* Artifact (desktop; on phones the chat takes the room) */}
        <Card
          className="top-[190px] right-8 w-[190px] p-4"
          show={!compact && s >= 3}
        >
          <p className="text-[12px] font-medium text-neutral-500">
            {t("artifact")}
          </p>
          <div className="mt-3 rounded-xl border border-black/[0.07] bg-neutral-50 p-3">
            <span className="grid size-8 place-items-center rounded-lg bg-[#8b5cf6]/12 text-[#8b5cf6]">
              <FileText className="size-4" />
            </span>
            <p className="mt-2.5 text-[13px] font-medium">{p.artifact}</p>
            <div className="mt-2 space-y-1.5">
              <span className="block h-1.5 w-full rounded-full bg-neutral-200" />
              <span className="block h-1.5 w-4/5 rounded-full bg-neutral-200" />
              <span className="block h-1.5 w-3/5 rounded-full bg-neutral-200" />
            </div>
          </div>
        </Card>

        <Chips
          options={prompts.map((a) => a.chip)}
          value={pick}
          onPick={setPick}
          compact={compact}
        />
      </Stage>
    </div>
  )
}
