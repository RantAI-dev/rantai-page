"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  GraduationCapIcon,
  TargetIcon,
  BuildingIcon,
  TrendingUpIcon,
  BookMarkedIcon,
} from "lucide-react"
import { motion } from "motion/react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookCarousel } from "@/components/book-carousel"
import { Badge } from "@/components/ui/badge"
import { MotionInView } from "@/components/motion-in-view"
import ShinyText from "@/components/ShinyText"
import { Button } from "@/components/ui/button"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}
const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
}
const transition = { duration: 0.6, ease: "easeOut" as const }

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const highlights = [
  {
    title: "Precision Learning",
    description:
      "Empower your skills with books and expert-led courses in Scientific Programming, AI, and Advanced Software Engineering using GENAI.",
    icon: TargetIcon,
  },
  {
    title: "Enterprise Ready",
    description:
      "Tailored enterprise academy solutions with custom content and specialized programming books to fit your needs.",
    icon: BuildingIcon,
  },
  {
    title: "Cutting-Edge Knowledge",
    description:
      "Master the latest advancements in software, machine learning, and scientific programming.",
    icon: TrendingUpIcon,
  },
]

const books = [
  {
    name: "TRPL",
    fullName: "The Rust Programming Language",
    imageUrl:
      "https://trpl.rantai.dev/images/P8MKxO7NRG2n396LeSEs-GwKBjxxYsu065L5olhOV-v1_hu8573314227613395896.webp",
  },
  {
    name: "DSAR",
    fullName: "Data Structures and Algorithms in Rust",
    imageUrl:
      "https://dsar.rantai.dev/images/cover_hu14882859514097680701.webp",
  },
  {
    name: "SDPR",
    fullName: "Software Design Patterns in Rust",
    imageUrl:
      "https://sdpr.rantai.dev/images/P8MKxO7NRG2n396LeSEs-GwKBjxxYsu065L5olhOV-v1_hu13590763850467375016.webp",
  },
  {
    name: "MLVR",
    fullName: "Machine Learning via Rust",
    imageUrl: "https://mlvr.rantai.dev/images/cover_hu5877552619247087723.webp",
  },
  {
    name: "LMVR",
    fullName: "Large Language Model via Rust",
    imageUrl: "https://lmvr.rantai.dev/images/cover_hu1807285381862821070.webp",
  },
  {
    name: "DLVR",
    fullName: "Deep Learning via Rust",
    imageUrl:
      "https://biz-merger.rantai.dev/images/cover_hu11256834211834767527.webp",
  },
  {
    name: "Biz-Merger",
    fullName: "Mastering Mergers and Acquisitions",
    imageUrl:
      "https://biz-merger.rantai.dev/images/cover_hu11256834211834767527.webp",
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AcademyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="border-b border-border px-6 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <motion.div
              {...fadeInLeft}
              transition={{ ...transition, delay: 0.8 }}
            >
              <Badge variant="outline" className="mb-4 uppercase">
                <ShinyText
                  text="Book Publisher & Classes"
                  speed={3}
                  delay={0}
                  color="#b5b5b5"
                  shineColor="#ffffff"
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                  className="font-mono text-sm tracking-wide text-muted-foreground"
                />
              </Badge>
            </motion.div>
            <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              <motion.span
                className="block"
                {...fadeInUp}
                transition={{ ...transition, delay: 0.12 }}
              >
                Advanced Education for the Future of Tech.
              </motion.span>
            </h1>
            <motion.p
              className="mt-6 max-w-2xl font-mono leading-relaxed text-muted-foreground"
              {...fadeInUp}
              transition={{ ...transition, delay: 0.36 }}
            >
              Advanced education in Software, AI, Simulation, and Blockchain —
              powered by GenAI and Rust. Tailored for individuals and
              enterprises alike.
            </motion.p>
          </div>
        </section>

        {/* ── Who Are We ───────────────────────────────────────────── */}
        <section className="border-b border-border px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr] lg:gap-24">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <GraduationCapIcon className="size-6 text-primary" />
                    <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      Who Are We
                    </span>
                  </div>
                  <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                    Leading in Advanced Education
                  </h2>
                </div>
                <div className="space-y-4 font-mono text-sm leading-relaxed text-muted-foreground">
                  <p>
                    RantAI Academy delivers advanced education in modern
                    Software, AI, Simulation, and Blockchain, powered by GenAI
                    and the Rust programming language.
                  </p>
                  <p>
                    Covering key disciplines like mathematics, physics,
                    chemistry, biology, life sciences, material science, and
                    earth sciences, we emphasize mastery of Numerical,
                    Semi-numerical, Non-numerical, and Quantum algorithms.
                    Whether you&apos;re tackling complex technologies or
                    advancing in scientific computation, RantAI Academy provides
                    the precise tools and expertise to excel.
                  </p>
                </div>
              </div>
            </MotionInView>
          </div>
        </section>

        {/* ── Key Highlights ───────────────────────────────────────── */}
        <section className="px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <p className="mb-12 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Why RantAI Academy
              </p>
            </MotionInView>

            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
              {highlights.map((item, idx) => {
                const Icon = item.icon
                return (
                  <MotionInView
                    key={item.title}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <div className="flex h-full flex-col gap-4 bg-background p-8 transition-colors hover:bg-muted/20">
                      <Icon className="size-6 text-primary" />
                      <h3 className="text-base font-medium text-foreground">
                        {item.title}
                      </h3>
                      <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </MotionInView>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Publications ─────────────────────────────────────────── */}
        <section
          id="publications"
          className="border-t border-border px-6 py-16 sm:px-8 lg:px-12 lg:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-4 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                    RantAI Publishing
                  </p>
                  <div className="flex items-center gap-3">
                    <BookMarkedIcon className="size-6 text-primary" />
                    <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                      Our Books
                    </h2>
                  </div>
                </div>
              </div>
            </MotionInView>

            <MotionInView transition={{ delay: 0.1 }}>
              <BookCarousel books={books} />
            </MotionInView>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────── */}
        <section className="px-6 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <MotionInView>
              <div className="flex flex-col items-center gap-5 text-center">
                <h2 className="max-w-lg text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  RantAI Academy for Enterprises
                </h2>
                <p className="max-w-md font-mono text-sm leading-relaxed text-muted-foreground">
                  Custom books for scientists and engineers with ready-to-use
                  GenAI prompts, real use cases, and proven code.
                </p>
                <Button size="lg" asChild>
                  <Link href="/#contact">
                    Contact Us
                    <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </MotionInView>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
