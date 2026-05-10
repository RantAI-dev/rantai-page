import { getAllPosts } from "@/lib/blog"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MotionInView } from "@/components/motion-in-view"
import { BlogMain } from "@/components/blog-main"
import { Badge } from "@/components/ui/badge"

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="border-b border-border px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
          <MotionInView>
            <div className="mx-auto max-w-7xl">
              <div>
                <Badge variant="outline" className="mb-4 uppercase">
                  RantAI Blog
                </Badge>
              </div>
              <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                News &amp; Announcements
              </h1>
              <p className="mt-6 max-w-2xl font-mono leading-relaxed text-muted-foreground">
                Updates, releases, and insights from the RantAI team.
              </p>
            </div>
          </MotionInView>
        </section>

        {/* ── Blog Content ─────────────────────────────────────────── */}
        <section className="px-6 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <MotionInView transition={{ delay: 0.1 }}>
              <BlogMain posts={posts} />
            </MotionInView>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
