import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <section className="flex max-w-xl flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Page not found
          </h1>
          <p className="font-mono leading-relaxed text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Button asChild>
          <Link href="/">BACK TO HOME</Link>
        </Button>
      </section>
    </main>
  )
}
