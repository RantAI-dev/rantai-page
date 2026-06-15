"use client"

import { useRouter } from "next/navigation"

import { ThumbnailGenerator } from "@/components/admin/thumbnail/generator"

export default function ThumbnailPage() {
  const router = useRouter()

  return (
    <div className="h-[calc(100vh-112px)] max-w-7xl space-y-6">
      <ThumbnailGenerator
        useLabel="Create blog with this thumbnail"
        onUse={(url) =>
          router.push(`/admin/blog/new?thumbnail=${encodeURIComponent(url)}`)
        }
      />
    </div>
  )
}
