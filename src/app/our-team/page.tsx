import { asc } from "drizzle-orm"

import { db } from "@/lib/db"
import { books, teamMembers } from "@/lib/db/schema"
import { PeopleVisual } from "@/components/shared/hero-visuals"
import { PageHero } from "@/components/shared/page-hero"
import { SectionNav } from "@/components/layout/section-nav"
import { SiteShell } from "@/components/layout/site-shell"
import { partners } from "@/lib/partners"
import { AboutSection } from "./_components/about-section"
import { OurTeamGrid } from "./_components/team-grid"

export const metadata = {
  title: "Our Team",
  description: "Meet the people behind RantAI.",
}

export default async function OurTeamPage() {
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
        title: "Build with us.",
        description:
          "We're always glad to meet engineers, researchers, and writers who like to ship.",
        label: "Join the team",
        subject: "Joining RantAI",
      }}
    >
      <PageHero
        tone="white"
        eyebrow="Company"
        title={"The people\nbehind RantAI."}
        description="Engineers, researchers, and builders dedicated to advancing enterprise AI."
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
          { id: "who-we-are", label: "Who we are" },
          { id: "team", label: "Team" },
        ]}
      />
    </SiteShell>
  )
}
