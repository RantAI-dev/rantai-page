import Link from "next/link"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

export default function BlogPostNotFound() {
  return (
    <div>
      <Navbar />
      <main className="flex min-h-dvh items-center justify-center bg-background px-4 pt-16">
        <section className="flex max-w-xl flex-col items-center gap-6 text-center">
          <p className="font-mono text-sm text-muted-foreground">404</p>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              Blog post not found
            </h1>
            <p className="font-mono leading-relaxed text-muted-foreground">
              This blog post may have been renamed, moved, or deleted.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/blog">BROWSE ARTICLES</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">BACK TO HOME</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
