"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRightIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

import { OutlineSection } from "@/components/outline-section"
import { MotionInView } from "@/components/motion-in-view"
import type { PartnerItem } from "../types"

export function PartnersSection({ partners }: { partners: PartnerItem[] }) {
  const [selectedPartner, setSelectedPartner] = useState(partners[0])

  return (
    <MotionInView>
      <OutlineSection className="flex flex-col">
        {/* Partners logo row */}
        <div className="grid h-75 grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center border-r border-b p-8">
            <h3 className="text-2xl font-normal lg:text-4xl">
              OUR
              <br />
              PARTNERS
            </h3>
          </div>
          {partners.map((partner, i) => (
            <button
              key={partner.id}
              onClick={() => setSelectedPartner(partner)}
              className={`group relative flex items-center justify-center border-b p-8 transition-colors lg:p-16 ${
                i < partners.length - 1 ? "border-r" : ""
              } ${selectedPartner.id === partner.id ? "bg-foreground/10" : "hover:bg-foreground/5"}`}
            >
              <div
                className={`relative h-full w-full transition-opacity ${
                  selectedPartner.id === partner.id
                    ? "opacity-100"
                    : "opacity-40 group-hover:opacity-70"
                }`}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              {selectedPartner.id === partner.id && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-foreground" />
              )}
            </button>
          ))}
        </div>

        {/* Product showcase row */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPartner.id + "-image"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex items-center justify-center overflow-hidden lg:aspect-auto lg:min-h-100"
            >
              <div className="relative w-full sm:h-75 lg:h-full">
                <Image
                  src={selectedPartner.showcase.image}
                  alt={selectedPartner.showcase.name}
                  fill
                  sizes="640px"
                  className="object-contain p-8"
                />
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-col justify-between p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPartner.id + "-text"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-0"
              >
                <h4 className="text-2xl tracking-tight lg:text-4xl">
                  {selectedPartner.showcase.name}
                </h4>
                <p className="font-mono text-base text-muted-foreground lg:text-lg">
                  {selectedPartner.showcase.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
            <Link
              href={selectedPartner.showcase.ctaHref}
              className="group flex items-center justify-between border bg-foreground px-4 py-4 text-background transition-colors duration-300"
            >
              <span className="font-mono font-medium tracking-wider uppercase">
                {selectedPartner.showcase.ctaLabel}
              </span>
              <ArrowRightIcon className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </OutlineSection>
    </MotionInView>
  )
}
