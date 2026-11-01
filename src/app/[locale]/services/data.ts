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
    id: "products",
    icon: PackageIcon,
    iconBg: "bg-[#388ca1]",
  },
  {
    id: "lockIn",
    icon: ShieldCheckIcon,
    iconBg: "bg-[#32836a]",
  },
  {
    id: "local",
    icon: MapPinIcon,
    iconBg: "bg-[#bb7851]",
  },
  {
    id: "production",
    icon: RocketIcon,
    iconBg: "bg-[#574399]",
  },
  {
    id: "lifecycle",
    icon: LayersIcon,
    iconBg: "bg-[#bb5153]",
  },
  {
    id: "open",
    icon: CodeIcon,
    iconBg: "bg-[#517fbb]",
  },
]
