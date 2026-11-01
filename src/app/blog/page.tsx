import { db } from "@/lib/db"
import { tags } from "@/lib/db/schema"
import { getPosts } from "@/lib/blog"
import { BlogMain } from "@/components/blog-main"
import { PostsVisual } from "@/components/hero-visuals"
import { MotionInView } from "@/components/motion-in-view"
import { PageHero } from "@/components/page-hero"
import { SectionNav } from "@/components/section-nav"
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
        tone="teal"
        eyebrow="Insights"
        title={"Notes from the\nRantAI team."}
        description="Updates, releases, and insights on building AI that works in production."
        visual={<PostsVisual posts={firstPage.posts} />}
      />
      <section
        id="posts"
        className="mx-auto max-w-[1440px] scroll-mt-20 px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32"
      >
        <MotionInView className="pt-16 lg:pt-20">
          <BlogMain
            initialPosts={firstPage.posts}
            initialCursor={firstPage.nextCursor}
            tagColors={tagColors}
          />
        </MotionInView>
      </section>
      <SectionNav sections={[{ id: "posts", label: "Posts" }]} />
    </SiteShell>
  )
}
