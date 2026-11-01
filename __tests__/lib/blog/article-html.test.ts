import { describe, expect, it } from "vitest"

import {
  languageLabel,
  prepareArticle,
  slugifyHeading,
} from "@/lib/blog/article-html"

describe("slugifyHeading", () => {
  it("makes url-safe ids", () => {
    expect(slugifyHeading("Practical Applications & Strategic Takeaways")).toBe(
      "practical-applications-strategic-takeaways"
    )
    expect(slugifyHeading("Café ¿qué?")).toBe("cafe-que")
    expect(slugifyHeading("!!!")).toBe("section")
  })
})

describe("prepareArticle", () => {
  it("drops the leading h1 only", () => {
    const { html } = prepareArticle("<h1>Title</h1><p>a</p><h1>Later</h1>")
    expect(html).toBe("<p>a</p><h1>Later</h1>")
  })

  it("adds ids to h2/h3 and lists them", () => {
    const { html, headings } = prepareArticle(
      "<h2>What <code>move</code> does</h2><p>x</p><h3>Why &amp; how</h3>"
    )
    expect(html).toContain('<h2 id="what-move-does">')
    expect(html).toContain('<h3 id="why-how">')
    expect(html).toContain('href="#why-how" class="heading-anchor"')
    expect(headings).toEqual([
      { id: "what-move-does", text: "What move does", level: 2 },
      { id: "why-how", text: "Why & how", level: 3 },
    ])
  })

  it("keeps existing ids and de-duplicates new ones", () => {
    const { headings } = prepareArticle(
      '<h2 id="keep">A</h2><h2>Notes</h2><h2>Notes</h2>'
    )
    expect(headings.map((h) => h.id)).toEqual(["keep", "notes", "notes-2"])
  })

  it("skips empty headings", () => {
    const { headings } = prepareArticle("<h2> </h2><h2>Real</h2>")
    expect(headings).toHaveLength(1)
  })
})

describe("code blocks", () => {
  it("frames each pre with its language and a copy button", () => {
    const { html } = prepareArticle(
      '<pre><code class="language-rust">fn main() {}</code></pre><pre>x</pre>'
    )
    expect(html).toContain("<span>Rust</span>")
    expect(html).toContain("<span>Code</span>")
    expect(html.match(/data-copy/g)).toHaveLength(2)
  })

  it("labels unknown languages by name", () => {
    expect(languageLabel("zig")).toBe("Zig")
    expect(languageLabel("ts")).toBe("TypeScript")
  })
})
