import { Eyebrow } from "@/components/eyebrow"
import { SplitReveal } from "@/components/split-reveal"
import { MotionInView } from "@/components/motion-in-view"
import { PillLink } from "@/components/pill-link"
import { FeaturedPostCard, PostCard } from "@/components/post-cards"
import { getPosts } from "@/lib/blog"

export async function HomeInsights() {
  const { posts } = await getPosts({ limit: 5 })

  if (posts.length === 0) return null

  const [featured, ...rest] = posts

  return (
    <section
      id="insights"
      aria-labelledby="insights-heading"
      className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32"
    >
      <MotionInView className="flex flex-col gap-6 border-t border-border pt-16 sm:flex-row sm:items-end sm:justify-between lg:pt-24">
        <div>
          <Eyebrow className="text-muted-foreground">Insights</Eyebrow>
          <SplitReveal
            id="insights-heading"
            text="The latest from RantAI."
            className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em]"
          />
        </div>
        <PillLink href="/blog" variant="outline">
          View all insights
        </PillLink>
      </MotionInView>

      <MotionInView className="mt-12 grid gap-x-3 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        <FeaturedPostCard
          post={featured}
          className="lg:col-span-2 lg:row-span-2"
        />
        {rest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </MotionInView>
    </section>
  )
}
