"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { GithubIcon, LinkedInIcon } from "@/components/icons"
import type { TeamMember } from "@/lib/db/schema"

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
      {/* Filter tabs */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={activeTab === cat}
            onClick={() => setActiveTab(cat)}
            className={`h-10 rounded-full border px-5 text-sm transition-colors duration-200 ${
              activeTab === cat
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

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
              className="group flex flex-col rounded-2xl bg-muted p-3"
            >
              <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-neutral-200">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition-transform group-hover:scale-105"
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
                    <p className="mt-1 truncate font-label text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                      {member.role}
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
