import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { ArrowUpRight, Mail } from "lucide-react"
import { getTranslations } from "next-intl/server"

import {
  BackToTop,
  FooterCtaCard,
  FooterWordmark,
  Reveal,
} from "@/components/layout/footer-motion"
import { GithubIcon, LinkedInIcon } from "@/components/shared/icons"
import { FooterPrompt } from "@/components/layout/footer-prompt"
import { SplitReveal } from "@/components/shared/split-reveal"
import { siteConfig } from "@/lib/config"
import { ProductLogo, productIdFrom } from "@/components/shared/product-logo"

type FooterLink = { label: string; href: string; external?: boolean }

type Translate = Awaited<ReturnType<typeof getTranslations<"common.footer">>>

function footerColumns(t: Translate): { title: string; links: FooterLink[] }[] {
  return [
    {
      title: t("products"),
      links: [
        // Product names stay as they are in every language.
        {
          label: "RantAI Agents",
          href: "https://agents.rantai.dev/",
          external: true,
        },
        {
          label: "RantAI Claw",
          href: "https://claw.rantai.dev/",
          external: true,
        },
        {
          label: "RantAI LLMOps",
          href: "https://llmops.rantai.dev/",
          external: true,
        },
        {
          label: "RantAI Lakehouse",
          href: "https://lakehouse.rantai.dev/",
          external: true,
        },
      ],
    },
    {
      title: t("services"),
      links: [
        { label: t("fde"), href: "/services#forward-deployed-engineering" },
        { label: t("softwareEngineering"), href: "/services#what-we-do" },
        { label: t("aiEngineering"), href: "/services#what-we-do" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("team"), href: "/our-team" },
        { label: t("academy"), href: "/academy" },
        { label: t("insights"), href: "/blog" },
        { label: t("contact"), href: `mailto:${siteConfig.links.email}` },
      ],
    },
  ]
}

function footerSocials(t: Translate) {
  return [
    {
      label: "LinkedIn",
      href: siteConfig.links.linkedin,
      icon: <LinkedInIcon size={16} />,
      external: true,
    },
    {
      label: "GitHub",
      href: siteConfig.links.github,
      icon: <GithubIcon size={16} />,
      external: true,
    },
    {
      label: t("email", { email: siteConfig.links.email }),
      href: `mailto:${siteConfig.links.email}`,
      icon: <Mail aria-hidden="true" className="size-[17px]" />,
      external: false,
    },
  ]
}

// Underline that grows from the left on hover.
const linkUnderline =
  "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size,color] duration-300 hover:bg-[length:100%_1px] motion-reduce:transition-none"

export type FooterCta = {
  title: string
  /** Small label above the title. */
  eyebrow?: string
  description?: string
  /** Text on the composer's send button. */
  label: string
  /** Email subject; defaults to a generic one. */
  subject?: string
  /** Example requests typed into the composer and offered as chips. */
  prompts?: string[]
  showServicesLink?: boolean
}

export async function Footer({ cta: given }: Readonly<{ cta?: FooterCta }>) {
  const t = await getTranslations("common.footer")
  const columns = footerColumns(t)
  const socials = footerSocials(t)
  const cta: FooterCta = given ?? {
    eyebrow: t("cta.eyebrow"),
    title: t("cta.title"),
    label: t("cta.label"),
    showServicesLink: true,
  }

  return (
    <footer
      id="contact"
      className="flex scroll-mt-20 flex-col gap-3 px-3 pb-3 sm:gap-4 sm:px-4 sm:pb-4"
    >
      <FooterCtaCard labelledBy="footer-cta-heading">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center sm:py-32">
          {cta.eyebrow && (
            <Reveal>
              <p className="mb-5 text-xs font-medium tracking-[0.14em] text-white/50 uppercase">
                {cta.eyebrow}
              </p>
            </Reveal>
          )}
          <SplitReveal
            id="footer-cta-heading"
            text={cta.title}
            className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.04em] text-balance"
          />
          {cta.description && (
            <Reveal index={2}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-white/60 sm:text-lg">
                {cta.description}
              </p>
            </Reveal>
          )}
          <Reveal index={3} className="mt-10 w-full">
            <FooterPrompt
              label={cta.label}
              subject={cta.subject ?? t("cta.subject")}
              prompts={cta.prompts}
            />
          </Reveal>
          {cta.showServicesLink && (
            <Reveal index={5}>
              <Link
                href="/services"
                className={`mt-8 inline-flex items-center gap-1 text-sm text-white/55 hover:text-white ${linkUnderline}`}
              >
                {t("exploreServices")}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Reveal>
          )}
        </div>
      </FooterCtaCard>

      {/* Links sit straight on the page, with a faded wordmark below */}
      <div className="relative overflow-hidden px-6 pt-14 sm:px-10 lg:px-16 lg:pt-20">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-20">
          <Reveal className="max-w-sm">
            <Link
              href="/"
              aria-label={t("home")}
              className="inline-flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-75"
            >
              <Image
                src="/rant-ai.png"
                alt=""
                width={36}
                height={36}
                className="size-7"
              />
              <span className="text-[19px] font-semibold tracking-[-0.03em]">
                RantAI
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <ul className="mt-5 -ml-2 flex items-center gap-1">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    {...(social.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="grid size-9 place-items-center rounded-full text-foreground/55 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <nav
            aria-label={t("nav")}
            className="grid gap-y-9 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-10 lg:gap-x-16"
          >
            {columns.map((column, i) => (
              <Reveal key={column.title} index={i + 1}>
                <p className="text-sm font-medium text-foreground">
                  {column.title}
                </p>
                <ul className="mt-2 sm:mt-4 sm:space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className={`group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground max-sm:min-h-10 max-sm:bg-none max-sm:text-[15px] ${linkUnderline}`}
                      >
                        {productIdFrom(link.label) && (
                          <ProductLogo
                            id={productIdFrom(link.label)!}
                            className="mr-1 h-3.5 dark:hidden"
                          />
                        )}
                        {productIdFrom(link.label) && (
                          <ProductLogo
                            id={productIdFrom(link.label)!}
                            variant="dark"
                            className="mr-1 hidden h-3.5 dark:block"
                          />
                        )}
                        {link.label}
                        {link.external && (
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-3.5 opacity-50 transition-[translate,opacity] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 motion-reduce:transition-none"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-foreground/10 pt-6 text-sm text-muted-foreground sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} RantAI
            <span className="mx-1.5 opacity-50">·</span>
            {t("rights")}
          </p>
          <div className="flex items-center justify-between gap-x-6 sm:justify-start">
            <a
              href={`mailto:${siteConfig.links.email}`}
              className={`hover:text-foreground max-sm:inline-flex max-sm:min-h-10 max-sm:items-center max-sm:bg-none ${linkUnderline}`}
            >
              {siteConfig.links.email}
            </a>
            <BackToTop />
          </div>
        </div>

        <FooterWordmark
          text="RantAI"
          className="mt-4 mb-[-0.2em] text-[clamp(6rem,24vw,22rem)] leading-[0.85] font-semibold tracking-[-0.06em]"
        />
      </div>
    </footer>
  )
}
