import { describe, expect, it } from "vitest"

import { sanitizeBlogHtml } from "@/lib/blog/sanitize"

describe("sanitizeBlogHtml: removes what can run code", () => {
  it("drops script and iframe elements", () => {
    const out = sanitizeBlogHtml(
      '<p>a</p><script>alert(1)</script><iframe src="https://x.test"></iframe><p>b</p>'
    )
    expect(out).toBe("<p>a</p><p>b</p>")
  })

  it("drops event handler attributes", () => {
    const out = sanitizeBlogHtml(
      '<img src="https://x.test/a.png" onerror="alert(1)" alt="a">'
    )
    expect(out).not.toContain("onerror")
    expect(out).toContain('src="https://x.test/a.png"')
  })

  it("drops javascript: and data: URLs", () => {
    expect(sanitizeBlogHtml('<a href="javascript:alert(1)">x</a>')).toBe(
      "<a>x</a>"
    )
    expect(sanitizeBlogHtml('<img src="data:image/png;base64,AAAA">')).toBe(
      "<img />"
    )
  })

  it("drops styles other than colour, highlight and alignment", () => {
    const out = sanitizeBlogHtml(
      '<p style="position:fixed;inset:0;text-align:center">x</p>'
    )
    expect(out).toBe('<p style="text-align:center">x</p>')
  })
})

describe("sanitizeBlogHtml: keeps what the editor writes", () => {
  it("keeps headings, lists, emphasis and code with its language", () => {
    const html =
      "<h2>Title</h2><p><strong>b</strong> <em>i</em> <u>u</u></p>" +
      '<ul class="list-disc"><li>one</li></ul>' +
      '<pre><code class="language-rust">fn main() {}</code></pre>'
    expect(sanitizeBlogHtml(html)).toBe(html)
  })

  it("keeps https links and makes new-tab links safe", () => {
    const out = sanitizeBlogHtml(
      '<a href="https://rantai.dev" target="_blank">x</a>'
    )
    expect(out).toBe(
      '<a href="https://rantai.dev" target="_blank" rel="noopener noreferrer nofollow">x</a>'
    )
  })

  it("keeps https images with their size and text colour", () => {
    const html =
      '<img src="https://x.test/a.png" alt="a" width="100%" />' +
      '<p><span style="color:#ff0000">red</span></p>'
    expect(sanitizeBlogHtml(html)).toBe(html)
  })
})
