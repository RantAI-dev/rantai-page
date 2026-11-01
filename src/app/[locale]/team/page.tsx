import { permanentRedirect } from "@/i18n/navigation"

// The old /team URL (and /id/team) moved to /our-team.
export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  permanentRedirect({ href: "/our-team", locale })
}
