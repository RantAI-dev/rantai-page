import { asc } from "drizzle-orm"

import { db } from "@/lib/db"
import { books as booksTable } from "@/lib/db/schema"
import { BooksVisual } from "@/components/shared/hero-visuals"
import { MotionInView } from "@/components/shared/motion-in-view"
import { PageHero } from "@/components/shared/page-hero"
import { SectionNav } from "@/components/layout/section-nav"
import { ForTeams } from "./_components/for-teams"
import { SiteShell } from "@/components/layout/site-shell"
import { BookLibrary } from "./_components/book-library"

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
        tone="violet"
        eyebrow="Academy"
        title={"Learn to build\nwith AI."}
        description="Books, classes, and hands-on resources built for scientists and engineers."
        visual={
          <BooksVisual
            books={books.map((b) => ({ cover: b.imageUrl, name: b.name }))}
          />
        }
      />
      <section
        id="library"
        className="mx-auto max-w-[1440px] scroll-mt-20 px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32"
      >
        <MotionInView className="pt-16 lg:pt-20">
          <BookLibrary books={books} />
        </MotionInView>
      </section>
      <ForTeams />
      <SectionNav
        sections={[
          { id: "library", label: "Library" },
          { id: "for-teams", label: "For teams" },
        ]}
      />
    </SiteShell>
  )
}
