export type ProductStatus = "live" | "in-progress" | "coming-soon"

/** Icon keys resolved to lucide components on the client. */
export type ProductFeatureIcon =
  | "prompting"
  | "design"
  | "rewrite"
  | "audit"

/** A switchable feature/capability of a product, rendered as a tab. */
export interface ProductFeature {
  /** Stable key used as the tab value. */
  value: string
  label: string
  /** Icon key — kept as a string so the data stays serializable across the RSC boundary. */
  icon: ProductFeatureIcon
  /** Short supporting line shown alongside the feature screenshot. */
  caption: string
  /** Screenshot for this feature. `null` renders a placeholder until the asset exists. */
  image: string | null
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
  tech: string[]
  link?: string
  /** Capabilities shown in a tabbed switcher on the products page. */
  features?: ProductFeature[]
}

export interface DifferentiatorItem {
  title: string
  description: string
}
