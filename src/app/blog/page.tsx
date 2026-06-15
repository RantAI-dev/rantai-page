import { db } from "@/lib/db"
import { tags } from "@/lib/db/schema"
import { getAllPosts } from "@/lib/blog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { BlogMain } from "@/components/blog-main"
import { BlogHero } from "./_components/blog-hero"

export const metadata = {
  title: "Blog",
  description: "Updates, releases, and insights from the RantAI team.",
}

export default async function BlogPage() {
  const [posts, tagRows] = await Promise.all([
    getAllPosts(),
    db.select({ name: tags.name, color: tags.color }).from(tags),
  ])

  const tagColors = Object.fromEntries(tagRows.map((t) => [t.name, t.color]))

  return (
    <div>
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <BlogHero />

        {/* Posts */}
        <MotionInView>
          <OutlineSection className="p-8">
            <BlogMain posts={posts} tagColors={tagColors} />
          </OutlineSection>
        </MotionInView>
      </main>

      <Footer />
    </div>
  )
}
