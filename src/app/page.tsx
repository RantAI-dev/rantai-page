import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { HomeHero } from "@/app/home/_components/home-hero"
import { HomeInsights } from "@/app/home/_components/home-insights"
import { HomeIntro } from "@/app/home/_components/home-intro"
import { ProductShowcase } from "@/components/product-showcase"
import { ServicesOverview } from "@/components/services-overview"
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
      <span className="rounded-full bg-foreground px-2 py-0.5 font-label text-[10px] tracking-[0.14em] text-background uppercase">
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
      <HomeIntro />
      <ProductShowcase />
      <ServicesOverview />
      <HomeInsights />
    </SiteShell>
  )
}
