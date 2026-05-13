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

        {/* Italic subtitle */}
        <MotionInView>
          <OutlineSection className="flex items-center justify-center px-6 py-24">
            <h2 className="text-2xl tracking-tight italic sm:text-3xl lg:text-4xl">
              The people building the future of enterprise AI.
            </h2>
          </OutlineSection>
        </MotionInView>

        {/* Members grid */}
        <MotionInView>
          <OutlineSection className="px-8 py-8">
            <OurTeamGrid members={members} />
          </OutlineSection>
        </MotionInView>
      </main>

      <Footer />
    </div>
  )
}
