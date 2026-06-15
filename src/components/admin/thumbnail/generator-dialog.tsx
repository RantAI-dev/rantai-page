"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ThumbnailGenerator } from "./generator"

interface ThumbnailGeneratorDialogProps {
  onUse: (url: string) => void
}

export function ThumbnailGeneratorDialog({
  onUse,
}: ThumbnailGeneratorDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Sparkles className="mr-2 size-4" />
          Create with generator
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[85vh] max-w-[90vw] flex-col gap-4 sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Thumbnail Generator</DialogTitle>
          <DialogDescription>
            Design a thumbnail and click “Use this thumbnail” to attach it to
            this post.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1">
          <ThumbnailGenerator
            onUse={(url) => {
              onUse(url)
              setOpen(false)
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
