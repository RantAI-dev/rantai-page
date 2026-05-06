"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { MotionInView } from "./motion-in-view";
import { motion } from "motion/react";

const news = [
	{
		tag: "Product",
		title: "RantAI Agents v2.0 — Multi-Model Agentic Core",
		excerpt:
			"Introducing our next-generation agentic platform with support for 100+ LLMs, advanced RAG pipelines, and autonomous task execution.",
		href: "/blog/rantai-agents-v2",
	},
	{
		tag: "Company",
		title: "RantAI Partners with Bohrlabs for Scientific AI",
		excerpt:
			"A strategic partnership to bring AI-powered analytics and automation to scientific research and engineering workflows.",
		href: "/blog/rantai-bohrlabs-partnership",
	},
	{
		tag: "Academy",
		title: "AI Engineering Bootcamp — Now Enrolling",
		excerpt:
			"Our intensive, project-based bootcamp covers LLM integration, RAG architectures, and production AI deployment.",
		href: "/academy",
	},
	{
		tag: "Product",
		title: "ZeroCode: Build AI Apps Without Code",
		excerpt:
			"Launch AI-powered applications in minutes with our no-code platform. From chatbots to data pipelines — no engineering required.",
		href: "/products",
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 30 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
	},
};

export const NewsSection = React.memo(function NewsSection() {
	return (
		<section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
			<div className="mx-auto max-w-7xl">
				<MotionInView>
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
						<div>
							<p className="mb-4 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
								Latest Updates
							</p>
							<h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
								News & Announcements
							</h2>
						</div>
						<Link
							href="/blog"
							className="group hidden items-center pb-2 text-sm font-mono text-foreground transition-colors hover:text-muted-foreground sm:flex"
						>
							View all posts
							<ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
					</div>
				</MotionInView>

				{/* Cards Section */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "0px 0px -100px 0px" }}
					className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 divide-y divide-border md:divide-y-0 md:divide-x"
				>
					{news.slice(0, 3).map((item, index) => {
						const paddingClasses =
							index === 0
								? "md:pr-8 md:pl-0"
								: index === 2
									? "md:pl-8 md:pr-0"
									: "md:px-8";

						return (
							<motion.div
								key={item.href}
								variants={itemVariants}
								className={`flex flex-col py-8 ${paddingClasses}`}
							>
								<Link
									href={item.href}
									className="group flex flex-col h-full flex-1"
								>
									<div className="mb-6">
										<span className="inline-flex items-center justify-center border border-white/20 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#888888] transition-colors group-hover:border-white/40 group-hover:text-[#bbbbbb]">
											{item.tag}
										</span>
									</div>
									<h3 className="mb-4 text-base sm:text-lg font-medium leading-snug text-white transition-colors group-hover:text-[#eeeeee]">
										{item.title}
									</h3>
									<p className="mb-12 flex-1 text-sm leading-relaxed text-[#888888] transition-colors group-hover:text-[#aaaaaa]">
										{item.excerpt}
									</p>
									<div className="flex items-center text-sm font-medium text-white pb-2">
										Learn more
										{/* Keeping the arrow for the card Link as well for consistency, but making it subtle */}
										<ArrowRightIcon className="ml-2 size-3.5 opacity-50 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
									</div>
								</Link>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Mobile "View all posts" button */}
				<MotionInView className="mt-8 border-t border-white/10 pt-8 sm:hidden">
					<Link
						href="/blog"
						className="group flex items-center justify-center text-sm font-mono text-white transition-colors"
					>
						View all posts
						<ArrowRightIcon className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
				</MotionInView>
			</div>
		</section>
	);
})
