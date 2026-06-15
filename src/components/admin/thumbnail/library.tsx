"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Copy,
  Edit,
  FileText,
  ImageIcon,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  EmptyState,
  EmptyStateAction,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"

export interface ThumbnailDesignListItem {
  id: string
  name: string
  previewUrl: string | null
  createdAt: string
  updatedAt: string
}

interface ThumbnailLibraryProps {
  designs: ThumbnailDesignListItem[]
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function ThumbnailLibrary({ designs }: ThumbnailLibraryProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<ThumbnailDesignListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filteredDesigns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return designs

    return designs.filter((design) =>
      design.name.toLowerCase().includes(normalizedQuery)
    )
  }, [designs, query])

  async function handleDuplicate(design: ThumbnailDesignListItem) {
    const res = await fetch(`/api/admin/thumbnail-designs/${design.id}/duplicate`, {
      method: "POST",
    })

    if (!res.ok) {
      toast.error("Failed to duplicate design")
      return
    }

    const copy = (await res.json()) as ThumbnailDesignListItem
    toast.success("Design duplicated")
    router.push(`/admin/thumbnail/${copy.id}`)
    router.refresh()
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setDeleting(true)
    const res = await fetch(`/api/admin/thumbnail-designs/${deleteTarget.id}`, {
      method: "DELETE",
    })
    setDeleting(false)

    if (res.ok) {
      toast.success("Design deleted")
      setDeleteTarget(null)
      router.refresh()
    } else {
      toast.error("Failed to delete design")
    }
  }

  function openEditor(design: ThumbnailDesignListItem) {
    router.push(`/admin/thumbnail/${design.id}`)
  }

  function handleCardKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    design: ThumbnailDesignListItem,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openEditor(design)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Thumbnail Library</h1>
          <p className="text-sm text-muted-foreground">
            Save reusable thumbnail drafts and duplicate them as starting points.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/thumbnail/new">
            <Plus />
            New Design
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search designs..."
          className="pl-9"
        />
      </div>

      {filteredDesigns.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDesigns.map((design) => (
            <Card
              key={design.id}
              role="link"
              tabIndex={0}
              aria-label={`Edit ${design.name}`}
              onClick={() => openEditor(design)}
              onKeyDown={(event) => handleCardKeyDown(event, design)}
              className="group/card cursor-pointer gap-0 rounded-lg py-0 transition-colors hover:bg-accent/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <CardContent className="px-0">
                <div className="relative aspect-video overflow-hidden border-b bg-muted">
                  {design.previewUrl ? (
                    <Image
                      src={design.previewUrl}
                      alt={design.name}
                      fill
                      className="object-cover transition-transform group-hover/card:scale-[1.02]"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageIcon />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardHeader className="py-4">
                <CardTitle className="truncate">{design.name}</CardTitle>
                <CardDescription>Updated {formatDate(design.updatedAt)}</CardDescription>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/thumbnail/${design.id}`}>
                          <Edit />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => void handleDuplicate(design)}>
                        <Copy />
                        Duplicate as Draft
                      </DropdownMenuItem>
                      {design.previewUrl ? (
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/blog/new?thumbnail=${encodeURIComponent(design.previewUrl)}`}
                          >
                            <FileText />
                            Use for Blog
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled>
                          <FileText />
                          Use for Blog
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteTarget(design)}
                      >
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState className="rounded-lg border">
          <EmptyStateIcon>
            <ImageIcon />
          </EmptyStateIcon>
          <EmptyStateTitle>
            {designs.length === 0 ? "No thumbnail designs yet" : "No designs found"}
          </EmptyStateTitle>
          <EmptyStateDescription>
            {designs.length === 0
              ? "Create your first editable thumbnail draft."
              : "Try a different search query."}
          </EmptyStateDescription>
          {designs.length === 0 ? (
            <EmptyStateAction>
              <Button asChild>
                <Link href="/admin/thumbnail/new">
                  <Plus />
                  New Design
                </Link>
              </Button>
            </EmptyStateAction>
          ) : null}
        </EmptyState>
      )}

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this design?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the saved editable recipe. Existing blog thumbnails that already use an exported image are not changed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
