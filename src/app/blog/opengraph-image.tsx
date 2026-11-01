import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt = "RantAI Insights"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Insights",
    title: "Notes from the\nRantAI team.",
    tone: "#14b8a6",
    tint: "#e9f5f3",
  })
}
