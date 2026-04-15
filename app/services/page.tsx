import Link from "next/link";
import type { Metadata } from "next";
import {
	ArrowRightIcon,
	CheckCircle2Icon,
	CodeIcon,
	RefreshCwIcon,
	ZapIcon,
	BrainCircuitIcon,
} from "lucide-react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MotionInView } from "@/components/motion-in-view";

export const metadata: Metadata = {
	title: "Services — RantAI",
	description:
		"Scientific Technology Consulting — tailored solutions in legacy app modernization, software performance optimization, full-stack development, and advanced machine learning operations.",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const services = [
	{
		id: "modernization",
		icon: RefreshCwIcon,
		name: "Legacy App Modernization",
		tagline: "Revitalize aging systems",
		description:
			"We analyze your existing codebase and documentation, then rebuild it with human-in-the-loop multi-agent AI coders — delivering modern, maintainable software built on Rust.",
		features: [
			"Human In-Loop Multi-Agents AI Coder",
			"Existing Source Codes and Documentations",
			"New Codes and Algorithms Based on Rust",
		],
	},
	{
		id: "fullstack",
		icon: CodeIcon,
		name: "Full Stack Software Development",
		tagline: "End-to-end product engineering",
		description:
			"From Figma design to production deployment — our AI-assisted developers build performant, full-stack applications using modern tooling and Rust at the core.",
		features: [
			"Human In-Loop AI Multi-Agents AI Developers",
			"Figma Design",
			"Full Stack Applications Based on Rust",
		],
	},
	{
		id: "security",
		icon: ZapIcon,
		name: "Software Security & Performance",
		tagline: "Optimize and harden your systems",
		description:
			"Our multi-agent AI optimizer analyzes your source code or compiled binaries to identify vulnerabilities, eliminate bottlenecks, and deliver Rust-based rewrites for maximum performance.",
		features: [
			"Human In-Loop Multi-Agents AI Optimizer",
			"Existing Source Codes or Compiled Binaries",
			"New Codes and Algorithms Based on Rust",
		],
	},
	{
		id: "mlops",
		icon: BrainCircuitIcon,
		name: "Multi-Cloud ML Engineering & Operations",
		tagline: "Production-grade machine learning",
		description:
			"End-to-end machine learning engineering and operations, from model training and evaluation to CPU/GPU/TPU optimized inference serving across multi-cloud environments.",
		features: [
			"Human In-Loop Multi-Agents MLEng and MLOps AI Optimizer",
			"Machine Learning and Deep Learning Models",
			"CPU/GPU/TPU Optimized Model Serving for Inference",
		],
	},
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ServicesPage() {
	return (
		<div className="bg-background text-foreground min-h-screen flex flex-col">
			<Navbar />

			<main className="flex-1">
				{/* ── Page Header ─────────────────────────────────────────── */}
				<section className="border-b border-border px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
					<div className="mx-auto max-w-7xl">
						<MotionInView>
							<p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
								Scientific Technology Consulting
							</p>
							<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
								<h1 className="max-w-2xl text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
									RantAI Services
								</h1>
								<p className="max-w-md font-mono text-sm leading-relaxed text-muted-foreground lg:text-right">
									Tailored solutions in legacy app modernization, software
									performance optimization, full-stack development, and advanced
									machine learning operations.
								</p>
							</div>
						</MotionInView>
					</div>
				</section>

				{/* ── Services ─────────────────────────────────────────────── */}
				<section className="px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
					<div className="mx-auto max-w-7xl">
						<MotionInView>
							<p className="mb-12 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
								Our Expertise
							</p>
						</MotionInView>

						<div className="flex flex-col divide-y divide-border">
							{services.map((service, idx) => {
								const Icon = service.icon;
								return (
									<MotionInView
										key={service.id}
										transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
									>
										<div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:py-16">
											{/* Left — service info */}
											<div className="flex flex-col justify-between gap-6">
												<div>
													<div className="mb-4 flex items-center gap-3">
														<Icon className="size-6 text-primary" />
														<span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
															{service.tagline}
														</span>
													</div>
													<h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
														{service.name}
													</h2>
													<p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
														{service.description}
													</p>
												</div>
												<Link
													href="/#contact"
													className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:text-primary"
												>
													Get in Touch
													<ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
												</Link>
											</div>

											{/* Right — feature list as cells */}
											<div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
												{service.features.map((feat, i) => (
													<div
														key={i}
														className="flex items-start gap-3 bg-background p-6 transition-colors hover:bg-muted/30"
													>
														<CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
														<p className="text-sm leading-relaxed text-foreground">
															{feat}
														</p>
													</div>
												))}
											</div>
										</div>
									</MotionInView>
								);
							})}
						</div>
					</div>
				</section>

				{/* ── CTA ──────────────────────────────────────────────────── */}
				<section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
					<div className="mx-auto max-w-7xl">
						<MotionInView>
							<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
								<div className="max-w-xl">
									<p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
										Work With Us
									</p>
									<h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
										Let&apos;s talk about your{" "}
										<span className="text-primary">next project</span>.
									</h2>
									<p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
										Ready to transform your business with cutting-edge technology?
										Get in touch and we&apos;ll find the right solution.
									</p>
								</div>
								<div className="flex flex-col gap-3 sm:flex-row">
									<Link
										href="/#contact"
										className="group inline-flex items-center gap-2 border border-foreground px-6 py-3 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
									>
										Contact Us
										<ArrowRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
									</Link>
									<Link
										href="/products"
										className="inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
									>
										View Products
									</Link>
								</div>
							</div>
						</MotionInView>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
