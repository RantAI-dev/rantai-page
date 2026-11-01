"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { ArrowUp, Check, Mail } from "lucide-react"
import { useTranslations } from "next-intl"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

/** Types each line out, pauses, deletes it, then moves to the next. */
function useTypewriter(lines: string[]) {
  const reduce = useReducedMotion()
  const [text, setText] = useState(lines[0] ?? "")

  useEffect(() => {
    if (reduce || !lines.length) return
    let line = 0
    let length = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const full = lines[line]
      length += deleting ? -1 : 1
      setText(full.slice(0, length))
      if (!deleting && length === full.length) {
        deleting = true
        timer = setTimeout(tick, 1800)
      } else if (deleting && length === 0) {
        deleting = false
        line = (line + 1) % lines.length
        timer = setTimeout(tick, 350)
      } else {
        timer = setTimeout(tick, deleting ? 20 : 45)
      }
    }
    timer = setTimeout(tick, 800)
    return () => clearTimeout(timer)
  }, [lines, reduce])

  return text
}

/** Lights the composer's border nearest the pointer, anywhere in the card. */
function useBorderLight(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const border = ref.current
    const card = border?.closest<HTMLElement>("section")
    if (!border || !card) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    border.style.setProperty("--glow", "0")
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const rect = border.getBoundingClientRect()
      border.style.setProperty("--mx", `${event.clientX - rect.left}px`)
      border.style.setProperty("--my", `${event.clientY - rect.top}px`)
      border.style.setProperty("--glow", "1")
    }
    const leave = () => border.style.setProperty("--glow", "0")
    card.addEventListener("pointermove", move)
    card.addEventListener("pointerleave", leave)
    return () => {
      card.removeEventListener("pointermove", move)
      card.removeEventListener("pointerleave", leave)
    }
  }, [ref])
}

/**
 * An agent-style composer. Visitors describe a workflow (or pick a
 * suggestion) and sending opens an email to our team with their text.
 */
export function FooterPrompt({
  label,
  subject,
  prompts: given,
}: Readonly<{ label: string; subject: string; prompts?: string[] }>) {
  const t = useTranslations("common.footer.prompt")
  const prompts = given ?? (t.raw("examples") as string[])
  const [value, setValue] = useState("")
  const [sent, setSent] = useState(false)
  const placeholder = useTypewriter(prompts)
  const borderRef = useRef<HTMLDivElement>(null)
  useBorderLight(borderRef)

  // Clear the "opening your email app" note after a few seconds.
  useEffect(() => {
    if (!sent) return
    const timer = setTimeout(() => setSent(false), 5000)
    return () => clearTimeout(timer)
  }, [sent])

  const email = siteConfig.links.email
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}${
    value ? `&body=${encodeURIComponent(value)}` : ""
  }`

  return (
    <>
      <div className="relative w-full">
        {/* Dark halo that lifts the composer off the ASCII field */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-16 -inset-y-12 -z-10 bg-[radial-gradient(closest-side,rgb(0_0_0/0.9),transparent)]"
        />
        <div
          ref={borderRef}
          className="relative rounded-[20px] bg-[linear-gradient(180deg,rgb(255_255_255/0.45),rgb(255_255_255/0.08)_45%,rgb(255_255_255/0.2))] p-[1.5px] shadow-[0_0_0_6px_rgb(255_255_255/0.03),0_30px_90px_-20px_rgb(255_255_255/0.18)] transition-shadow focus-within:shadow-[0_0_0_6px_rgb(255_255_255/0.07),0_30px_90px_-20px_rgb(255_255_255/0.28)]"
        >
          {/* Cursor light: a soft bloom outside, a bright spot on the border */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 -z-10 rounded-[30px] bg-[radial-gradient(260px_circle_at_var(--mx)_var(--my),rgb(255_255_255/0.32),transparent_70%)] opacity-(--glow) blur-lg transition-opacity duration-500"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[20px] bg-[radial-gradient(240px_circle_at_var(--mx)_var(--my),#fff,transparent_75%)] opacity-(--glow) transition-opacity duration-500"
          />
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
              window.location.href = href
            }}
            className="relative w-full rounded-[18.5px] bg-[linear-gradient(180deg,#1a1a1c,#0c0c0d)] p-3 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]"
          >
            <label htmlFor="footer-prompt" className="sr-only">
              {t("label")}
            </label>
            <textarea
              id="footer-prompt"
              rows={2}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  e.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder={`${placeholder}▍`}
              className="w-full resize-none bg-transparent px-2 py-1.5 text-base text-white outline-none placeholder:text-white/55 sm:text-lg"
            />
            <div className="flex items-center justify-between gap-3 pt-2">
              <span
                aria-live="polite"
                className="flex min-w-0 items-center gap-1.5 px-1 text-xs text-white/45 sm:px-2"
              >
                {sent ? (
                  <>
                    <Check
                      className="size-3.5 shrink-0 text-emerald-400"
                      aria-hidden="true"
                    />
                    <span className="text-white/75">{t("opening")}</span>
                  </>
                ) : (
                  <>
                    <Mail
                      className="size-3.5 shrink-0 text-white/55"
                      aria-hidden="true"
                    />
                    <span className="text-[11px] whitespace-nowrap sm:text-xs">
                      {email}
                    </span>
                  </>
                )}
              </span>
              <button
                type="submit"
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-full pr-1.5 pl-3.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1 sm:pl-4 sm:text-sm",
                  value
                    ? "bg-white text-black hover:bg-white/85"
                    : "bg-white/15 text-white hover:bg-white/25"
                )}
              >
                {label}
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full transition-colors",
                    value ? "bg-black text-white" : "bg-white text-black"
                  )}
                >
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap justify-center gap-2">
        {prompts.slice(0, 3).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setValue(prompt)}
            className="rounded-full border border-white/20 bg-[linear-gradient(180deg,#1c1c1e,#111112)] px-3.5 py-1.5 text-[13px] text-white/85 shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_8px_24px_-12px_rgb(0_0_0/0.9)] transition-[border-color,color] duration-300 hover:border-white/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1"
          >
            {prompt}
          </button>
        ))}
      </div>
    </>
  )
}
