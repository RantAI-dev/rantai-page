import {
  Blocks,
  Bot,
  DatabaseZap,
  LayoutDashboard,
  ScrollText,
  Server,
  Terminal,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Eyebrow } from "@/components/shared/eyebrow"
import { SplitReveal } from "@/components/shared/split-reveal"
import { cn } from "@/lib/utils"

// Text for each card lives in messages/<locale>/platform.json under
// `capabilities.items.<id>`; the product label is there too ("Services"
// is translated, product names are not).
type Capability = {
  id: string
  icon: LucideIcon
  /** One colour per capability, from the site's feature palette. */
  tone: string
}

const rows: Capability[][] = [
  [
    { id: "rag", icon: DatabaseZap, tone: "#3b82f6" },
    { id: "builder", icon: Bot, tone: "#8b5cf6" },
    { id: "artifacts", icon: ScrollText, tone: "#f59e0b" },
    { id: "skills", icon: Zap, tone: "#ec4899" },
    { id: "fde", icon: Users, tone: "#10b981" },
  ],
  [
    { id: "tui", icon: Terminal, tone: "#0ea5e9" },
    { id: "webui", icon: LayoutDashboard, tone: "#6366f1" },
    { id: "clawhub", icon: Blocks, tone: "#f97316" },
    { id: "selfHosted", icon: Server, tone: "#14b8a6" },
  ],
]

function Card({
  item,
  duplicate,
}: Readonly<{ item: Capability; duplicate: boolean }>) {
  const t = useTranslations("platform.capabilities.items")
  const Icon = item.icon
  const tone = item.tone
  return (
    <li
      aria-hidden={duplicate || undefined}
      className="flex w-[300px] shrink-0 flex-col gap-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:w-[340px]"
    >
      <div className="flex items-center justify-between">
        <span
          className="flex size-10 items-center justify-center rounded-xl"
          style={{ background: `${tone}1f`, color: tone }}
        >
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
        </span>
        <span className="text-xs font-medium tracking-[0.08em] text-neutral-500 uppercase">
          {t(`${item.id}.product`)}
        </span>
      </div>
      <div>
        <p className="text-lg font-medium tracking-[-0.02em] text-neutral-950">
          {t(`${item.id}.title`)}
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-600">
          {t(`${item.id}.body`)}
        </p>
      </div>
    </li>
  )
}

function Row({
  items,
  reverse,
}: Readonly<{ items: Capability[]; reverse?: boolean }>) {
  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto">
      <ul
        className={cn(
          "flex w-max animate-marquee gap-3 pr-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none",
          reverse && "[animation-direction:reverse]"
        )}
      >
        {[...items, ...items].map((item, index) => (
          <Card
            key={`${item.id}-${index}`}
            item={item}
            duplicate={index >= items.length}
          />
        ))}
      </ul>
    </div>
  )
}

export function CapabilityMarquee() {
  const t = useTranslations("platform.capabilities")
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-14">
        <Eyebrow className="text-neutral-500">{t("eyebrow")}</Eyebrow>
        <SplitReveal
          id="capabilities-heading"
          text={t("title")}
          className="mt-5 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance text-neutral-950"
        />
      </div>
      <div className="mt-14 space-y-3">
        <Row items={rows[0]} />
        <Row items={rows[1]} reverse />
      </div>
    </section>
  )
}
