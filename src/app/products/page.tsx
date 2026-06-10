import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { products } from "./data"
import { ProductsHero } from "./_components/products-hero"
import { ProductsShowcase } from "./_components/products-showcase"
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

        {/* ── Live products: Agents + Claw unified showcase ─────────── */}
        <ProductsShowcase agents={agents} claw={claw} />

        {/* ── Upcoming: Analytics + ZeroCode ───────────────────────── */}
        <UpcomingSection analytics={analytics} zerocode={zerocode} />

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <ProductsCta />
      </main>

      <Footer />
    </div>
  )
}
