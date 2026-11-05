"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { ArrowUp, ArrowUpLeft, Check, Mail } from "lucide-react"
import { useTranslations } from "next-intl"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

/**
 * Types each line out, pauses, deletes it, then moves to the next. Only
 * while `ref` is on screen: off screen it would re-render for nothing.
 */
function useTypewriter(
  lines: string[],
  ref: React.RefObject<HTMLElement | null>
) {
  const reduce = useReducedMotion()
  const [text, setText] = useState(lines[0] ?? "")
  const [onScreen, setOnScreen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  useEffect(() => {
    if (reduce || !lines.length || !onScreen) return
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
        // Hold each example long enough to read
        timer = setTimeout(tick, 3500)
      } else if (deleting && length === 0) {
        deleting = false
        line = (line + 1) % lines.length
        timer = setTimeout(tick, 600)
      } else {
        timer = setTimeout(tick, deleting ? 30 : 70)
      }
    }
    timer = setTimeout(tick, 800)
    return () => clearTimeout(timer)
  }, [lines, reduce, onScreen])

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
  email: customEmail,
  prompts: given,
}: Readonly<{
  label: string
  subject: string
  email?: string
  prompts?: string[]
}>) {
  const t = useTranslations("common.footer.prompt")
  const prompts = given ?? (t.raw("examples") as string[])
  const [value, setValue] = useState("")
  const [sent, setSent] = useState(false)
  const borderRef = useRef<HTMLDivElement>(null)
  const placeholder = useTypewriter(prompts, borderRef)
  useBorderLight(borderRef)

  // Clear the "opening your email app" note after a few seconds.
  useEffect(() => {
    if (!sent) return
    const timer = setTimeout(() => setSent(false), 5000)
    return () => clearTimeout(timer)
  }, [sent])

  const email = customEmail ?? siteConfig.links.email
  const href = `mailto:${email}?subject=${encodeURIComponent(subject)}${
    value ? `&body=${encodeURIComponent(value)}` : ""
  }`

  return (
    <>
      <div className="relative w-full">
        {/* Dark halo that lifts the composer off the ASCII field */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-16 -inset-y-12 -z-10 bg-[radial-gradient(closest-side,rgb(0_0_0/0.9),transparent)] max-sm:hidden"
        />
        <div
          ref={borderRef}
          className="relative rounded-[20px] bg-[linear-gradient(180deg,rgb(255_255_255/0.45),rgb(255_255_255/0.08)_45%,rgb(255_255_255/0.2))] p-[1.5px] shadow-[0_0_0_6px_rgb(255_255_255/0.03),0_30px_90px_-20px_rgb(255_255_255/0.18)] transition-shadow focus-within:shadow-[0_0_0_6px_rgb(255_255_255/0.07),0_30px_90px_-20px_rgb(255_255_255/0.28)] max-sm:rounded-[18px] max-sm:bg-white/35 max-sm:bg-none max-sm:p-px max-sm:shadow-[0_0_0_4px_rgb(255_255_255/0.05),0_18px_50px_-18px_rgb(255_255_255/0.3)] max-sm:transition-[background-color,box-shadow] max-sm:focus-within:bg-white/70 max-sm:focus-within:shadow-[0_0_0_4px_rgb(255_255_255/0.1),0_18px_50px_-18px_rgb(255_255_255/0.4)]"
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
            className="relative w-full rounded-[18.5px] bg-[linear-gradient(180deg,#1a1a1c,#0c0c0d)] p-3 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] max-sm:rounded-[17px] max-sm:bg-[#161618] max-sm:bg-none max-sm:p-2.5 max-sm:shadow-none"
          >
            <label htmlFor="footer-prompt" className="sr-only">
              {t("label")}
            </label>
            {/* Phones: the field fits the longest example (so the typing
                placeholder never changes its height), is at least three
                lines tall, and grows with what the visitor writes; the send
                button sits on its own row below, as on desktop */}
            <div className="relative min-w-0 max-sm:min-h-[5.25rem]">
              <div
                aria-hidden="true"
                className="invisible grid px-2 py-1.5 text-base [overflow-wrap:anywhere] whitespace-pre-wrap sm:hidden"
              >
                {[...prompts, value].map((line, i) => (
                  <span key={i} className="col-start-1 row-start-1">
                    {line}▍{" "}
                  </span>
                ))}
              </div>
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
                className="w-full resize-none bg-transparent px-2 py-1.5 text-base text-white outline-none placeholder:text-white/55 max-sm:absolute max-sm:inset-0 max-sm:h-full max-sm:overflow-hidden max-sm:placeholder:text-white/45 sm:text-lg"
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-2 max-sm:justify-end">
              <span
                aria-live="polite"
                className="flex min-w-0 items-center gap-1.5 px-1 text-xs text-white/45 max-sm:hidden sm:px-2"
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
                    {/* Phones keep the row for the send button */}
                    <Mail
                      className="size-3.5 shrink-0 text-white/55 max-sm:hidden"
                      aria-hidden="true"
                    />
                    <span className="text-xs whitespace-nowrap max-sm:hidden">
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
                <span>{label}</span>
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

      {/* Phones show the "opening your email" note under the field */}
      <p
        aria-live="polite"
        className={cn(
          "flex items-center gap-1.5 overflow-hidden text-[13px] text-white/75 transition-[max-height,opacity,margin] duration-300 sm:hidden",
          sent ? "mt-3 max-h-6 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {sent && (
          <>
            <Check
              className="size-3.5 shrink-0 text-emerald-400"
              aria-hidden="true"
            />
            {t("opening")}
          </>
        )}
      </p>

      {/* Desktop: chips. Phones: two quiet rows that fill the field when tapped */}
      <div className="relative mt-5 flex flex-wrap justify-center gap-2 max-sm:mt-4 max-sm:w-full max-sm:flex-col max-sm:gap-0">
        {prompts.slice(0, 3).map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setValue(prompt)}
            className="group max-w-full rounded-full border border-white/20 bg-[linear-gradient(180deg,#1c1c1e,#111112)] px-3.5 py-1.5 text-[13px] text-balance text-white/85 shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_8px_24px_-12px_rgb(0_0_0/0.9)] transition-[border-color,color] duration-300 hover:border-white/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1 max-sm:flex max-sm:min-h-12 max-sm:w-full max-sm:items-center max-sm:justify-between max-sm:gap-4 max-sm:rounded-none max-sm:border-0 max-sm:border-b max-sm:border-white/10 max-sm:bg-none max-sm:px-0 max-sm:py-3 max-sm:text-left max-sm:text-[15px] max-sm:text-pretty max-sm:text-white/65 max-sm:shadow-none max-sm:hover:border-white/10 max-sm:active:text-white max-sm:nth-3:hidden"
          >
            {prompt}
            <ArrowUpLeft
              className="size-4 shrink-0 text-white/30 transition-colors group-active:text-white/70 sm:hidden"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </>
  )
}
