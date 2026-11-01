import { getTranslations, setRequestLocale } from "next-intl/server"
import { ServicesVisual } from "@/components/shared/hero-visuals"
import { PageHero } from "@/components/shared/page-hero"
import { PillLink } from "@/components/shared/pill-link"
import { SectionNav } from "@/components/layout/section-nav"
import { SiteShell } from "@/components/layout/site-shell"
import { PartnersSection } from "./_components/partners-section"
import { Engagement } from "./_components/engagement"
import { ProblemPicker } from "./_components/problem-picker"
import { WhyRantAISection } from "./_components/why-rantai-section"
import { partners } from "@/lib/partners"
import { pageMetadata } from "@/lib/seo"
import type { Locale } from "@/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return pageMetadata({
    locale: locale as Locale,
    page: "services",
    path: "/services",
  })
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("services")
  const sectionLinks = [
    { id: "what-we-do", label: t("sections.whatWeDo") },
    { id: "how-we-work", label: t("sections.howWeWork") },
    { id: "proof", label: t("sections.proof") },
    { id: "why-rantai", label: t("sections.whyRantai") },
  ]
  return (
    <SiteShell
      cta={{
        title: t("cta.title"),
        description: t("cta.description"),
        label: t("cta.label"),
        subject: t("cta.subject"),
        prompts: t.raw("cta.prompts") as string[],
      }}
    >
      <PageHero
        tone="peach"
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        description={t("hero.description")}
        visual={<ServicesVisual />}
      >
        <PillLink href="#what-we-do" size="lg">
          {t("hero.findFix")}
        </PillLink>
        <PillLink href="#how-we-work" size="lg" variant="outline">
          {t("hero.howWeWork")}
        </PillLink>
      </PageHero>

      <ProblemPicker />

      <Engagement />

      <PartnersSection partners={partners} eyebrow={t("sections.proof")} />
      <WhyRantAISection />
      <SectionNav sections={sectionLinks} />
    </SiteShell>
  )
}
