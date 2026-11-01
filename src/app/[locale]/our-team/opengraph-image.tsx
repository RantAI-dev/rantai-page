import { getTranslations } from "next-intl/server"

import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt = "The RantAI team"
export const size = ogSize
export const contentType = ogContentType

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.og.company" })
  return renderOgImage({
    eyebrow: t("eyebrow"),
    title: t("title"),
    tone: "#57534e",
    tint: "#f4f3ee",
  })
}
