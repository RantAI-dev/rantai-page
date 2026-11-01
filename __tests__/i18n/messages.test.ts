import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { routing } from "@/i18n/routing"

// Every language must have the same message files and the same keys, so a
// page never shows a missing-translation key in one language.

const dir = join(process.cwd(), "src/messages")

function keys(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => keys(v, `${prefix}[${i}]`))
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      keys(v, prefix ? `${prefix}.${k}` : k)
    )
  }
  return [prefix]
}

// Paths whose shape may differ per language on purpose. home.json's
// solution.tokens is the "How RantAI helps" sentence split into words, each
// with its own icon/highlight flags; Indonesian word order differs.
const languageSpecific = ["solution.tokens"]
const shared = (k: string) => !languageSpecific.some((p) => k.startsWith(p))

const read = (locale: string, file: string) =>
  JSON.parse(readFileSync(join(dir, locale, file), "utf8"))

describe("messages", () => {
  const files = readdirSync(join(dir, routing.defaultLocale)).sort()

  it("every language has the same namespaces", () => {
    for (const locale of routing.locales) {
      expect(readdirSync(join(dir, locale)).sort()).toEqual(files)
    }
  })

  for (const file of files) {
    it(`${file} has the same keys in every language`, () => {
      const base = keys(read(routing.defaultLocale, file)).filter(shared).sort()
      for (const locale of routing.locales) {
        expect(keys(read(locale, file)).filter(shared).sort()).toEqual(base)
      }
    })

    it(`${file} has no empty strings`, () => {
      for (const locale of routing.locales) {
        const empty: string[] = []
        const walk = (v: unknown, p: string) => {
          if (typeof v === "string") {
            if (!v.trim()) empty.push(p)
          } else if (v && typeof v === "object") {
            for (const [k, c] of Object.entries(v)) walk(c, `${p}.${k}`)
          }
        }
        walk(read(locale, file), locale)
        expect(empty).toEqual([])
      }
    })
  }
})
