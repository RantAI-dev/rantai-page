"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRightIcon } from "lucide-react";
import { MotionInView } from "./motion-in-view";

const whatWeDo = [
	{
		number: "01",
		title: "AI Products",
		description:
			"Three enterprise AI platforms: Agents, Analytics, and ZeroCode. Purpose-built for government and enterprise use cases, our products are production-grade, deployed, and battle-tested.",
		href: "/products",
		image: "/what-we-do/ai-products.png",
		features: [
			"Advanced RAG Pipeline",
			"Natural Language to SQL",
			"Multi-Model Agentic Core",
			"Knowledge Base Management",
		],
	},
	{
		number: "02",
		title: "Engineering Services",
		description:
			"AI Engineering and Software Engineering — from strategy to production deployment. We help organizations build, deploy, and scale intelligent systems.",
		href: "/services",
		image: "/what-we-do/services.png",
		features: [
			"LLM Integration & RAG Pipelines",
			"Cloud Infrastructure & DevOps",
			"System Architecture & API Design",
			"AI Strategy Consulting",
		],
	},
	{
		number: "03",
		title: "Academy",
		description:
			"Practical, project-based education in AI engineering, software engineering, and data science. Developing the next generation of AI talent in Indonesia.",
		href: "/academy",
		image: "/what-we-do/academy.png",
		features: [
			"AI Engineering Bootcamp",
			"Software Engineering Track",
			"Data Science Fundamentals",
			"Project-Based Learning",
		],
	},
];

export function WhatWeDoSection() {
	const [activeIndex, setActiveIndex] = useState(0);
	const active = whatWeDo[activeIndex];

	return (
		<section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
			<div className="mx-auto max-w-6xl">
				<MotionInView>
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">
						What We Do
					</p>
					<h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
						We build enterprise AI platforms, deliver engineering services, and
						educate the next generation of AI talent.
					</h2>
				</MotionInView>

				<MotionInView>
					<div className="mt-16 grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
						{/* Left: Tab list */}
						<div className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
							{whatWeDo.map((item, index) => (
								<button
									key={item.number}
									type="button"
									onClick={() => setActiveIndex(index)}
									className={`group flex items-center gap-4 whitespace-nowrap rounded-lg px-4 py-4 text-left transition-all duration-200 lg:rounded-none lg:border-l-2 lg:px-6 ${
										activeIndex === index
											? "border-white bg-white/5 text-white lg:border-l-white"
											: "border-transparent text-[#888888] hover:text-white hover:bg-white/[0.02] lg:border-l-white/10"
									}`}
								>
									<span className="text-sm font-light opacity-50">
										{item.number}
									</span>
									<span className="text-sm font-medium">
										{item.title}
									</span>
								</button>
							))}
						</div>

						{/* Right: Active content */}
						<AnimatePresence mode="wait">
							<motion.div
								key={activeIndex}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.3, ease: "easeOut" }}
								className="flex flex-col gap-8"
							>
								<div>
									<p className="mb-3 text-sm leading-[1.7] text-[#888888]">
										{active.description}
									</p>

									<div className="mb-6 flex flex-wrap gap-2">
										{active.features.map((feature) => (
											<span
												key={feature}
												className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#999999]"
											>
												{feature}
											</span>
										))}
									</div>

									<Link
										href={active.href}
										className="group/link inline-flex items-center text-sm font-medium text-white transition-colors hover:text-[#cccccc]"
									>
										Learn more
										<ArrowRightIcon className="ml-1.5 size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
									</Link>
								</div>

								{/* Image */}
								<div className="relative overflow-hidden rounded-xl border border-white/10">
									<div className="relative aspect-[16/9]">
										<Image
											src={active.image}
											alt={active.title}
											fill
											sizes="(max-width: 768px) 100vw, 60vw"
											className="object-cover"
											loading="eager"
										/>
									</div>
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				</MotionInView>
			</div>
		</section>
	);
}
