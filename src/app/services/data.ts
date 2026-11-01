import {
  CodeIcon,
  LayersIcon,
  MapPinIcon,
  PackageIcon,
  RocketIcon,
  ShieldCheckIcon,
} from "lucide-react"

import type { WhyItem } from "./types"

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
