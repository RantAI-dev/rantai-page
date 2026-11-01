"use client"

import { useSyncExternalStore } from "react"

const noop = () => () => {}

/** The request that missed, shown like a log line. */
export function MissedRequest() {
  // Read in the browser only: the 404 page is rendered ahead of time, when
  // the missing path isn't known yet (a server value would not match).
  const path = useSyncExternalStore(
    noop,
    () => window.location.pathname,
    () => ""
  )
  return (
    <div className="flex items-center gap-2.5 border-b border-neutral-100 px-4 py-3 [font-family:ui-monospace,SFMono-Regular,Menlo,monospace] text-[12.5px]">
      <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-medium text-neutral-600">
        GET
      </span>
      <span className="min-w-0 flex-1 truncate text-neutral-800">{path}</span>
      <span className="rounded-md bg-rose-50 px-1.5 py-0.5 font-medium text-rose-700">
        404
      </span>
    </div>
  )
}
