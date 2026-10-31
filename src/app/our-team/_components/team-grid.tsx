"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { GithubIcon, LinkedInIcon } from "@/components/icons"
import { FilterChips } from "@/components/filter-chips"
import type { TeamMember } from "@/lib/db/schema"

/** A colour per kind of role, shared by the filters and the cards. */
function roleTone(role: string) {
  if (/chief|vp|head|lead/i.test(role)) return "#8b5cf6"
  if (/scien|data|research/i.test(role)) return "#14b8a6"
  if (/engineer|developer/i.test(role)) return "#3b82f6"
  if (/writer|design/i.test(role)) return "#f59e0b"
  return "#10b981"
}

export function OurTeamGrid({ members }: { readonly members: TeamMember[] }) {
  const categories = [
    "View All",
    ...Array.from(new Set(members.map((m) => m.role))),
  ]
  const [activeTab, setActiveTab] = useState("View All")

  const filtered =
    activeTab === "View All"
      ? members
      : members.filter((m) => m.role === activeTab)

  return (
    <div>
      <FilterChips
        label="Team roles"
        value={activeTab}
        onChange={setActiveTab}
        className="mb-10"
        options={categories.map((cat) => ({
          value: cat,
          tone: cat === "View All" ? undefined : roleTone(cat),
        }))}
      />

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No members in this category yet.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="group flex flex-col rounded-2xl bg-muted p-3 transition-colors hover:bg-neutral-200/70"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-neutral-200">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-6xl font-bold text-muted-foreground">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex w-full items-end justify-between gap-2 px-2 pt-4 pb-2">
                <div className="min-w-0">
                  <p className="truncate text-lg font-medium tracking-[-0.015em] text-foreground">
                    {member.name}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ background: roleTone(member.role) }}
                    />
                    <span className="truncate">{member.role}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {member.github && (
                    <Link
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on GitHub`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <GithubIcon size={16} />
                    </Link>
                  )}
                  {member.linkedin && (
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <LinkedInIcon size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
