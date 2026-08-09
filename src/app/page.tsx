import type { Metadata } from "next"

import { HomeLanding } from "@/app/home/_components/home-landing"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"
import { StatsSection } from "@/components/stats-section"
import { StickyScrollSections } from "@/components/sticky-scroll-sections"
import { TeamSection } from "@/components/team-section"

export const metadata: Metadata = {
  title: "Enterprise AI Products & Engineering",
  description:
    "RantAI builds production-grade agentic AI, intelligent data platforms, and automation systems for government and enterprise.",
  alternates: {
    canonical: "/",
  },
}

export default function Page() {
  return (
    <div className="bg-background">
      <main>
        <HomeLanding />
        <StatsSection />
        <StickyScrollSections />
        <TeamSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  )
}
