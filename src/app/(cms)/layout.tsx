import type { Metadata } from "next"

import {
  baseMetadata,
  baseViewport,
  RootDocument,
} from "@/components/layout/root-document"

// Root layout for the CMS (admin, sign-in, previews): English only, and kept
// out of search results.
export const viewport = baseViewport

export const metadata: Metadata = {
  ...baseMetadata,
  robots: { index: false, follow: false },
}

export default function CmsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="en">{children}</RootDocument>
}
