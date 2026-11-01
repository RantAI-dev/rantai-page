import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt = "RantAI Academy"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Academy",
    title: "Learn to build\nwith AI.",
    tone: "#8b5cf6",
    tint: "#f2eefc",
  })
}
