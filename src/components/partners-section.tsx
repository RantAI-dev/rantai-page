"use client"

import Image from "next/image"
import { LogoLoop, type LogoItem } from "./LogoLoop"
import { MotionInView } from "./motion-in-view"

const partners = [
  {
    name: "NexusQuantum Technologies",
    logo: "/partners/nqrust.png",
  },
  {
    name: "Quantum Investa Utama (QIU)",
    logo: "/partners/ventures.png",
  },
  {
    name: "Bohrlabs",
    logo: "/partners/bohrlabs.png",
  },
]

const logoItems: LogoItem[] = partners.map((partner) => ({
  node: (
    <div className="relative h-40 w-40 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-44 sm:w-44">
      <Image
        src={partner.logo}
        alt={partner.name}
        fill
        sizes="160px"
        className="object-contain brightness-0 invert"
      />
    </div>
  ),
  ariaLabel: partner.name,
}))

export function PartnersSection() {
  return (
    <section className="bg-background px-8 py-20 sm:px-2 lg:px-4 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <MotionInView>
          <p className="text-center font-mono text-lg tracking-wider text-muted-foreground uppercase">
            Trusted Partners
          </p>

          <LogoLoop
            logos={logoItems}
            speed={80}
            logoHeight={160}
            gap={56}
            pauseOnHover
            fadeOut
            fadeOutColor="var(--background)"
            direction="left"
            scaleOnHover
          />
        </MotionInView>
      </div>
    </section>
  )
}
