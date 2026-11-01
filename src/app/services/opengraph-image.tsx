import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image"

export const alt = "RantAI Services"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({
    eyebrow: "Services",
    title: "Ship better\nsoftware, faster.",
    tone: "#f97316",
    tint: "#fbf0e8",
  })
}
