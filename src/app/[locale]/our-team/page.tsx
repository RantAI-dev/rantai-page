import { getTranslations, setRequestLocale } from "next-intl/server"
import { asc } from "drizzle-orm"

import { pageMetadata } from "@/lib/seo"
import type { Locale } from "@/i18n/routing"
import { db } from "@/lib/db"
import { books, teamMembers } from "@/lib/db/schema"
import { PeopleVisual } from "@/components/shared/hero-visuals"
import { PageHero } from "@/components/shared/page-hero"
import { SectionNav } from "@/components/layout/section-nav"
import { SiteShell } from "@/components/layout/site-shell"
import { partners } from "@/lib/partners"
import { AboutSection } from "./_components/about-section"
import { OurTeamGrid } from "./_components/team-grid"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return pageMetadata({
    locale: locale as Locale,
    page: "company",
    path: "/our-team",
  })
}

export default async function OurTeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("company")
  const [members, bookRows] = await Promise.all([
    db.select().from(teamMembers).orderBy(asc(teamMembers.orderIndex)),
    db
      .select({ imageUrl: books.imageUrl })
      .from(books)
      .orderBy(asc(books.orderIndex)),
  ])
  const photos = members.flatMap((m) => (m.imageUrl ? [m.imageUrl] : []))

  return (
    <SiteShell
      cta={{
        title: t("cta.title"),
        description: t("cta.description"),
        label: t("cta.label"),
        subject: t("cta.subject"),
      }}
    >
      <PageHero
        tone="white"
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
        visual={
          <PeopleVisual
            people={members.flatMap((m) =>
              m.imageUrl
                ? [{ photo: m.imageUrl, name: m.name, role: m.role }]
                : []
            )}
          />
        }
      />
      <AboutSection
        people={members.length}
        photos={photos}
        bookCount={bookRows.length}
        covers={bookRows.flatMap((b) => (b.imageUrl ? [b.imageUrl] : []))}
        partnerLogos={partners.map((p) => p.logo)}
      />
      <section
        id="team"
        aria-labelledby="team-heading"
        className="mx-auto max-w-[1440px] scroll-mt-20 px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32"
      >
        <OurTeamGrid members={members} />
      </section>
      <SectionNav
        sections={[
          { id: "who-we-are", label: t("sections.whoWeAre") },
          { id: "team", label: t("sections.team") },
        ]}
      />
    </SiteShell>
  )
}
