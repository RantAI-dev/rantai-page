import { db } from "@/lib/db"
import { tags } from "@/lib/db/schema"
import { getPosts } from "@/lib/blog"
import { BlogMain } from "@/components/blog-main"
import { MotionInView } from "@/components/motion-in-view"
import { PageHero } from "@/components/page-hero"
import { SiteShell } from "@/components/site-shell"

export const metadata = {
  title: "Blog",
  description: "Updates, releases, and insights from the RantAI team.",
}

export default async function BlogPage() {
  const [firstPage, tagRows] = await Promise.all([
    getPosts(),
    db.select({ name: tags.name, color: tags.color }).from(tags),
  ])

  const tagColors = Object.fromEntries(tagRows.map((t) => [t.name, t.color]))

  return (
    <SiteShell>
      <PageHero
        eyebrow="Insights"
        title="Notes from the RantAI team."
        description="Updates, releases, and insights on building AI that works in production."
      />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32">
        <MotionInView className="border-t border-border pt-12">
          <BlogMain
            initialPosts={firstPage.posts}
            initialCursor={firstPage.nextCursor}
            tagColors={tagColors}
          />
        </MotionInView>
      </section>
    </SiteShell>
  )
}
