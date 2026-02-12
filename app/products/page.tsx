import Link from "next/link";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
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
	RocketIcon,
	FileCodeIcon,
	SettingsIcon,
	ArrowRightIcon,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Products",
	description:
		"RantAI builds and maintains three enterprise AI platforms: Agents, Analytics, and ZeroCode.",
};

/* ------------------------------------------------------------------ */
/*  RantAI Agents                                                      */
/* ------------------------------------------------------------------ */

const agentsFeatures = [
	{
		title: "Advanced RAG Pipeline",
		description:
			"Hybrid search with LLM reranking for highly accurate retrieval.",
		icon: SearchIcon,
	},
	{
		title: "Multi-Channel Deployment",
		description: "One agent works on Platform, your Web, and Apps.",
		icon: MonitorSmartphoneIcon,
	},
	{
		title: "Human-in-the-Loop",
		description: "Seamlessly hand off complex cases to human operators.",
		icon: UsersIcon,
	},
	{
		title: "Knowledge Base Management",
		description:
			"Auto-ingest documents and turn them into actionable knowledge.",
		icon: BookOpenIcon,
	},
];

/* ------------------------------------------------------------------ */
/*  RantAI Analytics                                                   */
/* ------------------------------------------------------------------ */

const analyticsFeatures = [
	{
		title: "Natural Language to SQL",
		description:
			"Ask questions in plain English and get accurate SQL instantly.",
		icon: MessageSquareIcon,
	},
	{
		title: "Semantic Layer (MDL)",
		description:
			"A single source of truth for consistent metrics across all teams.",
		icon: LayersIcon,
	},
	{
		title: "Multi-LLM Support",
		description:
			"Switch between 100+ models (OpenAI, Claude, local) effortlessly.",
		icon: BrainCircuitIcon,
	},
	{
		title: "40+ Data Connectors",
		description:
			"Connect instantly to PostgreSQL, Snowflake, BigQuery, and more.",
		icon: DatabaseIcon,
	},
];

/* ------------------------------------------------------------------ */
/*  RantAI ZeroCode                                                    */
/* ------------------------------------------------------------------ */

const zerocodeFeatures = [
	{
		title: "Multi-Model Agentic Core",
		description:
			"Powered by various Agentic Coding Algorithms, including Claude, OpenCode, and other leading models for robust code generation.",
		icon: CpuIcon,
	},
	{
		title: "Autonomous Code Writing",
		description:
			"Writes code completely with detailed, transparent steps, handling complex logic rather than just simple snippets.",
		icon: FileCodeIcon,
	},
	{
		title: "AI Project Management",
		description: "Speed up development with ready-made AI templates.",
		icon: RocketIcon,
	},
	{
		title: "Full SDLC Automation",
		description:
			"Manages the entire Software Development Life Cycle (SDLC), covering stages from requirement analysis and design to testing and deployment.",
		icon: SettingsIcon,
	},
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ProductsPage() {
	return (
		<div className="bg-background text-foreground min-h-screen">
			<Navbar />

			<main>
				{/* Hero */}
				<section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
					<div className="bg-primary/5 absolute inset-0 -z-10 opacity-40" />
					<div className="mx-auto max-w-3xl text-center">
						<Badge variant="outline" className="mb-4">
							Our Products
						</Badge>
						<h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
							Enterprise AI Platforms
						</h1>
						<p className="text-muted-foreground mt-4 text-lg leading-relaxed">
							We build and maintain three enterprise AI platforms designed for
							production deployment, scalability, and real-world impact.
						</p>
					</div>
				</section>

				<Separator className="bg-border" />

				{/* RantAI Agents */}
				<section
					id="agents"
					className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
				>
					<div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
						<div>
							<div className="text-primary mb-4">
								<BotIcon className="size-12" />
							</div>
							<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
								RantAI Agents
							</h2>
							<p className="text-muted-foreground mt-3 text-base leading-relaxed">
								Enterprise-grade AI agent platform for building intelligent,
								knowledge-driven applications with RAG capabilities,
								multi-channel communication, and human-in-the-loop workflows.
							</p>
							<Button className="mt-6" asChild>
								<Link href="/#contact">
									Get Started <ArrowRightIcon className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
						<div className="grid gap-6 sm:grid-cols-2">
							{agentsFeatures.map((feature) => (
								<Card key={feature.title}>
									<CardHeader>
										<div className="text-primary mb-2">
											<feature.icon className="size-6" />
										</div>
										<CardTitle className="text-base">
											{feature.title}
										</CardTitle>
										<CardDescription className="leading-relaxed">
											{feature.description}
										</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</div>
				</section>

				<Separator className="bg-border mx-auto max-w-6xl" />

				{/* RantAI Analytics */}
				<section
					id="analytics"
					className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
				>
					<div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
						<div className="order-2 lg:order-1 grid gap-6 sm:grid-cols-2">
							{analyticsFeatures.map((feature) => (
								<Card key={feature.title}>
									<CardHeader>
										<div className="text-primary mb-2">
											<feature.icon className="size-6" />
										</div>
										<CardTitle className="text-base">
											{feature.title}
										</CardTitle>
										<CardDescription className="leading-relaxed">
											{feature.description}
										</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
						<div className="order-1 lg:order-2">
							<div className="text-primary mb-4">
								<BarChart3Icon className="size-12" />
							</div>
							<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
								RantAI Analytics
							</h2>
							<p className="text-muted-foreground mt-3 text-base leading-relaxed">
								Enterprise-grade analytics platform that enables anyone to query
								databases using natural language, powered by AI, RAG pipelines,
								and a semantic layer.
							</p>
							<Button className="mt-6" asChild>
								<Link href="/#contact">
									Get Started <ArrowRightIcon className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				<Separator className="bg-border mx-auto max-w-6xl" />

				{/* RantAI ZeroCode */}
				<section
					id="zerocode"
					className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
				>
					<div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
						<div>
							<div className="text-primary mb-4">
								<CodeIcon className="size-12" />
							</div>
							<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
								RantAI ZeroCode
							</h2>
							<p className="text-muted-foreground mt-3 text-base leading-relaxed">
								Let AI write your code completely with detailed steps. A fully
								autonomous development environment where AI Agents manage
								projects and write production software using advanced agentic
								algorithms.
							</p>
							<Button className="mt-6" asChild>
								<Link href="/#contact">
									Get Started <ArrowRightIcon className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
						<div className="grid gap-6 sm:grid-cols-2">
							{zerocodeFeatures.map((feature) => (
								<Card key={feature.title}>
									<CardHeader>
										<div className="text-primary mb-2">
											<feature.icon className="size-6" />
										</div>
										<CardTitle className="text-base">
											{feature.title}
										</CardTitle>
										<CardDescription className="leading-relaxed">
											{feature.description}
										</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
							Ready to Get Started?
						</h2>
						<p className="text-muted-foreground mt-4 text-base leading-relaxed">
							Contact us to learn how our enterprise AI platforms can transform
							your organization.
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Button size="lg" asChild>
								<Link href="/#contact">
									Contact Us <ArrowRightIcon className="ml-2 size-4" />
								</Link>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<Link href="/services">View Services</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
