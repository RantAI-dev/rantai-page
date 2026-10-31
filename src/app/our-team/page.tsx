import { asc } from "drizzle-orm"

import { db } from "@/lib/db"
import { teamMembers } from "@/lib/db/schema"
import { PeopleVisual } from "@/components/hero-visuals"
import { MotionInView } from "@/components/motion-in-view"
import { PageHero } from "@/components/page-hero"
import { SiteShell } from "@/components/site-shell"
import { OurTeamGrid } from "./_components/team-grid"

export const metadata = {
  title: "Our Team",
  description: "Meet the people behind RantAI.",
}

export default async function OurTeamPage() {
  const members = await db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.orderIndex))

  return (
    <SiteShell>
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
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32">
        <MotionInView className="pt-16 lg:pt-20">
          <OurTeamGrid members={members} />
        </MotionInView>
      </section>
    </SiteShell>
  )
}
