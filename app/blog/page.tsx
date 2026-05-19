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
  const posts = await getAllPosts()

  return (
    <div>
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <BlogHero />

        {/* Posts */}
        <MotionInView>
          <OutlineSection className="p-8">
            <BlogMain posts={posts} />
          </OutlineSection>
        </MotionInView>
      </main>

      <Footer />
    </div>
  )
}
