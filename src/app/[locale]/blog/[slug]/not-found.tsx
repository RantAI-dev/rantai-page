import { getTranslations } from "next-intl/server"

import { NotFoundView } from "@/components/shared/not-found-view"
import { PillLink } from "@/components/shared/pill-link"

export default async function BlogPostNotFound() {
  const t = await getTranslations("blog.notFound")
  return (
    <NotFoundView title={t("title")} description={t("description")}>
      <PillLink href="/blog" size="lg">
        {t("browse")}
      </PillLink>
      <PillLink href="/" size="lg" variant="outline">
        {t("home")}
      </PillLink>
    </NotFoundView>
  )
}
