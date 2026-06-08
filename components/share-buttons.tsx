"use client"

import { useEffect, useState } from "react"
import { Link2, Share2 } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { XIcon, LinkedInIcon } from "@/components/icons"

interface ShareButtonsProps {
  title: string
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    setUrl(globalThis.location.href)
  }, [])

  function shareX() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard!")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="xs" className="text-muted-foreground">
          <Share2 />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem onClick={shareX}>
          <XIcon />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareLinkedIn}>
          <LinkedInIcon />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyLink}>
          <Link2 />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
