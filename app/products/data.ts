import type { Product, DifferentiatorItem } from "./types"

export const products: Product[] = [
  {
    id: "agents",
    name: "RantAI Agents",
    tagline: "AI Agent Platform",
    status: "live",
    statusLabel: "Live",
    value: "Deploy AI agents that handle real work, not just demos.",
    description:
      "RantAI Agents lets you deploy autonomous AI agents across your enterprise stack — from customer support to internal ops. Each agent is auditable, escalatable, and production-ready from day one.",
    benefits: [
      "Cut support ticket volume with autonomous resolution",
      "Deploy across web, app, and platform from one configuration",
      "Stay in control with human-in-the-loop escalation",
      "Full audit trail for every decision the agent makes",
    ],
    tech: ["RAG", "Multi-agent", "Human-in-the-loop", "LLM-agnostic"],
    link: "/#contact",
    features: [
      {
        value: "prompting",
        label: "Prompting",
        icon: "prompting",
        caption:
          "Deploy across web, app, and platform from one configuration",
        image: null,
      },
      {
        value: "design",
        label: "Design",
        icon: "design",
        caption:
          "Craft consistent interfaces with AI-assisted design across every surface",
        image: null,
      },
      {
        value: "rewrite",
        label: "Rewrite",
        icon: "rewrite",
        caption:
          "Iterate and refine agent output instantly without starting from scratch",
        image: null,
      },
      {
        value: "audit",
        label: "Audit",
        icon: "audit",
        caption: "Full audit trail for every decision the agent makes",
        image: null,
      },
    ],
  },
  {
    id: "claw",
    name: "RantAI Claw",
    tagline: "Web Intelligence Platform",
    status: "live",
    statusLabel: "Live",
    value: "Extract, structure, and act on web data — at enterprise scale.",
    description:
      "RantAI Claw is a browser automation and intelligent data extraction platform. Point it at any website, define what you need, and Claw handles the rest — scraping, parsing, and delivering clean structured data in real time.",
    benefits: [
      "AI-powered extraction that adapts to layout changes automatically",
      "Run thousands of concurrent sessions without infrastructure overhead",
      "Output structured JSON, CSV, or pipe directly into your data stack",
      "Built-in scheduling, monitoring, and alerting for every pipeline",
    ],
    tech: ["Browser automation", "AI extraction", "Structured output", "Real-time"],
    link: "/#contact",
  },
  {
    id: "analytics",
    name: "RantAI Analytics",
    tagline: "Analytics Platform",
    status: "in-progress",
    statusLabel: "In Progress",
    value: "Get answers from your data without writing SQL.",
    description:
      "Ask any question in plain English and get accurate answers from your production database — instantly. RantAI Analytics replaces ad-hoc SQL requests with a shared semantic layer your entire team can query.",
    benefits: [
      "Any team member can query production databases in plain English",
      "Consistent metrics across teams via a shared semantic layer",
      "Connect to 40+ data sources in minutes",
    ],
    tech: ["NL→SQL", "Semantic layer", "100+ LLMs"],
  },
  {
    id: "zerocode",
    name: "RantAI ZeroCode",
    tagline: "Autonomous Coding Platform",
    status: "coming-soon",
    statusLabel: "Coming Soon",
    value: "Ship production software faster with AI that writes and manages code.",
    description:
      "ZeroCode handles the full software development lifecycle — from requirements to deployment — with transparent, auditable AI-generated code you can review at every step.",
    benefits: [
      "AI handles the full SDLC from requirements to deployment",
      "Transparent step-by-step code generation you can audit",
      "Powered by Claude, OpenCode, and leading models",
    ],
    tech: ["Autonomous agents", "Multi-model", "Full SDLC"],
  },
]

export const liveProducts = products.filter((p) => p.status === "live")
export const upcomingProducts = products.filter((p) => p.status !== "live")

export const differentiators: DifferentiatorItem[] = [
  {
    title: "Production-grade reliability",
    description:
      "Built for enterprise uptime. Every platform is designed for real deployments, not prototypes.",
  },
  {
    title: "Human control at every layer",
    description:
      "Overrides, audit logs, and escalation paths are built in — not bolted on.",
  },
  {
    title: "Model-agnostic",
    description:
      "Swap LLMs without rewriting your stack. Switch between OpenAI, Claude, or local models effortlessly.",
  },
  {
    title: "Scales with your team",
    description:
      "From a single agent to enterprise multi-tenant deployment, the architecture grows with you.",
  },
]
