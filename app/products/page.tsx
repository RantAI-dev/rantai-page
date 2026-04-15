import Link from "next/link";
import type { Metadata } from "next";
import {
	ArrowRightIcon,
	BotIcon,
	BarChart3Icon,
	CodeIcon,
	SearchIcon,
	MonitorSmartphoneIcon,
	UsersIcon,
	BookOpenIcon,
	MessageSquareIcon,
	LayersIcon,
	BrainCircuitIcon,
	DatabaseIcon,
	CpuIcon,
	FileCodeIcon,
	RocketIcon,
	SettingsIcon,
} from "lucide-react";

import { getAllPosts } from "@/lib/markdown";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MotionInView } from "@/components/motion-in-view";
import { BlogMain } from "@/components/blog-main";

export const metadata: Metadata = {
	title: "Products & News — RantAI",
	description:
		"RantAI builds and maintains three enterprise AI platforms: Agents, Analytics, and ZeroCode. Read the latest news and updates.",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const products = [
	{
		id: "agents",
		icon: BotIcon,
		name: "RantAI Agents",
		tagline: "Enterprise-grade AI agent platform",
		description:
			"Build intelligent, knowledge-driven applications with RAG capabilities, multi-channel communication, and human-in-the-loop workflows.",
		features: [
			{ title: "Advanced RAG Pipeline", description: "Hybrid search with LLM reranking for highly accurate retrieval.", icon: SearchIcon },
			{ title: "Multi-Channel Deployment", description: "One agent works on Platform, your Web, and Apps.", icon: MonitorSmartphoneIcon },
			{ title: "Human-in-the-Loop", description: "Seamlessly hand off complex cases to human operators.", icon: UsersIcon },
			{ title: "Knowledge Base Management", description: "Auto-ingest documents and turn them into actionable knowledge.", icon: BookOpenIcon },
		],
	},
	{
		id: "analytics",
		icon: BarChart3Icon,
		name: "RantAI Analytics",
		tagline: "Natural language to data insights",
		description:
			"Enterprise-grade analytics platform that enables anyone to query databases using natural language, powered by AI, RAG pipelines, and a semantic layer.",
		features: [
			{ title: "Natural Language to SQL", description: "Ask questions in plain English and get accurate SQL instantly.", icon: MessageSquareIcon },
			{ title: "Semantic Layer (MDL)", description: "A single source of truth for consistent metrics across all teams.", icon: LayersIcon },
			{ title: "Multi-LLM Support", description: "Switch between 100+ models (OpenAI, Claude, local) effortlessly.", icon: BrainCircuitIcon },
			{ title: "40+ Data Connectors", description: "Connect instantly to PostgreSQL, Snowflake, BigQuery, and more.", icon: DatabaseIcon },
		],
	},
	{
		id: "zerocode",
		icon: CodeIcon,
		name: "RantAI ZeroCode",
		tagline: "Autonomous AI development",
		description:
			"Let AI write your code completely with detailed steps. A fully autonomous development environment where AI Agents manage projects and write production software.",
		features: [
			{ title: "Multi-Model Agentic Core", description: "Powered by Claude, OpenCode, and other leading models for robust code generation.", icon: CpuIcon },
			{ title: "Autonomous Code Writing", description: "Writes code completely with detailed, transparent steps.", icon: FileCodeIcon },
			{ title: "AI Project Management", description: "Speed up development with ready-made AI templates.", icon: RocketIcon },
			{ title: "Full SDLC Automation", description: "Manages the entire Software Development Life Cycle from requirements to deployment.", icon: SettingsIcon },
		],
	},
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProductsPage() {
	const posts = getAllPosts();

	return (
		<div className="bg-background text-foreground min-h-screen flex flex-col">
			<Navbar />

			<main className="flex-1">
				{/* ── Page Header ─────────────────────────────────────────── */}
				<section className="border-b border-border px-6 py-16 sm:px-8 lg:px-12">
					<div className="mx-auto max-w-7xl">
						<MotionInView>
							<p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
								RantAI Platform
							</p>
							<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
								<h1 className="max-w-xl text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
									Products &amp; News
								</h1>
								<p className="max-w-sm font-mono text-sm leading-relaxed text-muted-foreground lg:text-right">
									Our enterprise AI platforms and the latest updates from the
									RantAI team — all in one place.
								</p>
							</div>
						</MotionInView>
					</div>
				</section>

				{/* ── Two-column layout ─────────────────────────────────────── */}
				<div className="mx-auto max-w-7xl px-6 sm:px-0">
					<div className="flex flex-col gap-0 lg:flex-row lg:divide-x lg:divide-border">

						{/* ── LEFT SIDEBAR: Products ────────────────────────────── */}
						<aside className="lg:w-72 xl:w-80 shrink-0 border-b border-border lg:border-b-0 lg:pr-8 py-12">
							<MotionInView>
								<p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Our Platforms
								</p>
							</MotionInView>

							<div className="flex flex-col gap-0 divide-y divide-border">
								{products.map((product, idx) => {
									const Icon = product.icon;
									return (
										<MotionInView
											key={product.id}
											transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
										>
											<div className="group py-6 flex flex-col gap-3">
												<div className="flex items-center gap-2.5">
													<Icon className="size-4 text-muted-foreground shrink-0" />
													<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
														{product.tagline}
													</span>
												</div>

												<h2 className="text-base font-medium text-foreground">
													{product.name}
												</h2>

												<p className="text-xs leading-relaxed text-muted-foreground">
													{product.description}
												</p>

												{/* Feature list */}
												<ul className="mt-1 flex flex-col gap-1.5">
													{product.features.map((feat) => {
														const FeatIcon = feat.icon;
														return (
															<li key={feat.title} className="flex items-center gap-2 text-xs text-muted-foreground">
																<FeatIcon className="size-3 shrink-0 text-muted-foreground/60" />
																{feat.title}
															</li>
														);
													})}
												</ul>

												<Link
													href="/#contact"
													className="mt-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground transition-colors hover:text-primary"
												>
													Get Started
													<ArrowRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
												</Link>
											</div>
										</MotionInView>
									);
								})}
							</div>
						</aside>

						{/* ── RIGHT MAIN AREA: Blog / News ──────────────────────── */}
						<div className="flex-1 min-w-0 lg:pl-12 py-12">
							<MotionInView>
								<div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
									<div>
										<p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
											Latest Updates
										</p>
										<h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
											News &amp; Announcements
										</h2>
									</div>
								</div>
							</MotionInView>

							<MotionInView transition={{ delay: 0.1 }}>
								<BlogMain posts={posts} />
							</MotionInView>
						</div>

					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
