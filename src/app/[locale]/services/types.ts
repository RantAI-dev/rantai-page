import type { LucideIcon } from "lucide-react"

/** A "Why RantAI" point. Its title and body live in messages under `why.items.<id>`. */
export interface WhyItem {
  id: "products" | "lockIn" | "local" | "production" | "lifecycle" | "open"
  icon: LucideIcon
  iconBg: string
}
