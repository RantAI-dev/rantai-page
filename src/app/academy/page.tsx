import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { asc } from "drizzle-orm"

import { db } from "@/lib/db"
import { books as booksTable } from "@/lib/db/schema"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { BookLibrary } from "@/features/book-library"
import { AcademyHero } from "./_components/academy-hero"

export const metadata = {
  title: "Academy",
  description:
    "Books, classes, and resources built for scientists and engineers.",
}

function GridPattern() {
  const size = 32
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-10"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="grid-academy"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-academy)" />
    </svg>
  )
}

export default async function AcademyPage() {
  const booksFromDb = await db
    .select()
    .from(booksTable)
    .orderBy(asc(booksTable.orderIndex))

  const books = booksFromDb.map((b) => ({
    code: b.code,
    name: b.name,
    category: b.category,
    imageUrl: b.imageUrl,
    url: b.url ?? undefined,
  }))

  return (
    <div>
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <AcademyHero />

        {/* Book library */}
        <MotionInView>
          <OutlineSection className="p-8">
            <BookLibrary books={books} />
          </OutlineSection>
        </MotionInView>

        {/* CTA */}
        <MotionInView>
          <OutlineSection>
            <div className="relative flex items-center justify-center overflow-hidden px-6 py-24 lg:min-h-[500px] lg:py-0">
              <GridPattern />
              <div className="relative z-10 flex max-w-[892px] flex-col items-center gap-6 text-center">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl lg:text-[32px]">
                    RantAI Academy for Enterprises
                  </h2>
                  <p className="text-sm text-white/60 lg:text-base">
                    Custom books for scientists and engineers — with
                    ready-to-use GenAI prompts, real use cases, and proven code.
                  </p>
                </div>
                <Link
                  href="/#contact"
                  className="group flex items-center justify-between border bg-foreground px-4 py-4 text-background transition-colors duration-300"
                >
                  <span className="font-mono font-medium tracking-wider uppercase">
                    Contact Us
                  </span>
                  <ArrowRightIcon className="ml-3 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </OutlineSection>
        </MotionInView>
      </main>

      <Footer />
    </div>
  )
}
