import { asc } from "drizzle-orm"

import { db } from "@/lib/db"
import { books as booksTable } from "@/lib/db/schema"
import { MotionInView } from "@/components/motion-in-view"
import { PageHero } from "@/components/page-hero"
import { SiteShell } from "@/components/site-shell"
import { BookLibrary } from "@/features/book-library"

export const metadata = {
  title: "Academy",
  description:
    "Books, classes, and resources built for scientists and engineers.",
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
    <SiteShell
      cta={{
        title: "RantAI Academy for Enterprises",
        description:
          "Custom books for scientists and engineers — with ready-to-use GenAI prompts, real use cases, and proven code.",
        label: "Contact us",
        subject: "RantAI Academy for Enterprises",
        prompts: [
          "Train our engineers to build with GenAI",
          "A custom book for our data science team",
          "Hands-on prompt engineering for our analysts",
        ],
      }}
    >
      <PageHero
        eyebrow="Academy"
        title="Learn to build with AI."
        description="Books, classes, and resources built for scientists and engineers."
      />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32">
        <MotionInView className="border-t border-border pt-12">
          <BookLibrary books={books} />
        </MotionInView>
      </section>
    </SiteShell>
  )
}
