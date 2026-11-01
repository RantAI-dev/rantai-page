import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt = "RantAI Products"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Products",
    title: "AI products built\nfor real operations.",
    tone: "#3b82f6",
    tint: "#edf3fd",
  })
}
