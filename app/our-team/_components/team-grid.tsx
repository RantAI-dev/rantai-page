"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { TeamMember } from "@/lib/db/schema"
import { GithubIcon, LinkedinIcon } from "./social-icons"

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
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`border px-5 py-2 text-sm transition-colors duration-200 ${
              activeTab === cat
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="group relative overflow-hidden border border-border transition-all duration-300 hover:border-foreground/50"
            >
              {/* Photo */}
              <div className="group relative aspect-3/4 w-full overflow-hidden bg-muted">
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

              {/* Info */}
              <div className="absolute bottom-0 w-full p-2">
                <div className="flex w-full items-end justify-between gap-2 border bg-card p-4 group-hover:shadow-2xl">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {member.name}
                    </p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {member.github && (
                      <Link
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <GithubIcon />
                      </Link>
                    )}
                    {member.linkedin && (
                      <Link
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <LinkedinIcon />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
