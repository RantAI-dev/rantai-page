"use client"

import dynamic from "next/dynamic"
import { ArrowUp } from "lucide-react"

import { MotionInView } from "./motion-in-view"
import { ContactCard } from "@/components/contact-card"

const ColorBends = dynamic(() => import("@/components/ColorBends"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />,
})

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative overflow-hidden bg-background px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
      {/* ColorBends Background */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <ColorBends
          colors={["#055794", "#5EB6FA"]}
          rotation={40}
          speed={0.4}
          scale={1}
          frequency={1}
          warpStrength={1}
          noise={1}
          transparent
          autoRotate={0}
        />
        {/* Gradient fade at the top for smooth transition from previous section */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[30vh] bg-linear-to-b from-background to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Contact Us Card */}
        <MotionInView className="mb-20">
          <ContactCard />
        </MotionInView>

        {/* Footer Logo & Copyright */}
        <MotionInView>
          <div className="mt-12 flex flex-col items-end justify-between gap-8 md:flex-row md:gap-0">
            <div>
              <h1 className="mb-2 text-6xl leading-none tracking-tighter text-white md:text-8xl lg:text-[140px]">
                RantAI
              </h1>
              <div
                className="font-mono text-xs text-muted-foreground"
                suppressHydrationWarning
              >
                {"© " +
                  new Date().getFullYear() +
                  " RantAI. Enterprise AI Products & Engineering."}
              </div>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="group flex h-16 w-16 items-center justify-center border border-border transition-all duration-300 hover:border-white hover:bg-white/5 focus:outline-none active:scale-95 md:h-20 md:w-20"
            >
              <ArrowUp className="h-6 w-6 text-white/40 transition-colors duration-300 group-hover:text-white" />
            </button>
          </div>
        </MotionInView>
      </div>
    </footer>
  )
}
