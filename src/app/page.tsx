import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { CapabilityMarquee } from "@/app/home/_components/capability-marquee"
import { HomeHero } from "@/app/home/_components/home-hero"
import { HomeInsights } from "@/app/home/_components/home-insights"
import { HomeProblem } from "@/app/home/_components/home-problem"
import { HomeProcess } from "@/app/home/_components/home-process"
import { HomeSolution } from "@/app/home/_components/home-solution"
import { DarkPanel } from "@/components/dark-panel"
import { PlatformReel } from "@/components/platform/platform-reel"
import { SiteShell } from "@/components/site-shell"

export const metadata: Metadata = {
  title: "Enterprise AI Products & Engineering",
  description:
    "RantAI builds production-grade agentic AI, intelligent data platforms, and automation systems for government and enterprise.",
  alternates: {
    canonical: "/",
  },
}

function Announcement() {
  return (
    <Link
      href="/services#forward-deployed-engineering"
      className="group flex items-center justify-center gap-2 bg-background px-4 pt-2.5 pb-1 text-center text-[13px] text-foreground/70 transition-colors hover:text-foreground"
    >
      <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium tracking-[0.08em] text-background uppercase">
        New
      </span>
      <span>
        Forward Deployed Engineering
        <span className="hidden sm:inline">
          : RantAI engineers, embedded with your team
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="hidden size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block"
      />
    </Link>
  )
}

export default function Page() {
  return (
    <SiteShell announcement={<Announcement />}>
      <HomeHero />
      <HomeProblem />
      <HomeSolution />
      <DarkPanel
        id="platform"
        aria-labelledby="platform-heading"
        className="scroll-mt-20"
      >
        <PlatformReel />
      </DarkPanel>
      <CapabilityMarquee />
      <HomeProcess />
      <HomeInsights />
    </SiteShell>
  )
}
