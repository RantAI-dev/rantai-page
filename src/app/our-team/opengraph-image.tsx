import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt = "The RantAI team"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Company",
    title: "The people\nbehind RantAI.",
    tone: "#57534e",
    tint: "#f4f3ee",
  })
}
