import { NotFoundView } from "@/components/not-found-view"
import { PillLink } from "@/components/pill-link"

export default function BlogPostNotFound() {
  return (
    <NotFoundView
      title="Article not found"
      description="This article may have been renamed, moved, or deleted."
    >
      <PillLink href="/blog" size="lg">
        Browse insights
      </PillLink>
      <PillLink href="/" size="lg" variant="outline">
        Back to home
      </PillLink>
    </NotFoundView>
  )
}
