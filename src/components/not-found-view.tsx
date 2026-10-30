import { SiteShell } from "@/components/site-shell"

export function NotFoundView({
  title,
  description,
  children,
}: Readonly<{
  title: string
  description: string
  children: React.ReactNode
}>) {
  return (
    <SiteShell>
      <section className="mx-auto flex min-h-[60dvh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center">
        <p className="text-sm font-medium tracking-[0.08em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-5 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] font-medium tracking-[-0.045em] text-balance">
          {title}
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">{children}</div>
      </section>
    </SiteShell>
  )
}
