"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import type { ThumbnailDesignConfig } from "@/lib/thumbnail-design"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

import { ThumbnailGenerator } from "./generator"

interface ThumbnailEditorProps {
  design?: {
    id: string
    name: string
    updatedAt: string
    design: ThumbnailDesignConfig
  }
}

function formatLastEdited(value: string | null) {
  if (!value) return "Not saved yet"

  return `Last edited ${new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  })}`
}

export function ThumbnailEditor({ design }: ThumbnailEditorProps) {
  const router = useRouter()
  const [name, setName] = useState(design?.name ?? "Untitled thumbnail")
  const [actionsContainer, setActionsContainer] = useState<HTMLDivElement | null>(null)
  const [lastEdited, setLastEdited] = useState<string | null>(design?.updatedAt ?? null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave(payload: {
    design: ThumbnailDesignConfig
    previewUrl: string
  }) {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error("Name is required")
      return
    }

    const res = await fetch(
      design
        ? `/api/admin/thumbnail-designs/${design.id}`
        : "/api/admin/thumbnail-designs",
      {
        method: design ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          previewUrl: payload.previewUrl,
          design: payload.design,
        }),
      }
    )

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error ?? "Failed to save design")
    }

    const saved = (await res.json()) as {
      id: string
      name: string
      updatedAt?: string
    }
    setName(saved.name)
    setLastEdited(saved.updatedAt ?? new Date().toISOString())

    if (!design) {
      router.replace(`/admin/thumbnail/${saved.id}`)
    }
    router.refresh()
  }

  async function handleDelete() {
    if (!design) return

    setDeleting(true)
    const res = await fetch(`/api/admin/thumbnail-designs/${design.id}`, {
      method: "DELETE",
    })
    setDeleting(false)

    if (res.ok) {
      toast.success("Thumbnail deleted")
      router.push("/admin/thumbnail")
      router.refresh()
    } else {
      toast.error("Failed to delete thumbnail")
    }
  }

  return (
    <>
      <div className="flex h-[calc(100vh-112px)] min-h-0 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/thumbnail" aria-label="Back to thumbnail library">
                <ArrowLeft />
              </Link>
            </Button>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="max-w-md"
              aria-label="Thumbnail design name"
            />
            <span className="text-xs text-muted-foreground">
              {formatLastEdited(lastEdited)}
            </span>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <div
              ref={setActionsContainer}
              className="flex flex-wrap items-center justify-end gap-2"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <ThumbnailGenerator
            initialDesign={design?.design}
            onSaveDesign={handleSave}
            saveLabel={design ? "Save changes" : "Save design"}
            useLabel="Use for Blog"
            folder="assets"
            actionsContainer={actionsContainer}
            onDelete={design ? () => setDeleteOpen(true) : undefined}
            onUse={(url) =>
              router.push(`/admin/blog/new?thumbnail=${encodeURIComponent(url)}`)
            }
          />
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this thumbnail?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the saved editable design. Blog posts that already use an exported image are not changed.
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
    </>
  )
}
