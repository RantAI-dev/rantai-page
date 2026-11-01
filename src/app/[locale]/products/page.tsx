import { getTranslations, setRequestLocale } from "next-intl/server"

import { pageMetadata } from "@/lib/seo"
import type { Locale } from "@/i18n/routing"
import { CapabilityMarquee } from "@/components/shared/capability-marquee"
import { siteConfig } from "@/lib/config"
import { ProductsHeroVisual } from "./_components/products-bento"
import { PageHero } from "@/components/shared/page-hero"
import { PillLink } from "@/components/shared/pill-link"
import { ExpandingPanel } from "@/components/platform/expanding-panel"
import { PlatformReel } from "@/components/platform/platform-reel"
import { DataJourney } from "@/components/platform/data-journey"
import { ServicesOverview } from "./_components/services-overview"
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
    page: "products",
    path: "/products",
  })
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("products")
  return (
    <SiteShell
      cta={{
        title: t("cta.title"),
        description: t("cta.description"),
        label: t("cta.label"),
        subject: t("cta.subject"),
        prompts: t.raw("cta.prompts") as string[],
        showServicesLink: true,
      }}
    >
      <PageHero
        tone="blue"
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
        visual={<ProductsHeroVisual />}
      >
        <PillLink
          href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent(t("hero.demoSubject"))}`}
          size="lg"
          icon="external"
        >
          {t("hero.demo")}
        </PillLink>
        <PillLink href="#platform" size="lg" variant="outline">
          {t("hero.seeInAction")}
        </PillLink>
      </PageHero>
      <DataJourney />
      <ExpandingPanel
        id="platform"
        aria-labelledby="platform-heading"
        className="scroll-mt-20"
      >
        <PlatformReel
          intro={{ eyebrow: t("reel.eyebrow"), title: t("reel.title") }}
        />
      </ExpandingPanel>
      <CapabilityMarquee />
      <ServicesOverview />
      <SectionNav
        sections={[
          { id: "how-it-fits", label: t("sections.howItFits") },
          { id: "platform", label: t("sections.platform") },
          { id: "capabilities", label: t("sections.capabilities") },
          { id: "services", label: t("sections.services") },
        ]}
      />
    </SiteShell>
  )
}
