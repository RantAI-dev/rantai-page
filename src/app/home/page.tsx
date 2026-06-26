import type { Metadata } from "next"

import { HomeLanding } from "./_components/home-landing"

export const metadata: Metadata = {
  title: "Home",
  description:
    "RantAI builds AI for actual operations, enterprise teams, and real business workflows.",
  alternates: {
    canonical: "/home",
  },
}

export default function HomePage() {
  return <HomeLanding />
}
