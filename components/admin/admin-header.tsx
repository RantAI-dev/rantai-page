"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const breadcrumbLabels: Record<string, string> = {
  admin: "Dashboard",
  blog: "Blog",
  books: "Books",
  edit: "Edit",
  new: "New",
  team: "Team",
  thumbnail: "Thumbnail",
}

function getBreadcrumbLabel(segment: string) {
  return breadcrumbLabels[segment] ?? decodeURIComponent(segment)
}

function getBreadcrumbItems(pathname: string) {
  const segments = pathname.split("/").filter(Boolean)
  const items = [{ href: "/admin", label: "Dashboard" }]
  let href = ""

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index]
    href += `/${segment}`

    if (segment === "admin") {
      continue
    }

    const isHiddenDynamicSegment =
      segments[index + 1] === "edit" && !breadcrumbLabels[segment]

    if (isHiddenDynamicSegment) {
      continue
    }

    items.push({
      href,
      label: getBreadcrumbLabel(segment),
    })
  }

  return items
}

export function AdminHeader() {
  const pathname = usePathname()
  const items = getBreadcrumbItems(pathname)

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isCurrentPage = index === items.length - 1

            return (
              <Fragment key={item.href}>
                {index > 0 ? (
                  <BreadcrumbSeparator className="hidden md:block" />
                ) : null}
                <BreadcrumbItem
                  className={
                    index === 0 && !isCurrentPage
                      ? "hidden md:block"
                      : undefined
                  }
                >
                  {isCurrentPage ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
