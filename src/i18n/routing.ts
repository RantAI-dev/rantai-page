import { defineRouting } from "next-intl/routing"

// English lives at the root (/products), Indonesian under /id (/id/products).
// No automatic redirect by browser language: Indonesian visitors are offered
// the switch instead (see components/layout/language-suggestion).
export const routing = defineRouting({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]
