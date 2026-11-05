import { getTranslations, setRequestLocale } from "next-intl/server"
import { ArrowUpRight, CalendarDays, GraduationCap, Mail } from "lucide-react"

import { SiteShell } from "@/components/layout/site-shell"
import { Eyebrow } from "@/components/shared/eyebrow"
import { Faq } from "@/components/shared/faq"
import {
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "@/components/shared/icons"
import { JsonLd } from "@/components/shared/json-ld"
import { SplitReveal } from "@/components/shared/split-reveal"
import type { Locale } from "@/i18n/routing"
import { siteConfig } from "@/lib/config"
import { faqJsonLd } from "@/lib/faq-json-ld"
import { pageMetadata } from "@/lib/seo"
import { ContactForm } from "./_components/contact-form"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return pageMetadata({
    locale: locale as Locale,
    page: "contact",
    path: "/contact",
  })
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("contact")

  const direct = [
    {
      icon: Mail,
      label: t("direct.general"),
      value: siteConfig.links.email,
      href: `mailto:${siteConfig.links.email}`,
    },
    {
      icon: GraduationCap,
      label: t("direct.academy"),
      value: siteConfig.links.academyEmail,
      href: `mailto:${siteConfig.links.academyEmail}`,
    },
    {
      icon: CalendarDays,
      label: t("direct.call"),
      value: t("direct.callMeta"),
      href: `mailto:${siteConfig.links.email}?subject=${encodeURIComponent(t("direct.callSubject"))}`,
    },
  ]
  const socials = [
    { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: LinkedInIcon },
    { label: "GitHub", href: siteConfig.links.github, Icon: GithubIcon },
    {
      label: "Instagram",
      href: siteConfig.links.instagram,
      Icon: InstagramIcon,
    },
    { label: "YouTube", href: siteConfig.links.youtube, Icon: YouTubeIcon },
  ]

  return (
    <SiteShell cta={false}>
      <JsonLd
        data={faqJsonLd(t.raw("faq.items") as { q: string; a: string }[])}
      />
      <section
        aria-labelledby="page-heading"
        className="mx-auto grid max-w-[1440px] gap-x-16 gap-y-10 px-5 pt-10 pb-6 sm:px-10 sm:pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:px-14 lg:pt-16 xl:gap-x-24"
      >
        {/* Phones: intro, then the form, then the direct contacts */}
        <div>
          <Eyebrow className="text-muted-foreground">
            {t("hero.eyebrow")}
          </Eyebrow>
          <SplitReveal
            id="page-heading"
            as="h1"
            text={t("hero.title")}
            trigger="mount"
            delay={0.1}
            className="mt-5 text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1] font-medium tracking-[-0.045em] text-balance whitespace-pre-line text-neutral-950"
          />
          <p className="mt-6 max-w-[27rem] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {t("hero.description")}
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-2">
          <ContactForm />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <h2 className="text-[13px] font-medium text-neutral-500 lg:mt-6">
            {t("direct.title")}
          </h2>
          <ul className="mt-3 border-t border-neutral-200">
            {direct.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="border-b border-neutral-200">
                <a href={href} className="group flex items-center gap-4 py-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700 transition-colors group-hover:bg-neutral-950 group-hover:text-white">
                    <Icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium text-neutral-950">
                      {label}
                    </span>
                    <span className="block truncate text-[14px] text-neutral-500">
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-950"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-4">
            <p className="text-[13px] font-medium text-neutral-500">
              {t("direct.follow")}
            </p>
            <ul className="-ml-2 flex items-center gap-1">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                  >
                    <Icon size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Faq ask={false} />
    </SiteShell>
  )
}
