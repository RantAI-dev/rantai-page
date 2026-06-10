import { asc } from "drizzle-orm"

import { db } from "@/lib/db"
import { teamMembers } from "@/lib/db/schema"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { OurTeamHero } from "./_components/hero"
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
    <div>
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <OurTeamHero />

        {/* Members grid */}
        <MotionInView>
          <OutlineSection className="p-8">
            <OurTeamGrid members={members} />
          </OutlineSection>
        </MotionInView>
      </main>

      <Footer />
    </div>
  )
}
