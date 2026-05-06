import type { LucideIcon } from "lucide-react"

export interface AgentsProduct {
  id: string
  icon: LucideIcon
  name: string
  tagline: string
  status: "live"
  value: string
  benefits: string[]
  tech: string[]
}

export interface ComingSoonProduct {
  id: string
  icon: LucideIcon
  name: string
  tagline: string
  status: "in-progress" | "coming-soon"
  statusLabel: string
  value: string
  benefits: string[]
  tech: string[]
}

export interface DifferentiatorItem {
  icon: LucideIcon
  title: string
  description: string
}
