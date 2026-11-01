import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

// The link-preview card (1200x630) shared by every public page: the logo,
// the page's label in its colour, and its headline, on a light dotted desk
// like the page heroes.

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

let logo: Promise<string> | null = null
function logoDataUri() {
  logo ??= readFile(join(process.cwd(), "public/rant-ai.png")).then(
    (b) => `data:image/png;base64,${b.toString("base64")}`
  )
  return logo
}

export async function renderOgImage({
  eyebrow,
  title,
  tone,
  tint,
}: {
  eyebrow: string
  /** Headline; "\n" marks a line break, as on the page. */
  title: string
  /** Accent colour for the label. */
  tone: string
  /** Soft background colour, matching the page hero. */
  tint: string
}) {
  const src = await logoDataUri()
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: tint,
        backgroundImage: `radial-gradient(${tone}33 1.6px, transparent 1.8px)`,
        backgroundSize: "28px 28px",
        color: "#0a0a0a",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG, not the DOM */}
        <img src={src} width={56} height={56} alt="" />
        <span style={{ fontSize: 34, letterSpacing: "-0.03em" }}>RantAI</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: tone,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              backgroundColor: tone,
              borderRadius: 3,
            }}
          />
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            fontSize: 92,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {title.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>

      <span style={{ fontSize: 24, color: "#737373" }}>rantai.dev</span>
    </div>,
    ogSize
  )
}
