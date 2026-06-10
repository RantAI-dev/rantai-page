import type { LucideIcon } from "lucide-react"

export interface StackRow {
  category: string
  categoryIcon: LucideIcon
  iconColor: string
  tech: string
  techIcon: string
}

export interface TabContentSoftware {
  title: string
  description: string
  features: string[]
  stack: StackRow[]
}

export interface PipelineStep {
  label: string
  highlighted?: boolean
}

export interface StatCard {
  value: string
  label: string
}

export interface TabContentAI {
  title: string
  description: string
  features: string[]
  pipelineRow1: PipelineStep[]
  pipelineRow2: PipelineStep[]
  stats: StatCard[]
}

export interface PartnerItem {
  id: string
  name: string
  logo: string
  showcase: ProductShowcase
}

export interface ProductShowcase {
  name: string
  tagline: string
  ctaLabel: string
  ctaHref: string
  image: string
}

export interface WhyItem {
  icon: LucideIcon
  iconBg: string
  title: string
  body: string
}
