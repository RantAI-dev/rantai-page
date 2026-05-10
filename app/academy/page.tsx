import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookLibrary } from "@/features/book-library"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MotionInView } from "@/components/motion-in-view"
import { db } from "@/lib/db"
import { books as booksTable } from "@/lib/db/schema"
import { asc } from "drizzle-orm"

export default async function AcademyPage() {
  const booksFromDb = await db.select().from(booksTable).orderBy(asc(booksTable.orderIndex))
  const books = booksFromDb.map((b) => ({
    code: b.code,
    name: b.name,
    category: b.category,
    imageUrl: b.imageUrl,
    url: b.url ?? undefined,
  }))

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="border-b border-border px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
          <MotionInView>
            <div className="mx-auto max-w-7xl">
              <Badge variant="outline" className="mb-4 uppercase">
                Book Publisher &amp; Classes
              </Badge>
              <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Explore Our Book Library.
              </h1>
              <p className="mt-6 max-w-2xl font-mono leading-relaxed text-muted-foreground">
                Browse our complete collection of technical books on Rust, AI, and
                Scientific Programming — published by RantAI.
              </p>
            </div>
          </MotionInView>
        </section>

        {/* ── Publications / Library ─────────────────────────────────── */}
        <section
          id="publications"
          className="border-b border-border px-6 py-16 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <MotionInView transition={{ delay: 0.1 }}>
              <BookLibrary books={books} />
            </MotionInView>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────── */}
        <section className="px-6 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <div className="flex flex-col items-center gap-5 text-center">
                <h2 className="max-w-lg text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  RantAI Academy for Enterprises
                </h2>
                <p className="max-w-md font-mono text-sm leading-relaxed text-muted-foreground">
                  Custom books for scientists and engineers with ready-to-use
                  GenAI prompts, real use cases, and proven code.
                </p>
                <Button size="lg" asChild>
                  <Link href="/#contact">
                    Contact Us
                    <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </MotionInView>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
