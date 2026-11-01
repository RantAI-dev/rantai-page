import { describe, expect, it } from "vitest"

import { languageAlternates, localizedPath } from "@/i18n/paths"

describe("localizedPath", () => {
  it("keeps English at the root", () => {
    expect(localizedPath("en", "/")).toBe("/")
    expect(localizedPath("en", "/products")).toBe("/products")
  })

  it("puts Indonesian under /id", () => {
    expect(localizedPath("id", "/")).toBe("/id")
    expect(localizedPath("id", "/blog/a-post")).toBe("/id/blog/a-post")
  })
})

describe("languageAlternates", () => {
  it("lists every language with English as x-default", () => {
    expect(languageAlternates("/services")).toEqual({
      en: "/services",
      id: "/id/services",
      "x-default": "/services",
    })
  })
})
