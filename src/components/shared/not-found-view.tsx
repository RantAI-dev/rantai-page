"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import {
  ArrowRight,
  Boxes,
  BookOpen,
  Newspaper,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import { SiteShell } from "@/components/layout/site-shell"
import { Eyebrow } from "@/components/shared/eyebrow"

const destinations: {
  href: string
  label: string
  line: string
  icon: LucideIcon
  tone: string
}[] = [
  {
    href: "/products",
    label: "Products",
    line: "Agents, Claw, LLMOps, Lakehouse",
    icon: Boxes,
    tone: "#3b82f6",
  },
  {
    href: "/services",
    label: "Services",
    line: "Engineering, from scope to production",
    icon: Wrench,
    tone: "#f97316",
  },
  {
    href: "/academy",
    label: "Academy",
    line: "Books and classes on building with AI",
    icon: BookOpen,
    tone: "#8b5cf6",
  },
  {
    href: "/blog",
    label: "Insights",
    line: "Notes from the RantAI team",
    icon: Newspaper,
    tone: "#14b8a6",
  },
  {
    href: "/our-team",
    label: "Company",
    line: "The people behind RantAI",
    icon: Users,
    tone: "#57534e",
  },
]

const noop = () => () => {}

/** The request that missed, shown like a log line. */
function MissedRequest() {
  // Read in the browser only: the 404 page is rendered ahead of time, when
  // the missing path isn't known yet (a server value would not match).
  const path = useSyncExternalStore(
    noop,
    () => window.location.pathname,
    () => ""
  )
  return (
    <div className="flex items-center gap-2.5 border-b border-neutral-100 px-4 py-3 [font-family:ui-monospace,SFMono-Regular,Menlo,monospace] text-[12.5px]">
      <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-medium text-neutral-600">
        GET
      </span>
      <span className="min-w-0 flex-1 truncate text-neutral-800">{path}</span>
      <span className="rounded-md bg-rose-50 px-1.5 py-0.5 font-medium text-rose-700">
        404
      </span>
    </div>
  )
}

/**
 * Not found: the message on the left; on the right, the request that missed
 * and the places people usually mean to go.
 */
export function NotFoundView({
  title,
  description,
  children,
}: Readonly<{
  title: string
  description: string
  /** Buttons under the message. */
  children: React.ReactNode
}>) {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pt-10 pb-24 sm:px-10 sm:pt-14 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:pt-16 lg:pb-32">
        <div>
          <Eyebrow className="text-muted-foreground">Error 404</Eyebrow>
          <h1 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] whitespace-pre-line text-neutral-950">
            {title}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-500">
            {description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">{children}</div>
        </div>

        <div
          className="flex items-center justify-center rounded-[28px] p-6 sm:p-10"
          style={{
            backgroundColor: "#f4f3ee",
            backgroundImage:
              "radial-gradient(#d9d6cb 1.2px, transparent 1.4px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.05]">
            <MissedRequest />
            <p className="px-4 pt-4 pb-2 text-[12px] font-medium tracking-[0.08em] text-neutral-500 uppercase">
              Try one of these
            </p>
            <ul className="px-2 pb-2">
              {destinations.map(({ href, label, line, icon: Icon, tone }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-neutral-50"
                  >
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-lg"
                      style={{ background: `${tone}14`, color: tone }}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium text-neutral-950">
                        {label}
                      </span>
                      <span className="block truncate text-[13px] text-neutral-500">
                        {line}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-950" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
