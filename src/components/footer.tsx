import Link from "next/link"

import { Eyebrow } from "@/components/eyebrow"
import { SplitReveal } from "@/components/split-reveal"
import { PillLink } from "@/components/pill-link"
import { siteConfig } from "@/lib/config"

const columns = [
  {
    title: "Products",
    links: [
      { label: "RantAI Agents", href: "https://agents.rantai.dev/", external: true },
      { label: "RantAIClaw", href: "https://claw.rantai.dev/", external: true },
      { label: "RantAI LLMOps", href: "/products" },
      { label: "RantAI Lake", href: "/products" },
    ],
  },
  {
    title: "Services",
    links: [
      {
        label: "Forward Deployed Engineering",
        href: "/services#forward-deployed-engineering",
      },
      { label: "Software Engineering", href: "/services" },
      { label: "AI Engineering", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Team", href: "/our-team" },
      { label: "Academy", href: "/academy" },
      { label: "Insights", href: "/blog" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: siteConfig.links.email, href: `mailto:${siteConfig.links.email}` },
      { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
      { label: "GitHub", href: siteConfig.links.github, external: true },
    ],
  },
] as const

export type FooterCta = {
  title: string
  description: string
  label: string
  subject?: string
  showServicesLink?: boolean
}

const defaultCta: FooterCta = {
  title: "Let's put AI to work in your operations.",
  description:
    "Tell us about the workflow you want to change. Our team will reply with how we would approach it.",
  label: "Talk to our team",
  showServicesLink: true,
}

export function Footer({ cta = defaultCta }: Readonly<{ cta?: FooterCta }>) {
  const mailto = `mailto:${siteConfig.links.email}${
    cta.subject ? `?subject=${encodeURIComponent(cta.subject)}` : ""
  }`

  return (
    <footer id="contact" className="scroll-mt-20 px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="dark overflow-hidden rounded-[28px] bg-black text-white">
        <div className="mx-auto max-w-[1440px] px-6 pt-20 sm:px-10 lg:px-14 lg:pt-28">
          <div className="flex flex-col gap-10 border-b border-white/10 pb-16 lg:flex-row lg:items-end lg:justify-between lg:pb-20">
            <div className="max-w-2xl">
              <Eyebrow className="text-white/60">Contact</Eyebrow>
              <SplitReveal
                text={cta.title}
                className="mt-5 text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance"
              />
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                {cta.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PillLink href={mailto} size="lg" icon="external">
                {cta.label}
              </PillLink>
              {cta.showServicesLink && (
                <PillLink href="/services" size="lg" variant="outline">
                  Explore services
                </PillLink>
              )}
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-medium tracking-[0.08em] text-white/40 uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...("external" in link && link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-sm break-words text-white/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mx-auto max-w-[1440px] px-6 pb-8 sm:px-10 lg:px-14">
          <div aria-hidden="true">
            <SplitReveal
              as="p"
              by="char"
              text={"AI systems for real\u2011world operations."}
              stagger={0.025}
              className="text-[clamp(3rem,10.5vw,10.5rem)] leading-[0.9] font-medium tracking-[-0.055em] text-white select-none"
            />
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-medium tracking-[0.08em] text-white/40 uppercase sm:flex-row sm:items-center sm:justify-between">
            <span suppressHydrationWarning>
              © {new Date().getFullYear()} RantAI. All rights reserved.
            </span>
            <span>Enterprise AI products &amp; engineering</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
