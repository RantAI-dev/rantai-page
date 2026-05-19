import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { products } from "./data"
import { ProductsHero } from "./_components/products-hero"
import { AgentsSection } from "./_components/agents-section"
import { ClawSection } from "./_components/claw-section"
import { UpcomingSection } from "./_components/upcoming-section"
import { ProductsCta } from "./_components/products-cta"

export default function ProductsPage() {
  const [agents, claw, analytics, zerocode] = products

  return (
    <div>
      <Navbar />

      <main className="pt-16">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <ProductsHero />

        {/* ── RantAI Agents ────────────────────────────────────────── */}
        <AgentsSection product={agents} />

        {/* ── RantAI Claw ──────────────────────────────────────────── */}
        <ClawSection product={claw} />

        {/* ── Upcoming: Analytics + ZeroCode ───────────────────────── */}
        <UpcomingSection analytics={analytics} zerocode={zerocode} />

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <ProductsCta />
      </main>

      <Footer />
    </div>
  )
}
