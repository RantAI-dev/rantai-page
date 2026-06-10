import { MotionInView } from "@/components/motion-in-view"
import { OutlineSection } from "@/components/outline-section"
import { ProductInfoPanel, ProductLink, ProductMediaPanel } from "./products-showcase"

export function ProductsRantAIClaw() {
  return (
    <MotionInView>
      <OutlineSection className="overflow-hidden bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <ProductMediaPanel className="bg-linear-to-b from-sky-400 to-blue-950 lg:border-r">
            <video
              src="https://r3djfhutjr8af8rp.public.blob.vercel-storage.com/videos/rantai-claw/claw-demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full rounded-[8px] border border-white/15 object-cover shadow-2xl shadow-blue-950/50"
            />
          </ProductMediaPanel>

          <ProductInfoPanel
            logo="/logo/RantAIClaw Dark.svg"
            logoAlt="RantAIClaw logo"
            title="RantAIClaw"
            subtitle="Extract, structure, and act on web data — at enterprise scale."
          >
            <div className="flex min-h-full flex-col justify-between gap-16 border-t p-8 lg:p-10">
              <div className="flex max-w-xl flex-col gap-3">
                <h3 className="text-2xl font-medium tracking-tight">
                  Autonomous AI Development
                </h3>
                <p className="text-lg leading-relaxed font-light text-muted-foreground">
                  Build software faster with AI agents that can understand
                  requirements, write code, execute tasks, and assist throughout
                  the development lifecycle.
                </p>
              </div>

              <ProductLink href="https://claw.rantai.dev/">
                Explore RantAIClaw
              </ProductLink>
            </div>
          </ProductInfoPanel>
        </div>
      </OutlineSection>
    </MotionInView>
  )
}
