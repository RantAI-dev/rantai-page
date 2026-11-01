import { notFound } from "next/navigation"

// Any path that matches no page: show the not-found page in the visitor's
// language (the proxy routes every public URL through [locale]).
export default function CatchAll() {
  notFound()
}
