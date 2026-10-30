import { Eyebrow } from "@/components/eyebrow"
import { MotionInView } from "@/components/motion-in-view"

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: Readonly<{
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
}>) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pt-16 pb-16 sm:px-10 sm:pt-24 lg:px-14 lg:pt-28 lg:pb-24">
      <MotionInView className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
        <div>
          <Eyebrow className="text-muted-foreground">{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.05em] text-balance text-foreground">
            {title}
          </h1>
        </div>
        {(description || children) && (
          <div className="lg:pb-3">
            {description && (
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
                {description}
              </p>
            )}
            {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
          </div>
        )}
      </MotionInView>
    </section>
  )
}
