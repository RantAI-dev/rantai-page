// Teams we have built with: shown on Services (proof) and Company.

export interface ProductShowcase {
  name: string
  tagline: string
  ctaLabel: string
  ctaHref: string
  image: string
}

export interface PartnerItem {
  id: string
  name: string
  logo: string
  showcase: ProductShowcase
}

export const partners: PartnerItem[] = [
  {
    id: "nqrust",
    name: "NexusQuantum Technologies",
    logo: "/partners/nqrust.png",
    showcase: {
      name: "NQRust Hypervisor Suite",
      tagline: "Multi-agent orchestrator for quantitative research workflows.",
      ctaLabel: "VISIT WEBSITE",
      ctaHref: "#",
      image: "/partners/nqrust.png",
    },
  },
  {
    id: "ventures",
    name: "Quantum Investa Utama",
    logo: "/partners/ventures.png",
    showcase: {
      name: "AI Platform",
      tagline:
        "Investment intelligence platform for venture-scale decision making.",
      ctaLabel: "VISIT WEBSITE",
      ctaHref: "#",
      image: "/partners/ventures.png",
    },
  },
  {
    id: "bohrlabs",
    name: "Bohrlabs",
    logo: "/partners/bohrlabs.png",
    showcase: {
      name: "Bohrlabs Research Suite",
      tagline: "Scientific computing infrastructure for modern research labs.",
      ctaLabel: "VISIT WEBSITE",
      ctaHref: "#",
      image: "/partners/bohrlabs.png",
    },
  },
]
