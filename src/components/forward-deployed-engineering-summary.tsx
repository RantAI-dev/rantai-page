import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { OutlineSection } from "@/components/outline-section"

export function ForwardDeployedEngineeringSummary() {
  return (
    <section aria-labelledby="fde-summary-heading">
      <OutlineSection className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-16">
        <div className="max-w-2xl">
          <p className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
            Engineering services
          </p>
          <h2
            id="fde-summary-heading"
            className="mt-3 text-2xl font-normal tracking-tight sm:text-3xl lg:text-4xl"
          >
            Forward Deployed Engineering
          </h2>
          <p className="mt-4 text-base leading-relaxed font-light text-muted-foreground">
            RantAI engineers work alongside your team to build and install AI
            solutions in your environment, shaped around your workflows and
            requirements.
          </p>
        </div>
        <Link
          href="/services#forward-deployed-engineering"
          className="group inline-flex w-fit shrink-0 items-center gap-4 border bg-foreground px-4 py-4 text-background transition-colors hover:bg-foreground/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span className="font-mono text-sm font-medium tracking-wider uppercase">
            Explore the service
          </span>
          <ArrowRightIcon
            aria-hidden="true"
            className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
          />
        </Link>
      </OutlineSection>
    </section>
  )
}
