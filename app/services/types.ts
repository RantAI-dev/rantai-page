import type { LucideIcon } from "lucide-react"

export interface ServiceItem {
  id: string
  icon: LucideIcon
  name: string
  outcome: string
  benefits: string[]
  proof: string
  cta: string
}

export interface ClientItem {
  id: string
  name: string
  logo: string
  category: string
  tagline: string
  href: string
}

export interface ProductItem {
  id: string
  name: string
  tagline: string
  category: string
  href: string
}

export interface DifferentiatorItem {
  number: string
  title: string
  body: string
}
