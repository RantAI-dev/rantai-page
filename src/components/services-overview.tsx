import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { aiEngineering, softwareEngineering } from "@/app/services/data"
import { Eyebrow } from "@/components/eyebrow"
import { SplitReveal } from "@/components/split-reveal"
import { MotionInView } from "@/components/motion-in-view"

const practices = [
  { label: "Software Engineering", ...softwareEngineering },
  { label: "AI Engineering", ...aiEngineering },
]

export function ServicesOverview() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto max-w-[1440px] scroll-mt-20 px-5 py-24 sm:px-10 lg:px-14 lg:py-32"
    >
      <MotionInView className="max-w-3xl">
        <Eyebrow className="text-neutral-500">Engineering services</Eyebrow>
        <SplitReveal
          id="services-heading"
          text="Products when they fit. Engineers when you need more."
          className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance text-neutral-950"
        />
      </MotionInView>

      <MotionInView className="mt-14 grid gap-3 lg:grid-cols-[1.25fr_1fr_1fr]">
        <Link
          href="/services#forward-deployed-engineering"
          className="group relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl bg-neutral-950 p-7 text-white sm:p-9"
        >
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 size-72 rounded-full bg-brand-1/30 blur-[90px] transition-opacity duration-500 group-hover:opacity-70"
          />
          <div className="relative flex items-center justify-between">
            <span className="rounded-full bg-brand-1 px-2.5 py-1 text-[11px] font-medium tracking-[0.08em] text-neutral-950 uppercase">
              New
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-5 text-white/50 transition-[color,transform] group-hover:translate-x-1 group-hover:text-white"
            />
          </div>
          <div className="relative">
            <h3 className="text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
              Forward Deployed Engineering
            </h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
              RantAI engineers work alongside your team to build and install AI
              solutions in your environment, shaped around your workflows and
              requirements.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
              Explore the service
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {practices.map((practice) => (
          <Link
            key={practice.label}
            href="/services"
            className="group flex flex-col justify-between rounded-2xl bg-neutral-100 p-7 transition-colors hover:bg-neutral-200/70 sm:p-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-[0.08em] text-neutral-500 uppercase">
                {practice.label}
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-5 text-neutral-400 transition-[color,transform] group-hover:translate-x-1 group-hover:text-neutral-950"
              />
            </div>
            <div className="mt-16">
              <h3 className="text-2xl font-medium tracking-[-0.03em] text-neutral-950">
                {practice.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                {practice.description}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-neutral-200 pt-5">
                {practice.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm text-neutral-700">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-1" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </MotionInView>
    </section>
  )
}
