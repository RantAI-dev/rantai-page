"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionInView } from "./motion-in-view";

const whatWeDo = [
	{
		title: "AI Products",
		description:
			"Three enterprise AI platforms: Agents, Analytics, and ZeroCode.",
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
		title: "Engineering Services",
		description:
			"AI Engineering and Software Engineering — from strategy to production deployment.",
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
		title: "Academy",
		description:
			"Practical, project-based education in AI engineering, software engineering, and data science.",
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
	return (
		<section className="w-full px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
			<div className="mx-auto max-w-6xl">
				<MotionInView>
					<h2 className="text-foreground mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
						What We Do
					</h2>
					<p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-base leading-relaxed">
						We build enterprise AI platforms, deliver engineering services, and
						educate the next generation of AI talent.
					</p>
				</MotionInView>

				<div className="space-y-8">
					{whatWeDo.map((item, index) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 30, scale: 0.95 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true, margin: "0px 0px -60px 0px" }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="sticky rounded-3xl border border-border bg-card shadow-xl overflow-hidden transition-shadow duration-300"
							style={{ top: `calc(10vh + ${index * 40}px)` }}
						>
							<div className="grid grid-cols-1 md:grid-cols-2 min-h-90">
								{/* Text content */}
								<div className="flex flex-col justify-center p-8 md:p-12 order-2 md:order-1">
									<h3 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl mb-3">
										{item.title}
									</h3>
									<p className="text-muted-foreground text-base leading-relaxed mb-6">
										{item.description}
									</p>
									<div className="flex flex-wrap gap-2 mb-6">
										{item.features.map((feature) => (
											<span
												key={feature}
												className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground"
											>
												{feature}
											</span>
										))}
									</div>
									<div>
										<Button variant="outline" size="sm" asChild>
											<Link href={item.href}>
												Learn more
												<ArrowRightIcon className="ml-1 size-3" />
											</Link>
										</Button>
									</div>
								</div>

								{/* Image */}
								<div className="relative min-h-60 md:min-h-full order-1 md:order-2">
									<Image
										src={item.image}
										alt={item.title}
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-cover"
										loading="eager"
									/>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
