import sanitizeHtml from "sanitize-html"

// Article HTML comes from the CMS editor (Tiptap) and is rendered on public
// pages as HTML. This keeps the markup the editor produces and drops
// everything else: scripts, iframes, event handlers, unknown tags and
// attributes, and links that are not http(s) or mailto.
//
// When a Tiptap extension is added, allow its tags/attributes here and add
// a case to __tests__/lib/blog/sanitize.test.ts.

const COLOR = [
  /^#[0-9a-f]{3,8}$/i,
  /^rgba?\(\s*[\d.\s,%]+\)$/i,
  /^hsla?\(\s*[\d.\s,%deg]+\)$/i,
  /^[a-z]+$/i,
]

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "hr",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "del",
    "mark",
    "sub",
    "sup",
    "span",
    "a",
    "img",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "code",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "align"],
    code: ["class"],
    ul: ["class"],
    ol: ["class", "start"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
    "*": ["style"],
  },
  allowedClasses: {
    code: ["language-*"],
    ul: ["list-*"],
    ol: ["list-*"],
  },
  // Only the styles the editor sets: text colour, highlight, alignment.
  allowedStyles: {
    "*": {
      color: COLOR,
      "background-color": COLOR,
      "text-align": [/^(left|right|center|justify)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  // Links that open a new tab can't reach back into this page.
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs:
        attribs.target === "_blank"
          ? { ...attribs, rel: "noopener noreferrer nofollow" }
          : attribs,
    }),
  },
}

/** Article HTML that is safe to render, keeping the editor's formatting. */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS)
}
