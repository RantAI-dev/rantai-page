import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Eyebrow } from "@/components/eyebrow"
import { MotionInView } from "@/components/motion-in-view"
import type { PartnerItem } from "../types"

export function PartnersSection({ partners }: { partners: PartnerItem[] }) {
  return (
    <section
      aria-labelledby="partners-heading"
      className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-14 lg:pb-32"
    >
      <MotionInView className="border-t border-border pt-16 lg:pt-24">
        <Eyebrow className="text-muted-foreground">Partners</Eyebrow>
        <h2
          id="partners-heading"
          className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em]"
        >
          Built with our partners.
        </h2>
      </MotionInView>

      <MotionInView className="mt-14 grid gap-3 md:grid-cols-3">
        {partners.map((partner) => {
          const hasLink = partner.showcase.ctaHref !== "#"
          return (
            <article
              key={partner.id}
              className="flex flex-col rounded-2xl bg-muted p-6 sm:p-7"
            >
              <div className="relative flex h-40 items-center justify-center rounded-xl bg-background">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={240}
                  height={160}
                  className="h-24 w-auto object-contain brightness-0"
                />
              </div>
              <p className="mt-6 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                {partner.name}
              </p>
              <h3 className="mt-2 text-xl font-medium tracking-[-0.02em]">
                {partner.showcase.name}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {partner.showcase.tagline}
              </p>
              {hasLink && (
                <Link
                  href={partner.showcase.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-medium"
                >
                  Visit website
                  <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
            </article>
          )
        })}
      </MotionInView>
    </section>
  )
}
