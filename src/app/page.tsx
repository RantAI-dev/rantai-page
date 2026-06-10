import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { StickyScrollSections } from "@/components/sticky-scroll-sections"
import { PartnersSection } from "@/components/partners-section"
import { TeamSection } from "@/components/team-section"
import { NewsSection } from "@/components/news-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Company Stats (3 Platforms, 100+ LLMs, 10 Books) */}
        <StatsSection />

        {/* Sticky Scroll Flow (Vision, Platforms, Why) */}
        <StickyScrollSections />

        {/* Partners */}
        <PartnersSection />

        {/* Team */}
        <TeamSection />

        {/* News */}
        <NewsSection />
      </main>

      <Footer />
    </div>
  )
}
