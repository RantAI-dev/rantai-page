import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Eyebrow } from "@/components/eyebrow"
import { MotionInView } from "@/components/motion-in-view"

const entries = [
  {
    href: "#rantai-agents",
    name: "RantAI Agents",
    body: "Knowledge-grounded assistants for the documents, policies, and data your teams rely on.",
    logo: "/logo/RantAI Agents Light.svg",
  },
  {
    href: "#rantaiclaw",
    name: "RantAIClaw",
    body: "A lightweight runtime to run, control, and extend autonomous agents on your own infrastructure.",
    logo: "/logo/RantAIClaw Light.svg",
  },
  {
    href: "#services",
    name: "Engineering services",
    body: "Engineers who build and install AI systems inside your environment, alongside your team.",
    logo: null,
  },
] as const

export function HomeIntro() {
  return (
    <section
      aria-labelledby="intro-heading"
      className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-14 lg:py-32"
    >
      <MotionInView className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <Eyebrow className="text-neutral-500">What we do</Eyebrow>
          <h2
            id="intro-heading"
            className="mt-5 text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.98] font-medium tracking-[-0.045em] text-neutral-950"
          >
            From knowledge to action.
          </h2>
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-neutral-600 lg:justify-self-end lg:text-xl">
          RantAI builds AI agents and the infrastructure around them for
          complex, real-world environments. We turn your data, expertise, and
          workflows into systems your teams can actually use.
        </p>
      </MotionInView>

      <MotionInView className="mt-16 grid gap-3 md:grid-cols-3">
        {entries.map((entry) => (
          <Link
            key={entry.name}
            href={entry.href}
            className="group flex min-h-56 flex-col justify-between rounded-2xl bg-neutral-100 p-6 transition-colors hover:bg-neutral-200/70 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-neutral-200">
                {entry.logo ? (
                  <Image
                    src={entry.logo}
                    alt=""
                    width={48}
                    height={48}
                    className="h-6 w-auto"
                  />
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-5 text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13.5 5l-3 14" />
                  </svg>
                )}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-5 text-neutral-400 transition-[color,transform] group-hover:translate-x-1 group-hover:text-neutral-950"
              />
            </div>
            <div className="mt-10">
              <h3 className="text-xl font-medium tracking-[-0.02em] text-neutral-950">
                {entry.name}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                {entry.body}
              </p>
            </div>
          </Link>
        ))}
      </MotionInView>
    </section>
  )
}
