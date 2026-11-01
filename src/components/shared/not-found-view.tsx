import {
  ArrowRight,
  Boxes,
  BookOpen,
  Newspaper,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { SiteShell } from "@/components/layout/site-shell"
import { Eyebrow } from "@/components/shared/eyebrow"
import { MissedRequest } from "@/components/shared/missed-request"

const destinations: {
  id: "products" | "services" | "academy" | "blog" | "company"
  href: string
  icon: LucideIcon
  tone: string
}[] = [
  {
    id: "products",
    href: "/products",
    icon: Boxes,
    tone: "#3b82f6",
  },
  {
    id: "services",
    href: "/services",
    icon: Wrench,
    tone: "#f97316",
  },
  {
    id: "academy",
    href: "/academy",
    icon: BookOpen,
    tone: "#8b5cf6",
  },
  {
    id: "blog",
    href: "/blog",
    icon: Newspaper,
    tone: "#14b8a6",
  },
  {
    id: "company",
    href: "/our-team",
    icon: Users,
    tone: "#57534e",
  },
]

/**
 * Not found: the message on the left; on the right, the request that missed
 * and the places people usually mean to go.
 */
export async function NotFoundView({
  title,
  description,
  children,
}: Readonly<{
  title: string
  description: string
  /** Buttons under the message. */
  children: React.ReactNode
}>) {
  const t = await getTranslations("notFound")
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pt-10 pb-24 sm:px-10 sm:pt-14 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:pt-16 lg:pb-32">
        <div>
          <Eyebrow className="text-muted-foreground">{t("eyebrow")}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] whitespace-pre-line text-neutral-950">
            {title}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-500">
            {description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">{children}</div>
        </div>

        <div
          className="flex items-center justify-center rounded-[28px] p-6 sm:p-10"
          style={{
            backgroundColor: "#f4f3ee",
            backgroundImage:
              "radial-gradient(#d9d6cb 1.2px, transparent 1.4px)",
            backgroundSize: "20px 20px",
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.05]">
            <MissedRequest />
            <p className="px-4 pt-4 pb-2 text-[12px] font-medium tracking-[0.08em] text-neutral-500 uppercase">
              {t("tryThese")}
            </p>
            <ul className="px-2 pb-2">
              {destinations.map(({ id, href, icon: Icon, tone }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-neutral-50"
                  >
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-lg"
                      style={{ background: `${tone}14`, color: tone }}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium text-neutral-950">
                        {t(`destinations.${id}.label`)}
                      </span>
                      <span className="block truncate text-[13px] text-neutral-500">
                        {t(`destinations.${id}.line`)}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-neutral-300 transition-colors group-hover:text-neutral-950" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
