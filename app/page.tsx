import Link from "next/link";

import { MotionInView } from "@/components/motion-in-view";
import { HeroSection } from "@/components/hero-section";
import { VisionMissionSection } from "@/components/vision-mission-section";
import { WhyRantaiSection } from "@/components/why-rantai-section";
import { PartnersSection } from "@/components/partners-section";
import { TeamSection } from "@/components/team-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	BotIcon,
	BarChart3Icon,
	CodeIcon,
	BrainCircuitIcon,
	ServerIcon,
	GraduationCapIcon,
	ArrowRightIcon,
	CheckCircle2Icon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const products = [
	{
		title: "RantAI Agents",
		description:
			"Enterprise-grade AI agent platform for building intelligent, knowledge-driven applications with RAG capabilities, multi-channel communication, and human-in-the-loop workflows.",
		icon: BotIcon,
		href: "/products#agents",
		features: [
			"Advanced RAG Pipeline",
			"Multi-Channel Deployment",
			"Human-in-the-Loop",
			"Knowledge Base Management",
		],
	},
	{
		title: "RantAI Analytics",
		description:
			"Enterprise-grade analytics platform that enables anyone to query databases using natural language, powered by AI, RAG pipelines, and a semantic layer.",
		icon: BarChart3Icon,
		href: "/products#analytics",
		features: [
			"Natural Language to SQL",
			"Semantic Layer (MDL)",
			"Multi-LLM Support",
			"40+ Data Connectors",
		],
	},
	{
		title: "RantAI ZeroCode",
		description:
			"A fully autonomous development environment where AI Agents manage projects and write production software using advanced agentic algorithms.",
		icon: CodeIcon,
		href: "/products#zerocode",
		features: [
			"Multi-Model Agentic Core",
			"Autonomous Code Writing",
			"AI Project Management",
			"Full SDLC Automation",
		],
	},
];

const services = [
	{
		title: "AI Engineering",
		description:
			"LLM integration, RAG pipelines, agent architectures, fine-tuning, MLOps, and AI strategy consulting.",
		icon: BrainCircuitIcon,
	},
	{
		title: "Software Engineering",
		description:
			"Cloud infrastructure, microservices, full-stack development, DevOps/SRE, system architecture, and API design.",
		icon: ServerIcon,
	},
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Page() {
	return (
		<div className="bg-background text-foreground min-h-screen">
			<Navbar />

			<main>
				<HeroSection />

				{/* Vision & Mission */}
				<VisionMissionSection />

				{/* What We Do */}
				<section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
					<MotionInView>
						<h2 className="text-foreground mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
							What We Do
						</h2>
						<p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-base leading-relaxed">
							We build enterprise AI platforms, deliver engineering services,
							and educate the next generation of AI talent.
						</p>
						<div className="grid gap-6 sm:grid-cols-3">
							<Link href="/products" className="block">
								<Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
									<CardHeader>
										<div className="text-primary mb-2">
											<BotIcon className="size-8" />
										</div>
										<CardTitle>AI Products</CardTitle>
										<CardDescription>
											Three enterprise AI platforms: Agents, Analytics, and
											ZeroCode.
										</CardDescription>
									</CardHeader>
									<CardContent className="mt-auto"></CardContent>
									<CardFooter className="bg-card text-card-foreground border-0 opacity-0 group-hover:opacity-100 transition-opacity pt-0">
										<Button variant="link" className="px-0 pointer-events-none">
											Learn more <ArrowRightIcon className="ml-1 size-3" />
										</Button>
									</CardFooter>
								</Card>
							</Link>

							<Link href="/services" className="block">
								<Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
									<CardHeader>
										<div className="text-primary mb-2">
											<ServerIcon className="size-8" />
										</div>
										<CardTitle>Engineering Services</CardTitle>
										<CardDescription>
											AI Engineering and Software Engineering — from strategy to
											production deployment.
										</CardDescription>
									</CardHeader>
									<CardContent className="mt-auto"></CardContent>
									<CardFooter className="bg-card text-card-foreground border-0 opacity-0 group-hover:opacity-100 transition-opacity pt-0">
										<Button variant="link" className="px-0 pointer-events-none">
											Learn more <ArrowRightIcon className="ml-1 size-3" />
										</Button>
									</CardFooter>
								</Card>
							</Link>

							<Link href="/academy" className="block">
								<Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
									<CardHeader>
										<div className="text-primary mb-2">
											<GraduationCapIcon className="size-8" />
										</div>
										<CardTitle>Academy</CardTitle>
										<CardDescription>
											Practical, project-based education in AI engineering,
											software engineering, and data science.
										</CardDescription>
									</CardHeader>
									<CardContent className="mt-auto"></CardContent>
									<CardFooter className="bg-card text-card-foreground border-0 opacity-0 group-hover:opacity-100 transition-opacity pt-0">
										<Button variant="link" className="px-0 pointer-events-none">
											Learn more <ArrowRightIcon className="ml-1 size-3" />
										</Button>
									</CardFooter>
								</Card>
							</Link>
						</div>
					</MotionInView>
				</section>

				{/* Products Overview */}
				<section
					id="products"
					className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
				>
					<div className="mx-auto max-w-6xl">
						<MotionInView>
							<h2 className="text-foreground mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
								Our Products
							</h2>
							<p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-base">
								We build and maintain three enterprise AI platforms.
							</p>
							<div className="grid gap-8 lg:grid-cols-3">
								{products.map((product) => (
									<Card
										key={product.title}
										className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
									>
										<CardHeader>
											<div className="text-primary mb-2">
												<product.icon className="size-8" />
											</div>
											<CardTitle>{product.title}</CardTitle>
											<CardDescription className="leading-relaxed">
												{product.description}
											</CardDescription>
										</CardHeader>
										<CardContent className="mt-auto space-y-3">
											<ul className="space-y-2">
												{product.features.map((feature) => (
													<li
														key={feature}
														className="text-muted-foreground flex items-center gap-2 text-sm"
													>
														<CheckCircle2Icon className="text-primary size-4 shrink-0" />
														{feature}
													</li>
												))}
											</ul>
											<Button
												variant="outline"
												size="sm"
												className="mt-4 w-full"
												asChild
											>
												<Link href={product.href}>
													Learn More <ArrowRightIcon className="ml-1 size-3" />
												</Link>
											</Button>
										</CardContent>
									</Card>
								))}
							</div>
						</MotionInView>
					</div>
				</section>

				{/* Services */}
				<section
					id="services"
					className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
				>
					<MotionInView>
						<div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
							<div>
								<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
									Engineering Services
								</h2>
								<p className="text-muted-foreground mt-2 text-base">
									We help companies in two core disciplines.
								</p>
							</div>
							<div className="grid gap-6 sm:grid-cols-2">
								{services.map((service) => (
									<Link key={service.title} href="/services" className="block">
										<Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
											<CardHeader>
												<div className="text-primary mb-2">
													<service.icon className="size-8" />
												</div>
												<CardTitle>{service.title}</CardTitle>
												<CardDescription className="leading-relaxed">
													{service.description}
												</CardDescription>
											</CardHeader>
											<CardContent className="mt-auto"></CardContent>
											<CardFooter className="bg-card text-card-foreground border-0 opacity-0 group-hover:opacity-100 transition-opacity pt-0">
												<Button
													variant="link"
													className="px-0 pointer-events-none"
												>
													Learn more <ArrowRightIcon className="ml-1 size-3" />
												</Button>
											</CardFooter>
										</Card>
									</Link>
								))}
							</div>
						</div>
					</MotionInView>
				</section>

				{/* Why RantAI */}
				<WhyRantaiSection />

				{/* Partners */}
				<PartnersSection />

				{/* Team */}
				<TeamSection />

				{/* Contact */}
				<section
					id="contact"
					className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
				>
					<MotionInView>
						<h2 className="text-foreground mb-2 text-center text-3xl font-bold tracking-tight sm:text-4xl">
							Let&apos;s Build the Future Together
						</h2>
						<p className="text-muted-foreground mb-8 text-center text-base">
							Ready to transform your organization with AI? Get in touch with
							us.
						</p>
						<Card className="transition-all duration-300 hover:shadow-lg">
							<CardContent className="pt-6">
								<form className="space-y-6">
									<div className="grid gap-6 sm:grid-cols-2">
										<Field>
											<FieldLabel>Name</FieldLabel>
											<Input placeholder="Your name" className="h-9" />
										</Field>
										<Field>
											<FieldLabel>Email</FieldLabel>
											<Input
												type="email"
												placeholder="your@email.com"
												className="h-9"
											/>
										</Field>
									</div>
									<Field>
										<FieldLabel>Organization</FieldLabel>
										<Input
											placeholder="Your company or institution"
											className="h-9"
										/>
									</Field>
									<Field>
										<FieldLabel>Message</FieldLabel>
										<Textarea
											placeholder="Tell us about your project or requirements..."
											rows={5}
										/>
									</Field>
									<Button type="submit" className="w-full" size="lg">
										Send Message
									</Button>
								</form>
							</CardContent>
						</Card>
					</MotionInView>
				</section>
			</main>

			<Footer />
		</div>
	);
}
