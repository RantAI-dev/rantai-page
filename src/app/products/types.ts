export type ProductStatus = "live" | "in-progress" | "coming-soon"

export type ProductFeatureIcon =
  | "rag"
  | "agent-builder"
  | "artifacts"
  | "skills"

export interface ProductFeature {
  value: string
  label: string
  icon: ProductFeatureIcon
  caption: string
  image: string | null
  video?: string | null
}

export interface Product {
  id: string
  name: string
  tagline: string
  status: ProductStatus
  statusLabel: string
  value: string
  description: string
  benefits: string[]
  link?: string
  video?: string | null
  features?: ProductFeature[]
}

export interface DifferentiatorItem {
  title: string
  description: string
}
