export type ArticleHeading = { id: string; text: string; level: 2 | 3 }

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")

const plain = (html: string) => decode(html.replace(/<[^>]+>/g, "")).trim()

export function slugifyHeading(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s-]+/g, "-") || "section"
  )
}

/**
 * Gets stored article HTML ready for the reading page: drops a leading <h1>
 * (the page already shows the title), gives every h2/h3 a stable id so it can
 * be linked to, and returns those headings for the table of contents.
 */
export function prepareArticle(html: string): {
  html: string
  headings: ArticleHeading[]
} {
  const body = html.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, "")

  const headings: ArticleHeading[] = []
  const used = new Map<string, number>()

  const out = body.replace(
    /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, lvl: string, attrs: string, inner: string) => {
      const text = plain(inner)
      if (!text) return match
      const existing = /\bid\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1]
      let id = existing ?? slugifyHeading(text)
      if (!existing) {
        const n = used.get(id) ?? 0
        used.set(id, n + 1)
        if (n > 0) id = `${id}-${n + 1}`
      }
      headings.push({ id, text, level: Number(lvl) as 2 | 3 })
      const rest = existing ? attrs : `${attrs} id="${id}"`
      return `<h${lvl}${rest}>${inner}<a href="#${id}" class="heading-anchor" aria-label="Link to this section">#</a></h${lvl}>`
    }
  )

  return { html: wrapCodeBlocks(out), headings }
}

const LANGS: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  jsx: "JSX",
  py: "Python",
  python: "Python",
  rs: "Rust",
  rust: "Rust",
  sh: "Shell",
  bash: "Bash",
  shell: "Shell",
  sql: "SQL",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  html: "HTML",
  css: "CSS",
  go: "Go",
  cpp: "C++",
  c: "C",
  java: "Java",
  toml: "TOML",
  dockerfile: "Dockerfile",
  plaintext: "Text",
  text: "Text",
}

export function languageLabel(lang?: string) {
  if (!lang) return "Code"
  const key = lang.toLowerCase()
  return LANGS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

/** Wraps each <pre> in a frame with its language and a copy button. */
function wrapCodeBlocks(html: string) {
  return html.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, (pre) => {
    const lang = /class\s*=\s*["'][^"']*\blanguage-([\w+#-]+)/i.exec(pre)?.[1]
    return (
      `<div class="code-frame not-prose">` +
      `<div class="code-head"><span>${languageLabel(lang)}</span>` +
      `<button type="button" class="code-copy" data-copy>Copy</button></div>` +
      `${pre}</div>`
    )
  })
}
