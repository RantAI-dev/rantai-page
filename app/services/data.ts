import { CodeIcon, RefreshCwIcon, ShieldIcon, BrainCircuitIcon } from "lucide-react"

import type { ServiceItem, ClientItem, ProductItem, DifferentiatorItem } from "./types"

export const services: ServiceItem[] = [
  {
    id: "modernization",
    icon: RefreshCwIcon,
    name: "Legacy App Modernization",
    outcome: "Eliminate technical debt without rewriting from scratch",
    benefits: [
      "Cut maintenance costs by removing brittle, hard-to-change legacy code",
      "Production-ready Rust rewrites in weeks, not months",
      "Zero-downtime migration with AI-guided codebase analysis",
    ],
    proof: "We analyze your existing code first — no guesswork, no scope creep.",
    cta: "Audit My Codebase",
  },
  {
    id: "fullstack",
    icon: CodeIcon,
    name: "Full Stack Software Development",
    outcome: "Go from idea to production without the usual overhead",
    benefits: [
      "Design-to-deployment in one team — no handoffs, no delays",
      "Rust-backed backends that handle traffic spikes without new infrastructure",
      "AI-assisted development that ships features significantly faster",
    ],
    proof: "One team owns the full stack. You get velocity, not meetings.",
    cta: "Start Building",
  },
  {
    id: "security",
    icon: ShieldIcon,
    name: "Software Security & Performance",
    outcome: "Find the vulnerabilities slowing you down — before attackers do",
    benefits: [
      "Binary-level analysis catches issues that static tools miss",
      "Performance bottlenecks identified and patched in days",
      "Rust rewrites that cut latency measurably under real load",
    ],
    proof: "We work on source code or compiled binaries — no source access required.",
    cta: "Run a Security Audit",
  },
  {
    id: "mlops",
    icon: BrainCircuitIcon,
    name: "ML Engineering & Operations",
    outcome: "Put your ML models in production — and keep them there",
    benefits: [
      "GPU/TPU-optimized inference that reduces serving costs",
      "End-to-end pipeline: training, evaluation, and live deployment",
      "Multi-cloud setup — never locked into a single vendor",
    ],
    proof: "We handle the infrastructure so your team stays focused on the model.",
    cta: "Talk to an ML Engineer",
  },
]

export const clients: ClientItem[] = [
  {
    id: "nexus",
    name: "NexusQuantum Technologies",
    logo: "/partners/nqrust.png",
    category: "AI Platform",
    tagline: "AI-powered quantitative research platform for modern investment firms.",
    href: "#",
  },
  {
    id: "bohr",
    name: "Bohr Labs",
    logo: "/partners/bohrlabs.png",
    category: "Dev Tools",
    tagline: "Developer tooling for high-performance distributed systems.",
    href: "#",
  },
  {
    id: "ventures",
    name: "Quantum Investa Utama",
    logo: "/partners/ventures.png",
    category: "Ventures",
    tagline: "Early-stage venture firm backing deep-tech founders across Southeast Asia.",
    href: "#",
  },
]

export const products: ProductItem[] = [
  {
    id: "nexus-agent",
    name: "Nexus Agent Platform",
    tagline: "Multi-agent orchestration for quantitative research workflows.",
    category: "AI Agents",
    href: "#nexus-agent",
  },
]

export const differentiators: DifferentiatorItem[] = [
  {
    number: "01",
    title: "Rust-first performance",
    body: "We build in Rust where it matters — lower latency, fewer runtime errors, smaller attack surface. Not as a trend, but because your production systems demand it.",
  },
  {
    number: "02",
    title: "Human-in-the-loop AI",
    body: "Our AI workflows move fast. Our engineers catch what AI misses. You get both — the speed of automation without the reckless mistakes.",
  },
  {
    number: "03",
    title: "Production focus",
    body: "We optimize for live systems under real load, not sandbox demos. Every recommendation is tested against your actual constraints.",
  },
  {
    number: "04",
    title: "No vendor lock-in",
    body: "Open standards, your infrastructure. We build systems you own and can evolve — not dependencies you'll regret in two years.",
  },
]
