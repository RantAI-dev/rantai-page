import { getTranslations, setRequestLocale } from "next-intl/server"
import { asc } from "drizzle-orm"

import { pageMetadata } from "@/lib/seo"
import type { Locale } from "@/i18n/routing"
import { db } from "@/lib/db"
import { books as booksTable } from "@/lib/db/schema"
import { BooksVisual } from "@/components/shared/hero-visuals"
import { MotionInView } from "@/components/shared/motion-in-view"
import { PageHero } from "@/components/shared/page-hero"
import { SectionNav } from "@/components/layout/section-nav"
import { ForTeams } from "./_components/for-teams"
import { SiteShell } from "@/components/layout/site-shell"
import { BookLibrary } from "./_components/book-library"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return pageMetadata({
    locale: locale as Locale,
    page: "academy",
    path: "/academy",
  })
}

export default async function AcademyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("academy")
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
        title: t("cta.title"),
        description: t("cta.description"),
        label: t("cta.label"),
        subject: t("cta.subject"),
        prompts: t.raw("cta.prompts") as string[],
      }}
    >
      <PageHero
        tone="violet"
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
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
          { id: "library", label: t("sections.library") },
          { id: "for-teams", label: t("sections.forTeams") },
        ]}
      />
    </SiteShell>
  )
}
