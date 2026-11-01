import { getTranslations } from "next-intl/server"

import { NotFoundView } from "@/components/shared/not-found-view"
import { PillLink } from "@/components/shared/pill-link"

export default async function NotFound() {
  const t = await getTranslations("notFound")
  return (
    <NotFoundView title={t("title")} description={t("description")}>
      <PillLink href="/" size="lg">
        {t("home")}
      </PillLink>
      <PillLink href="/blog" size="lg" variant="outline">
        {t("browse")}
      </PillLink>
    </NotFoundView>
  )
}
