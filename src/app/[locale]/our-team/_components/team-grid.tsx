"use client"

import { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Code2, Crown, FlaskConical, PenTool, Users } from "lucide-react"
import { useTranslations } from "next-intl"

import { Eyebrow } from "@/components/shared/eyebrow"
import { FilterChips } from "@/components/shared/filter-chips"
import { GithubIcon, LinkedInIcon } from "@/components/shared/icons"
import { SplitReveal } from "@/components/shared/split-reveal"
import type { TeamMember } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

// Roles are free text, so people are filtered by the group their role falls in.
const GROUPS = [
  {
    id: "leadership",
    tone: "#8b5cf6",
    icon: Crown,
    test: /chief|\bvp\b|head|lead|founder|director/i,
  },
  {
    id: "research",
    tone: "#14b8a6",
    icon: FlaskConical,
    test: /scien|data|research/i,
  },
  {
    id: "engineering",
    tone: "#3b82f6",
    icon: Code2,
    test: /engineer|developer/i,
  },
  { id: "writingOps", tone: "#f59e0b", icon: PenTool, test: /./ },
] as const

function groupOf(role: string) {
  return GROUPS.find((g) => g.test.test(role)) ?? GROUPS[GROUPS.length - 1]
}

const ALL = "all"

function Social({
  member,
  onPhoto,
}: Readonly<{ member: TeamMember; onPhoto?: boolean }>) {
  const t = useTranslations("company.team")
  const links = [
    { href: member.github, label: "GitHub", Icon: GithubIcon },
    { href: member.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  ]
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {links.map(({ href, label, Icon }) =>
        href ? (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("onProfile", { name: member.name, network: label })}
            className={cn(
              "grid size-8 place-items-center rounded-full transition-colors",
              onPhoto
                ? "text-white/80 hover:bg-white/15 hover:text-white"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
            )}
          >
            <Icon size={15} />
          </Link>
        ) : (
          <span
            key={label}
            aria-disabled="true"
            title={t("notAdded", { network: label })}
            className={cn(
              "grid size-8 cursor-not-allowed place-items-center rounded-full",
              onPhoto ? "text-white/30" : "text-neutral-300"
            )}
          >
            <Icon size={15} />
          </span>
        )
      )}
    </div>
  )
}

function Photo({
  member,
  sizes,
  className,
}: Readonly<{ member: TeamMember; sizes: string; className?: string }>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-neutral-800",
        className
      )}
    >
      {member.imageUrl ? (
        <Image
          src={member.imageUrl}
          alt={member.name}
          fill
          sizes={sizes}
          className="object-cover object-top"
          unoptimized
        />
      ) : (
        <div className="flex h-full items-center justify-center text-5xl font-medium text-neutral-500">
          {member.name.charAt(0)}
        </div>
      )}
    </div>
  )
}

type Group = (typeof GROUPS)[number]

/** Role line with the group's colour dot. */
function Role({
  member,
  group,
  onPhoto,
  wrap,
}: Readonly<{
  member: TeamMember
  group: Group
  onPhoto?: boolean
  wrap?: boolean
}>) {
  return (
    <p
      className={cn(
        "mt-1 flex items-center gap-2 text-[13px] max-md:items-start",
        onPhoto ? "text-white/70" : "text-neutral-500"
      )}
    >
      <span
        className="size-1.5 shrink-0 rounded-full max-md:mt-[calc(0.5lh-3px)]"
        style={{ background: group.tone }}
      />
      {/* Phones show the whole role on up to two lines; wider grids truncate. */}
      <span className={wrap ? undefined : "max-md:line-clamp-2 md:truncate"}>
        {member.role}
      </span>
    </p>
  )
}

/**
 * Leadership. The first person gets a wide card: name large on the left,
 * photo on the right at its own size (photos are 300x400, so never stretched).
 */
function LeadTile({
  member,
  big,
  group,
}: Readonly<{ member: TeamMember; big?: boolean; group: Group }>) {
  if (big) {
    return (
      <div className="group col-span-2 grid grid-cols-2 overflow-hidden rounded-xl bg-[#262626]">
        <div className="flex min-w-0 flex-col justify-end p-4 text-white sm:p-6">
          <div>
            <p className="text-[clamp(1.35rem,2.2vw,2rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance">
              {member.name}
            </p>
            <Role member={member} group={group} onPhoto wrap />
            <div className="mt-3 -ml-2">
              <Social member={member} onPhoto />
            </div>
          </div>
        </div>
        <Photo
          member={member}
          sizes="(max-width: 1024px) 50vw, 17vw"
          className="aspect-[4/5] rounded-none"
        />
      </div>
    )
  }
  return (
    <div className="group relative">
      <Photo
        member={member}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 17vw"
        className="aspect-[4/5] h-full w-full"
      />
      {/* A dark scrim so the name reads on the photo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl bg-gradient-to-t from-black/80 to-transparent max-md:h-3/5 max-md:from-black/85" />
      <div className="absolute top-2 right-2">
        <Social member={member} onPhoto />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
        <p className="text-[15px] font-medium tracking-[-0.015em] max-md:line-clamp-2 max-md:leading-snug md:truncate">
          {member.name}
        </p>
        <Role member={member} group={group} onPhoto />
      </div>
    </div>
  )
}

/** Everyone else: a compact card, name below the photo. */
function MemberCard({
  member,
  group,
}: Readonly<{ member: TeamMember; group: Group }>) {
  return (
    <div className="group">
      <div className="relative">
        <Photo
          member={member}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 17vw"
          className="aspect-[4/5]"
        />
        <div className="absolute top-2 right-2">
          <Social member={member} onPhoto />
        </div>
      </div>
      <p className="mt-3.5 text-[15px] font-medium tracking-[-0.015em] text-neutral-950 max-md:line-clamp-2 max-md:leading-snug md:truncate">
        {member.name}
      </p>
      <Role member={member} group={group} />
    </div>
  )
}

function GroupBlock({
  group,
  people,
  reduce,
}: Readonly<{ group: Group; people: TeamMember[]; reduce: boolean | null }>) {
  const t = useTranslations("company.team.groups")
  const lead = group.id === "leadership"
  return (
    <motion.section
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease }}
      aria-label={t(group.id)}
    >
      <div className="mb-5 flex items-center gap-3">
        <span
          className="grid size-8 place-items-center rounded-lg"
          style={{ background: `${group.tone}14`, color: group.tone }}
        >
          <group.icon className="size-4" />
        </span>
        <h3 className="text-[15px] font-medium text-neutral-950">
          {t(group.id)}
        </h3>
        <span className="text-[13px] text-neutral-400 tabular-nums">
          {people.length}
        </span>
        <span className="h-px flex-1 bg-neutral-200" />
      </div>
      {lead ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {people.map((m, i) => (
            <LeadTile key={m.id} member={m} big={i === 0} group={group} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-3 lg:grid-cols-6">
          {people.map((m) => (
            <MemberCard key={m.id} member={m} group={group} />
          ))}
        </div>
      )}
    </motion.section>
  )
}

export function OurTeamGrid({ members }: { readonly members: TeamMember[] }) {
  const t = useTranslations("company.team")
  const reduce = useReducedMotion()
  const [active, setActive] = useState<string>(ALL)

  const counts = new Map<string, number>()
  for (const m of members) {
    const g = groupOf(m.role).id
    counts.set(g, (counts.get(g) ?? 0) + 1)
  }
  const options = [
    { value: ALL, label: t("everyone"), count: members.length, icon: Users },
    ...GROUPS.filter((g) => counts.has(g.id)).map((g) => ({
      value: g.id,
      label: t(`groups.${g.id}`),
      tone: g.tone,
      icon: g.icon,
      count: counts.get(g.id),
    })),
  ]

  const blocks = GROUPS.map((group) => ({
    group,
    people: members.filter((m) => groupOf(m.role).id === group.id),
  })).filter(
    (b) => b.people.length > 0 && (active === ALL || b.group.id === active)
  )

  return (
    <div>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="lg:shrink-0">
          <Eyebrow className="text-muted-foreground">{t("eyebrow")}</Eyebrow>
          <SplitReveal
            id="team-heading"
            text={t("title")}
            className="mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-neutral-950"
          />
        </div>
        <FilterChips
          label={t("filterLabel")}
          value={active}
          onChange={setActive}
          options={options}
          className="lg:pb-2"
        />
      </div>

      <div className="mt-14 flex flex-col gap-16 lg:gap-20">
        <AnimatePresence mode="popLayout" initial={false}>
          {blocks.map(({ group, people }) => (
            <GroupBlock
              key={group.id}
              group={group}
              people={people}
              reduce={reduce}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
