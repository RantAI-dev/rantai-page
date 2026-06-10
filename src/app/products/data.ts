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
    link: "https://agents.rantai.dev/",
    features: [
      {
        value: "rag",
        label: "RAG",
        icon: "rag",
        caption:
          "Ground every agent response in your own knowledge base using retrieval-augmented generation",
        image: null,
        video: "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-agents/Agents%20-%20RAG%20Prompt.mp4",
      },
      {
        value: "agent-builder",
        label: "Agent Builder",
        icon: "agent-builder",
        caption:
          "Build and configure agents visually — upload files, define tools, and set behaviors in one place",
        image: null,
        video: "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-agents/Agents%20-%20File%20Upload.mp4",
      },
      {
        value: "artifacts",
        label: "Artifacts",
        icon: "artifacts",
        caption:
          "Generate and iterate on structured outputs — docs, code, and reports — directly from your prompts",
        image: null,
        video: "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-agents/Agents%20-%20Prompt%20Artifact.mp4",
      },
      {
        value: "skills",
        label: "Skills",
        icon: "skills",
        caption:
          "Extend agent capabilities with reusable skills that plug into any workflow or artifact",
        image: null,
        video: "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-agents/Agents%20-%20Skills.mp4",
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
    link: "https://claw.rantai.dev/",
    video: "https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-claw/claw-demo.mp4",
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
