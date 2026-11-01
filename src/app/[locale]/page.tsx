import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { ArrowUpRight } from "lucide-react"

import { siteConfig } from "@/lib/config"
import { pageMetadata } from "@/lib/seo"
import type { Locale } from "@/i18n/routing"
import { JsonLd } from "@/components/shared/json-ld"
import { CapabilityMarquee } from "@/components/shared/capability-marquee"
import { HomeHero } from "./_components/home/home-hero"
import { HomeInsights } from "./_components/home/home-insights"
import { HomeProblem } from "./_components/home/home-problem"
import { HomeProcess } from "./_components/home/home-process"
import { HomeSolution } from "./_components/home/home-solution"
import { ExpandingPanel } from "@/components/platform/expanding-panel"
import { PlatformReel } from "@/components/platform/platform-reel"
import { SectionNav } from "@/components/layout/section-nav"
import { SiteShell } from "@/components/layout/site-shell"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return pageMetadata({
    locale: locale as Locale,
    page: "home",
    path: "/",
    absoluteTitle: true,
  })
}

// Who RantAI is, for search engines (shown in knowledge panels).
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/rant-ai.png`,
  email: siteConfig.links.email,
  description: siteConfig.description,
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
}

async function Announcement() {
  const t = await getTranslations("home.announcement")
  return (
    <Link
      href="/services#forward-deployed-engineering"
      className="group flex items-center justify-center gap-2 bg-background px-4 pt-2.5 pb-1 text-center text-[13px] text-foreground/70 transition-colors hover:text-foreground"
    >
      <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium tracking-[0.08em] text-background uppercase">
        {t("badge")}
      </span>
      <span>
        {t("title")}
        <span className="hidden sm:inline">{t("detail")}</span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="hidden size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block"
      />
    </Link>
  )
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("home.sections")
  return (
    <SiteShell announcement={<Announcement />}>
      <JsonLd data={organization} />
      <HomeHero />
      <HomeProblem />
      <HomeSolution />
      <ExpandingPanel
        id="platform"
        aria-labelledby="platform-heading"
        className="scroll-mt-20"
      >
        <PlatformReel />
      </ExpandingPanel>
      <CapabilityMarquee />
      <HomeProcess />
      <HomeInsights />
      <SectionNav
        sections={[
          { id: "problem", label: t("problem") },
          { id: "solution", label: t("solution") },
          { id: "platform", label: t("platform") },
          { id: "capabilities", label: t("capabilities") },
          { id: "how-we-work", label: t("howWeWork") },
          { id: "insights", label: t("insights") },
        ]}
      />
    </SiteShell>
  )
}
