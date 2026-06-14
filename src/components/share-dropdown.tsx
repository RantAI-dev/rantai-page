"use client"

import { Link2 } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  XIcon,
  LinkedInIcon,
  ThreadsIcon,
  FacebookIcon,
} from "@/components/icons"

interface ShareDropdownProps {
  readonly url: string
  readonly title: string
  readonly children: React.ReactNode
}

export function ShareDropdown({ url, title, children }: ShareDropdownProps) {
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

  function shareThreads() {
    window.open(
      `https://www.threads.net/intent/post?text=${encodeURIComponent(title + " " + url)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    toast.success("Link copied!")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem onClick={copyLink}>
          <Link2 />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={shareX}>
          <XIcon />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareLinkedIn}>
          <LinkedInIcon />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareThreads}>
          <ThreadsIcon />
          Share on Threads
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareFacebook}>
          <FacebookIcon />
          Share on Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
