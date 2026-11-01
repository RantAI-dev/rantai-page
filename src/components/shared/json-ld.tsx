/**
 * Structured data for search engines (schema.org). "<" is escaped so no
 * value can close the script tag.
 */
export function JsonLd({ data }: Readonly<{ data: Record<string, unknown> }>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
