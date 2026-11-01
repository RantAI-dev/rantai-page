import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt = "RantAI"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Enterprise AI",
    title: "AI systems for\nreal-world operations.",
    tone: "#3b82f6",
    tint: "#edf3fd",
  })
}
