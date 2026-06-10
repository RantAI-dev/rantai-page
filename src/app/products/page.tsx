import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { ProductIntro } from "./_components/product-intro"
import { ProductsHero } from "./_components/products-hero"
import { ProductsRantAIAgents } from "./_components/products-rantai-agents"
import { ProductsRantAIClaw } from "./_components/products-rantai-claw"
import { ProductsRantAIAnalytics } from "./_components/products-rantai-analytics"
import { ProductsRantAIZeroCode } from "./_components/products-rantai-zerocode"
import { ProductsCta } from "./_components/products-cta"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"

export default function ProductsPage() {
  return (
    <div>
      <Navbar />

      <main className="pt-16">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <ProductsHero />

        {/* ── Intro ────────────────────────────────────────────────── */}
        <ProductIntro />

        {/* ── Live products ────────────────────────────────────────── */}
        <ProductsRantAIAgents />
        <ProductsRantAIClaw />

        {/* ── Upcoming ─────────────────────────────────────────────── */}
        <MotionInView>
          <OutlineSection className="flex flex-col sm:flex-row">
            <ProductsRantAIAnalytics />
            <ProductsRantAIZeroCode className="border-t border-border sm:border-t-0 sm:border-l" />
          </OutlineSection>
        </MotionInView>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <ProductsCta />
      </main>

      <Footer />
    </div>
  )
}
