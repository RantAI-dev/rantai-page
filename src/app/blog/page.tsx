import { db } from "@/lib/db"
import { tags } from "@/lib/db/schema"
import { getPosts, getPostTags } from "@/lib/blog/posts"
import { BlogMain } from "./_components/blog-main"
import { PostsVisual } from "@/components/shared/hero-visuals"
import { MotionInView } from "@/components/shared/motion-in-view"
import { PageHero } from "@/components/shared/page-hero"
import { SectionNav } from "@/components/layout/section-nav"
import { SiteShell } from "@/components/layout/site-shell"

import { pageMetadata } from "@/lib/seo"
export const metadata = pageMetadata({
  title: "Insights",
  description:
    "Updates, releases, and insights on building AI that works in production.",
  path: "/blog",
})

export default async function BlogPage() {
  const [firstPage, tagRows, postTags] = await Promise.all([
    getPosts(),
    db.select({ name: tags.name, color: tags.color }).from(tags),
    getPostTags(),
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
            tags={postTags}
          />
        </MotionInView>
      </section>
      <SectionNav sections={[{ id: "posts", label: "Posts" }]} />
    </SiteShell>
  )
}
