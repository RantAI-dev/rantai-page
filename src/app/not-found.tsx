import { NotFoundView } from "@/components/not-found-view"
import { PillLink } from "@/components/pill-link"

export default function NotFound() {
  return (
    <NotFoundView
      title="Page not found"
      description="The page you are looking for does not exist or has been moved."
    >
      <PillLink href="/" size="lg">
        Back to home
      </PillLink>
    </NotFoundView>
  )
}
