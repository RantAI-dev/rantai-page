"use client"

import { useEffect, useId, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, Check, Copy } from "lucide-react"
import { useTranslations } from "next-intl"

import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const
const TOPICS = ["products", "engineering", "academy", "other"] as const
type Topic = (typeof TOPICS)[number]

const field =
  "w-full rounded-xl bg-neutral-50 px-4 text-[16px] text-neutral-950 ring-1 ring-black/[0.06] transition-[box-shadow,background-color] outline-none placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-neutral-900/15 aria-[invalid=true]:ring-rose-400/70 sm:text-[15px]"

/**
 * There is no form backend yet: sending opens the visitor's email app with
 * the message laid out (Academy questions go to the Academy inbox). The
 * address is shown and can be copied, for anyone without a mail app.
 * `?topic=` and `?message=` in the URL fill the form in.
 */
export function ContactForm() {
  const t = useTranslations("contact.form")
  const reduce = useReducedMotion()
  const id = useId()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [topic, setTopic] = useState<Topic>("engineering")
  const [message, setMessage] = useState("")
  const [tried, setTried] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fill in from a link, e.g. the footer composer or an Academy button.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const m = q.get("message")
    const tp = q.get("topic")
    /* eslint-disable react-hooks/set-state-in-effect -- read once, on mount */
    if (m) setMessage(m.slice(0, 2000))
    if (tp && (TOPICS as readonly string[]).includes(tp)) setTopic(tp as Topic)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  const to =
    topic === "academy" ? siteConfig.links.academyEmail : siteConfig.links.email
  const errors = {
    name: !name.trim() ? t("required") : "",
    email: !email.trim()
      ? t("required")
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? t("invalidEmail")
        : "",
    message: !message.trim() ? t("required") : "",
  }
  const valid = !errors.name && !errors.email && !errors.message

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!valid) {
      const first = (["name", "email", "message"] as const).find(
        (k) => errors[k]
      )
      document.getElementById(`${id}-${first}`)?.focus()
      return
    }
    const subject = t("subject", {
      topic: t(`topics.${topic}`),
      name: company.trim() || name.trim(),
    })
    const body = [
      message.trim(),
      "",
      "—",
      `${t("bodyName")}: ${name.trim()}`,
      `${t("bodyEmail")}: ${email.trim()}`,
      ...(company.trim() ? [`${t("bodyCompany")}: ${company.trim()}`] : []),
    ].join("\n")
    setSent(true)
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const error = (k: keyof typeof errors) =>
    tried && errors[k] ? (
      <p id={`${id}-${k}-error`} className="mt-1.5 text-[13px] text-rose-600">
        {errors[k]}
      </p>
    ) : null

  const label =
    "mb-2 flex items-baseline justify-between text-[13px] font-medium text-neutral-700"

  return (
    <motion.form
      noValidate
      aria-label={t("label")}
      onSubmit={submit}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay: 0.25 }}
      className="rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.07] max-sm:-mx-1 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            {t("name")}
          </label>
          <input
            id={`${id}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={tried && !!errors.name}
            aria-describedby={
              tried && errors.name ? `${id}-name-error` : undefined
            }
            className={cn(field, "h-12")}
          />
          {error("name")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={label}>
            {t("email")}
          </label>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={tried && !!errors.email}
            aria-describedby={
              tried && errors.email ? `${id}-email-error` : undefined
            }
            className={cn(field, "h-12")}
          />
          {error("email")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${id}-company`} className={label}>
            {t("company")}
            <span className="font-normal text-neutral-400">
              {t("optional")}
            </span>
          </label>
          <input
            id={`${id}-company`}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
            className={cn(field, "h-12")}
          />
        </div>

        <fieldset className="sm:col-span-2">
          <legend className={label}>{t("topic")}</legend>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {TOPICS.map((k) => {
              const on = topic === k
              return (
                <label
                  key={k}
                  className={cn(
                    "relative inline-flex h-11 cursor-pointer items-center justify-center rounded-full px-4 text-[14px] ring-1 transition-[background-color,color,box-shadow] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-1 sm:h-10",
                    on
                      ? "bg-neutral-950 text-white ring-neutral-950"
                      : "bg-white text-neutral-600 ring-neutral-200 hover:text-neutral-950 hover:ring-neutral-400"
                  )}
                >
                  <input
                    type="radio"
                    name={`${id}-topic`}
                    value={k}
                    checked={on}
                    onChange={() => setTopic(k)}
                    className="sr-only"
                  />
                  {t(`topics.${k}`)}
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className={label}>
            {t("message")}
          </label>
          <textarea
            id={`${id}-message`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder={t("messagePlaceholder")}
            aria-invalid={tried && !!errors.message}
            aria-describedby={
              tried && errors.message ? `${id}-message-error` : undefined
            }
            className={cn(field, "min-h-36 resize-y py-3 leading-relaxed")}
          />
          {error("message")}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          aria-live="polite"
          className="text-[13px] leading-relaxed text-neutral-500 sm:max-w-xs"
        >
          {sent ? (
            <span className="inline-flex items-center gap-1.5 text-neutral-800">
              <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
              {t("opening")}
            </span>
          ) : (
            t("note")
          )}
        </p>
        <button
          type="submit"
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 text-[15px] font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-1"
        >
          {t("send")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {sent && (
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-neutral-100 pt-4 text-[13px] text-neutral-500">
          {t("fallback", { email: to })}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(to).then(() => setCopied(true))
            }}
            className="inline-flex items-center gap-1 font-medium text-neutral-900"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {copied ? t("copied") : t("copy")}
          </button>
        </p>
      )}
    </motion.form>
  )
}
