import { routing, type Locale } from "./routing"

/** A path in a given language: English at the root, Indonesian under /id. */
export function localizedPath(locale: Locale, path: string) {
  if (locale === routing.defaultLocale) return path
  return `/${locale}${path === "/" ? "" : path}`
}

/** hreflang links: the page in every language, English as the default. */
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(
      routing.locales.map((l) => [l, localizedPath(l, path)])
    ),
    "x-default": localizedPath(routing.defaultLocale, path),
  }
}
