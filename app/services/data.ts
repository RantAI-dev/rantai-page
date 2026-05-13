import {
  ServerIcon,
  DatabaseIcon,
  PackageIcon,
  ShieldCheckIcon,
  MapPinIcon,
  RocketIcon,
  LayersIcon,
  CodeIcon,
  CloudIcon,
  AppWindowIcon,
} from "lucide-react"

import type {
  TabContentSoftware,
  TabContentAI,
  PartnerItem,
  WhyItem,
} from "./types"

export const softwareEngineering: TabContentSoftware = {
  title: "Full Stack Development",
  description:
    "End-to-end product development, from architecture to deployment. We own the full lifecycle.",
  features: [
    "Frontend, backend, and infrastructure",
    "React, Next.js, FastAPI, Node.js",
    "Cloud-native, containerized deployment",
    "API design and microservices architecture",
  ],
  stack: [
    {
      category: "Frontend",
      categoryIcon: AppWindowIcon,
      iconColor: "#22c55e",
      tech: "React",
      techIcon: "/tech-stack/react.svg",
    },
    {
      category: "Backend",
      categoryIcon: ServerIcon,
      iconColor: "#eab308",
      tech: "Rust",
      techIcon: "/tech-stack/rust.svg",
    },
    {
      category: "Database",
      categoryIcon: DatabaseIcon,
      iconColor: "#ef4444",
      tech: "PostgreSQL",
      techIcon: "/tech-stack/postgresql.svg",
    },
    {
      category: "Infrastructure",
      categoryIcon: CloudIcon,
      iconColor: "#3b82f6",
      tech: "Docker",
      techIcon: "/tech-stack/docker.svg",
    },
  ],
}

export const aiEngineering: TabContentAI = {
  title: "ML Engineering & Operations",
  description:
    "From model integration to MLOps pipelines — we make sure your AI actually runs in production, not just in a notebook.",
  features: [
    "LLM integration and RAG pipelines",
    "Fine-tuning and model evaluation",
    "MLOps: monitoring, versioning, retraining",
    "AI strategy consulting",
  ],
  pipelineRow1: [
    { label: "Data Ingestion" },
    { label: "RAG Pipeline", highlighted: true },
    { label: "LLM" },
  ],
  pipelineRow2: [
    { label: "Evaluation" },
    { label: "MLOps", highlighted: true },
    { label: "Deploy" },
  ],
  stats: [
    { value: "98%", label: "Infrastructure" },
    { value: "42ms", label: "Latency" },
    { value: "100+", label: "LLM Support" },
  ],
}

export const partners: PartnerItem[] = [
  {
    id: "nqrust",
    name: "NexusQuantum Technologies",
    logo: "/partners/nqrust.png",
    showcase: {
      name: "Nexus Agent Platform",
      tagline: "Multi-agent orchestrator for quantitative research workflows.",
      ctaLabel: "EXPLORE PRODUCTS",
      ctaHref: "/products",
      image: "/partners/nqrust.png",
    },
  },
  {
    id: "ventures",
    name: "Quantum Investa Utama",
    logo: "/partners/ventures.png",
    showcase: {
      name: "Quantum Investa Platform",
      tagline:
        "Investment intelligence platform for venture-scale decision making.",
      ctaLabel: "EXPLORE PRODUCTS",
      ctaHref: "/products",
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
      ctaLabel: "EXPLORE PRODUCTS",
      ctaHref: "/products",
      image: "/partners/bohrlabs.png",
    },
  },
]

export const whyRantAI: WhyItem[] = [
  {
    icon: PackageIcon,
    iconBg: "bg-[#388ca1]",
    title: "Products, not just services",
    body: "We build and own our platforms, guaranteeing long-term roadmap continuity independent of any single vendor or engagement.",
  },
  {
    icon: ShieldCheckIcon,
    iconBg: "bg-[#32836a]",
    title: "No vendor lock-in",
    body: "Support for 100+ LLMs means you can switch model providers without rebuilding anything. Your stack stays yours.",
  },
  {
    icon: MapPinIcon,
    iconBg: "bg-[#bb7851]",
    title: "Local expertise",
    body: "Deep understanding of Indonesian government regulations and compliance requirements — built into the architecture from day one.",
  },
  {
    icon: RocketIcon,
    iconBg: "bg-[#574399]",
    title: "Production-grade, always",
    body: "Deployed in real production environments across government and enterprise. Built for scale, security, and operational reliability.",
  },
  {
    icon: LayersIcon,
    iconBg: "bg-[#bb5153]",
    title: "End-to-end capability",
    body: "One partner for the full lifecycle — from AI strategy and architecture design to deployment, monitoring, and ongoing support.",
  },
  {
    icon: CodeIcon,
    iconBg: "bg-[#517fbb]",
    title: "Open standards",
    body: "Built on open-source foundations for full auditability. No black boxes, no proprietary traps, no hidden dependencies.",
  },
]
