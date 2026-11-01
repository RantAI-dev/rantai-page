import { NotFoundView } from "@/components/shared/not-found-view"
import { PillLink } from "@/components/shared/pill-link"

export default function NotFound() {
  return (
    <NotFoundView
      title={"This page took\na wrong turn."}
      description="The link may be old, or the page has moved. These are the places people usually look for."
    >
      <PillLink href="/" size="lg">
        Back to home
      </PillLink>
      <PillLink href="/blog" size="lg" variant="outline">
        Browse insights
      </PillLink>
    </NotFoundView>
  )
}
