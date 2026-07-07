import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { ProductIntro } from "./_components/product-intro"
import { ProductsHero } from "./_components/products-hero"
import { ProductsRantAIAgents } from "./_components/products-rantai-agents"
import { ProductsRantAIClaw } from "./_components/products-rantai-claw"
import { ProductsRantAILake } from "./_components/products-rantai-lake"
import { ProductsRantAILLMOps } from "./_components/products-rantai-llmops"
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
            <ProductsRantAILLMOps />
            <ProductsRantAILake className="border-t border-border sm:border-t-0 sm:border-l" />
          </OutlineSection>
        </MotionInView>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <ProductsCta />
      </main>

      <Footer />
    </div>
  )
}
