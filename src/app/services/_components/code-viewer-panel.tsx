"use client"

import Image from "next/image"
import { motion } from "motion/react"
import type { TabContentSoftware, TabContentAI } from "../types"

function HArrow() {
  return (
    <div className="flex shrink-0 items-center justify-center px-1">
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
        <path
          d="M0 5H16M16 5L11 1.5M16 5L11 8.5"
          stroke="#454545"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function VArrow() {
  return (
    <div className="flex items-center justify-center py-0.5">
      <svg width="10" height="20" viewBox="0 0 10 20" fill="none">
        <path
          d="M5 0V16M5 16L1.5 11M5 16L8.5 11"
          stroke="#454545"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function PipelineBox({
  step,
}: {
  step: { label: string; highlighted?: boolean }
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[4px] border px-3 py-3 lg:px-4 lg:py-4 ${
        step.highlighted ? "border-[#3685ed]" : ""
      }`}
    >
      <span
        className={`text-xs font-medium whitespace-nowrap lg:text-base ${
          step.highlighted ? "text-[#3685ed]" : "text-white"
        }`}
      >
        {step.label}
      </span>
    </div>
  )
}

export function SoftwareViewerPanel({ data }: { data: TabContentSoftware }) {
  return (
    <CodeViewerShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-2"
      >
        {data.stack.map((row) => {
          const Icon = row.categoryIcon
          return (
            <div
              key={row.category}
              className="group flex items-center justify-between rounded-[8px] border bg-muted px-4 py-4 transition-all hover:border-foreground"
            >
              <div className="flex items-center gap-2">
                <Icon className="size-5" style={{ color: row.iconColor }} />
                <span className="text-base font-medium">{row.category}</span>
              </div>
              <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100">
                <span className="font-light text-muted-foreground">
                  {row.tech}
                </span>
                <Image
                  src={row.techIcon}
                  alt={row.tech}
                  width={20}
                  height={20}
                  className="size-5"
                />
              </div>
            </div>
          )
        })}
      </motion.div>
    </CodeViewerShell>
  )
}

export function AiViewerPanel({ data }: { data: TabContentAI }) {
  return (
    <CodeViewerShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-x-1 rounded-[4px] border p-2 lg:p-4">
          {/* Row 1 */}
          <PipelineBox step={data.pipelineRow1[0]} />
          <HArrow />
          <PipelineBox step={data.pipelineRow1[1]} />
          <HArrow />
          <PipelineBox step={data.pipelineRow1[2]} />

          {/* Vertical connector — only in middle column */}
          <div />
          <div />
          <VArrow />
          <div />
          <div />

          {/* Row 2 */}
          <PipelineBox step={data.pipelineRow2[0]} />
          <HArrow />
          <PipelineBox step={data.pipelineRow2[1]} />
          <HArrow />
          <PipelineBox step={data.pipelineRow2[2]} />
        </div>

        <div className="flex gap-4">
          {data.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-1 flex-col items-center justify-center rounded-[4px] border p-4"
            >
              <span className="text-2xl font-medium text-white">
                {stat.value}
              </span>
              <span className="text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </CodeViewerShell>
  )
}

function CodeViewerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[380px] flex-1 rounded-tl-[24px] border-t-8 border-l-8 border-foreground bg-muted">
      <div className="flex items-center gap-2 p-6">
        <span className="size-4 rounded-full bg-[#ff5f57]" />
        <span className="size-4 rounded-full bg-[#ffbc2e]" />
        <span className="size-4 rounded-full bg-[#28c840]" />
      </div>
      <div className="px-6 pb-6">{children}</div>
    </div>
  )
}
