import {
  BotIcon,
  BarChart3Icon,
  CodeIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  ServerIcon,
  UsersIcon,
} from "lucide-react"

import type { AgentsProduct, ComingSoonProduct, DifferentiatorItem } from "./types"

export const agentsProduct: AgentsProduct = {
  id: "agents",
  icon: BotIcon,
  name: "RantAI Agents",
  tagline: "AI Agent Platform",
  status: "live",
  value: "Deploy AI agents that handle real work, not just demos.",
  benefits: [
    "Cut support ticket volume with autonomous resolution",
    "Deploy across web, app, and platform from one configuration",
    "Stay in control with human-in-the-loop escalation",
  ],
  tech: ["RAG", "Multi-agent", "Human-in-the-loop"],
}

export const comingSoonProducts: ComingSoonProduct[] = [
  {
    id: "analytics",
    icon: BarChart3Icon,
    name: "RantAI Analytics",
    tagline: "Analytics Platform",
    status: "in-progress",
    statusLabel: "In Progress",
    value: "Get answers from your data without writing SQL.",
    benefits: [
      "Any team member can query production databases in plain English",
      "Consistent metrics across teams via a shared semantic layer",
      "Connect to 40+ data sources in minutes",
    ],
    tech: ["NL→SQL", "Semantic layer", "100+ LLMs"],
  },
  {
    id: "zerocode",
    icon: CodeIcon,
    name: "RantAI ZeroCode",
    tagline: "Autonomous Coding Platform",
    status: "coming-soon",
    statusLabel: "Coming Soon",
    value: "Ship production software faster with AI that writes and manages code.",
    benefits: [
      "AI handles the full SDLC from requirements to deployment",
      "Transparent step-by-step code generation you can audit",
      "Powered by Claude, OpenCode, and leading models",
    ],
    tech: ["Autonomous agents", "Multi-model", "Full SDLC"],
  },
]

export const differentiators: DifferentiatorItem[] = [
  {
    icon: ServerIcon,
    title: "Production-grade reliability",
    description:
      "Built for enterprise uptime. Every platform is designed for real deployments, not prototypes.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Human control at every layer",
    description:
      "Overrides, audit logs, and escalation paths are built in — not bolted on.",
  },
  {
    icon: SlidersHorizontalIcon,
    title: "Model-agnostic",
    description:
      "Swap LLMs without rewriting your stack. Switch between OpenAI, Claude, or local models effortlessly.",
  },
  {
    icon: UsersIcon,
    title: "Scales with your team",
    description:
      "From a single agent to enterprise multi-tenant deployment, the architecture grows with you.",
  },
]
