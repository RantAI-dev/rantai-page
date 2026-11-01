import { createNavigation } from "next-intl/navigation"

import { routing } from "./routing"

// Locale-aware replacements for next/link and next/navigation. Use these in
// public pages so links keep the visitor's language (/id/...).
export const {
  Link,
  redirect,
  permanentRedirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing)
