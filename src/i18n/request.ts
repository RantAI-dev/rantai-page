import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"

import { routing } from "./routing"

// Messages are split by area: src/messages/<locale>/<namespace>.json.
// Each file becomes a top-level namespace, e.g. common.json -> t("common.x").
const namespaces = [
  "common",
  "metadata",
  "home",
  "platform",
  "products",
  "services",
  "academy",
  "blog",
  "company",
  "notFound",
] as const

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const entries = await Promise.all(
    namespaces.map(async (ns) => [
      ns,
      (await import(`../messages/${locale}/${ns}.json`)).default,
    ])
  )

  return { locale, messages: Object.fromEntries(entries) }
})
