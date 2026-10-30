import { asc } from "drizzle-orm"

import { db } from "@/lib/db"
import { teamMembers } from "@/lib/db/schema"
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
        eyebrow="Company"
        title="The people behind RantAI."
        description="Engineers, researchers, and builders dedicated to advancing enterprise AI."
      />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32">
        <MotionInView className="border-t border-border pt-12">
          <OurTeamGrid members={members} />
        </MotionInView>
      </section>
    </SiteShell>
  )
}
