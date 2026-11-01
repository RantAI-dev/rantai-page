import Link from "next/link"
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  ImageIcon,
  Plus,
  Users,
} from "lucide-react"
import { desc, sql } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { db } from "@/lib/db"
import {
  blogPosts,
  books,
  tags,
  teamMembers,
  thumbnailDesigns,
} from "@/lib/db/schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "always",
})

function formatRelativeTime(value: Date, now: Date) {
  const diffInSeconds = Math.round((value.getTime() - now.getTime()) / 1000)

  if (Math.abs(diffInSeconds) < 30) {
    return "just now"
  }

  const divisions = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ] as const

  let duration = diffInSeconds

  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(
        Math.round(duration),
        division.unit
      )
    }

    duration /= division.amount
  }
}

const toneStyles = {
  blue: {
    icon: "border-blue-500/25 bg-blue-500/15 text-blue-200",
  },
  emerald: {
    icon: "border-emerald-500/25 bg-emerald-500/15 text-emerald-200",
  },
  amber: {
    icon: "border-amber-500/25 bg-amber-500/15 text-amber-200",
  },
  rose: {
    icon: "border-rose-500/25 bg-rose-500/15 text-rose-200",
  },
  violet: {
    icon: "border-violet-500/25 bg-violet-500/15 text-violet-200",
  },
} as const

const neutralIconStyle = "border-border bg-muted/40 text-muted-foreground"

type Tone = keyof typeof toneStyles

export default async function AdminDashboard() {
  const [
    [blogStats],
    [bookStats],
    [teamStats],
    [thumbnailStats],
    tagRows,
    postTagRows,
    recentPosts,
    recentThumbnails,
    recentBooks,
    recentTeam,
  ] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        drafts: sql<number>`count(*) filter (where ${blogPosts.published} = false)::int`,
        missingThumbnail: sql<number>`count(*) filter (where ${blogPosts.thumbnail} is null or ${blogPosts.thumbnail} = '')::int`,
        missingAuthor: sql<number>`count(*) filter (where ${blogPosts.author} is null or ${blogPosts.author} = '')::int`,
        missingExcerpt: sql<number>`count(*) filter (where ${blogPosts.excerpt} = '')::int`,
      })
      .from(blogPosts),
    db
      .select({
        total: sql<number>`count(*)::int`,
        missingUrl: sql<number>`count(*) filter (where ${books.url} is null or ${books.url} = '')::int`,
      })
      .from(books),
    db
      .select({
        total: sql<number>`count(*)::int`,
        missingPhoto: sql<number>`count(*) filter (where ${teamMembers.imageUrl} is null or ${teamMembers.imageUrl} = '')::int`,
      })
      .from(teamMembers),
    db
      .select({
        total: sql<number>`count(*)::int`,
        missingPreview: sql<number>`count(*) filter (where ${thumbnailDesigns.previewUrl} is null or ${thumbnailDesigns.previewUrl} = '')::int`,
      })
      .from(thumbnailDesigns),
    db.select({ name: tags.name }).from(tags),
    db.select({ tag: blogPosts.tag }).from(blogPosts),
    db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        published: blogPosts.published,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .orderBy(desc(blogPosts.updatedAt))
      .limit(5),
    db
      .select({
        id: thumbnailDesigns.id,
        name: thumbnailDesigns.name,
        updatedAt: thumbnailDesigns.updatedAt,
      })
      .from(thumbnailDesigns)
      .orderBy(desc(thumbnailDesigns.updatedAt))
      .limit(5),
    db
      .select({
        id: books.id,
        name: books.name,
        updatedAt: books.updatedAt,
      })
      .from(books)
      .orderBy(desc(books.updatedAt))
      .limit(3),
    db
      .select({
        id: teamMembers.id,
        name: teamMembers.name,
        updatedAt: teamMembers.updatedAt,
      })
      .from(teamMembers)
      .orderBy(desc(teamMembers.updatedAt))
      .limit(3),
  ])

  const usedTags = new Set(postTagRows.map((row) => row.tag))
  const unusedTagCount = tagRows.filter((row) => !usedTags.has(row.name)).length
  const now = new Date()

  const statCards = [
    {
      title: "Blog Posts",
      value: blogStats.total,
      detail: pluralize(blogStats.drafts, "draft"),
      href: "/admin/blog",
      actionLabel: "New Blog Post",
      actionHref: "/admin/blog/new",
      icon: FileText,
      tone: "blue" as Tone,
    },
    {
      title: "Books",
      value: bookStats.total,
      detail: "academy entries",
      href: "/admin/books",
      actionLabel: "New Book",
      actionHref: "/admin/books/new",
      icon: BookOpen,
      tone: "amber" as Tone,
    },
    {
      title: "Team Members",
      value: teamStats.total,
      detail: "profiles",
      href: "/admin/team",
      actionLabel: "New Team Member",
      actionHref: "/admin/team/new",
      icon: Users,
      tone: "violet" as Tone,
    },
  ]

  const healthItems = [
    {
      label: "Blog posts missing thumbnail",
      count: blogStats.missingThumbnail,
      href: "/admin/blog",
    },
    {
      label: "Blog posts missing author",
      count: blogStats.missingAuthor,
      href: "/admin/blog",
    },
    {
      label: "Blog posts missing excerpt",
      count: blogStats.missingExcerpt,
      href: "/admin/blog",
    },
    {
      label: "Books missing external URL",
      count: bookStats.missingUrl,
      href: "/admin/books",
    },
    {
      label: "Team members missing photo",
      count: teamStats.missingPhoto,
      href: "/admin/team",
    },
    {
      label: "Tags not used by posts",
      count: unusedTagCount,
      href: "/admin/tags",
    },
    {
      label: "Thumbnail designs missing preview",
      count: thumbnailStats.missingPreview,
      href: "/admin/thumbnail",
    },
  ]

  const openHealthItems = healthItems.filter((item) => item.count > 0)

  const recentActivity = [
    ...recentPosts.map((post) => ({
      title: post.title,
      type: post.published ? "Published post" : "Draft post",
      href: `/admin/blog/${post.id}/edit`,
      updatedAt: post.updatedAt,
      icon: FileText,
      tone: "blue" as Tone,
    })),
    ...recentThumbnails.map((design) => ({
      title: design.name,
      type: "Thumbnail design",
      href: `/admin/thumbnail/${design.id}`,
      updatedAt: design.updatedAt,
      icon: ImageIcon,
      tone: "emerald" as Tone,
    })),
    ...recentBooks.map((book) => ({
      title: book.name,
      type: "Book",
      href: `/admin/books/${book.id}/edit`,
      updatedAt: book.updatedAt,
      icon: BookOpen,
      tone: "amber" as Tone,
    })),
    ...recentTeam.map((member) => ({
      title: member.name,
      type: "Team profile",
      href: `/admin/team/${member.id}/edit`,
      updatedAt: member.updatedAt,
      icon: Users,
      tone: "violet" as Tone,
    })),
  ]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 8)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Editorial shortcuts, content health, and recent CMS updates.
          </p>
        </div>
        <Badge variant={openHealthItems.length > 0 ? "secondary" : "outline"}>
          {openHealthItems.length > 0
            ? `${openHealthItems.length} health checks need attention`
            : "All content checks clear"}
        </Badge>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card
            key={stat.href}
            className="rounded-lg transition-colors hover:bg-muted/30"
          >
            <Link href={stat.href} className="block">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md border",
                      toneStyles[stat.tone].icon
                    )}
                  >
                    <stat.icon className="size-4" />
                  </span>
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-3 mt-4">
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.detail}</p>
                </div>
              </CardContent>
            </Link>
            <CardFooter className="p-3">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={stat.actionHref}>
                  <Plus data-icon="inline-start" />
                  {stat.actionLabel}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-md border",
                  neutralIconStyle
                )}
              >
                {openHealthItems.length > 0 ? (
                  <AlertCircle className="size-4" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
              </span>
              Content Health
            </CardTitle>
            <CardDescription>
              Fix the gaps that make published content feel unfinished.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {openHealthItems.length > 0 ? (
              openHealthItems.map((item, index) => (
                <div key={item.label} className="flex flex-col gap-3">
                  {index > 0 ? <Separator /> : null}
                  <Item variant={"outline"}>
                    <ItemMedia className="size-8 rounded-md border border-amber-500/25 bg-amber-500/10 text-amber-200">
                      <AlertCircle className="size-4" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{item.label}</ItemTitle>
                      <ItemDescription className="text-xs">
                        {pluralize(item.count, "item")} to review
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={item.href}>
                          Review
                          <ArrowRight data-icon="inline-end" />
                        </Link>
                      </Button>
                    </ItemActions>
                  </Item>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
                <CheckCircle2 className="size-5 text-emerald-200" />
                <div>
                  <p className="text-sm font-medium">Everything looks tidy</p>
                  <p className="text-xs text-muted-foreground">
                    No missing thumbnails, authors, previews, URLs, or profile
                    photos.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-md border",
                  neutralIconStyle
                )}
              >
                <ArrowRight className="size-4" />
              </span>
              Recent Activity
            </CardTitle>
            <CardDescription>
              The latest content touched across the CMS.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div
                  key={`${item.href}-${item.updatedAt.toISOString()}`}
                  className="flex flex-col gap-2"
                >
                  <Separator />
                  <Item asChild className="p-2 hover:bg-muted">
                    <Link href={item.href}>
                      <ItemMedia
                        className={cn(
                          "size-8 rounded-md border",
                          toneStyles[item.tone].icon
                        )}
                      >
                        <item.icon className="size-4" />
                      </ItemMedia>
                      <ItemContent className="min-w-0">
                        <ItemTitle className="max-w-full">
                          {item.title}
                        </ItemTitle>
                        <ItemDescription className="text-xs">
                          {item.type}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions className="ml-auto shrink-0 text-right">
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(item.updatedAt, now)}
                        </p>
                      </ItemActions>
                    </Link>
                  </Item>
                </div>
              ))
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium">No activity yet</p>
                <p className="text-xs text-muted-foreground">
                  Create or update content to populate this feed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
