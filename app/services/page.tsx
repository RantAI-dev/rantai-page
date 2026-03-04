import Link from "next/link";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	FadeUp,
	ScaleIn,
	StaggerContainer,
	StaggerItem,
} from "@/components/motion";
import {
	ArrowRightIcon,
	CheckCircle2Icon,
	CodeIcon,
	RefreshCwIcon,
	ZapIcon,
	BrainCircuitIcon,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Services",
	description:
		"Scientific Technology Consulting RantAI Services — Tailored solutions in legacy app modernization, software performance optimization, full-stack development, and advanced machine learning operations.",
};

/* ------------------------------------------------------------------ */
/*  Specialized Services                                               */
/* ------------------------------------------------------------------ */

const specializedServices = [
	{
		title: "Legacy App Modernization",
		icon: RefreshCwIcon,
		features: [
			"Human In-Loop Multi-Agents AI Coder",
			"Existing Source Codes and Documentations",
			"New Codes and Algorithms Based on Rust",
		],
	},
	{
		title: "Full Stack Software Development",
		icon: CodeIcon,
		features: [
			"Human In-Loop AI Multi-Agents AI Developers",
			"Figma Design",
			"Full Stack Applications Based on Rust",
		],
	},
	{
		title: "Software Security and Performance Optimization",
		icon: ZapIcon,
		features: [
			"Human In-Loop Multi-Agents AI Optimizer",
			"Existing Source Codes or Compiled Binaries",
			"New Codes and Algorithms Based on Rust",
		],
	},
	{
		title: "Multi-Cloud ML Engineering and ML Operations",
		icon: BrainCircuitIcon,
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
		<div className="bg-background text-foreground min-h-screen">
			<Navbar />

			<main>
				{/* Hero */}
				<section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
					<div className="bg-primary/5 absolute inset-0 -z-10 opacity-40" />
					<div className="mx-auto max-w-3xl text-center">
						<ScaleIn>
							<Badge variant="outline" className="mb-4">
								Scientific Technology Consulting
							</Badge>
						</ScaleIn>
						<FadeUp delay={0.1}>
							<h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
								RantAI Services
							</h1>
						</FadeUp>
						<FadeUp delay={0.2}>
							<p className="text-muted-foreground mt-4 text-lg leading-relaxed">
								Tailored solutions in legacy app modernization, software
								performance optimization, full-stack development, and advanced
								machine learning operations.
							</p>
						</FadeUp>
						<FadeUp delay={0.3}>
							<div className="mt-8">
								<Button size="lg" asChild>
									<Link href="/#contact">
										Get in Touch <ArrowRightIcon className="ml-2 size-4" />
									</Link>
								</Button>
							</div>
						</FadeUp>
					</div>
				</section>

				<Separator className="bg-border" />

				{/* About Us */}
				{/* <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
					<div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
						<div>
							<Badge variant="outline" className="mb-4">
								About Us
							</Badge>
							<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
								RantAI drives bold innovation, bringing fresh perspectives and
								cutting-edge expertise to transform your business.
							</h2>
						</div>
						<div className="text-muted-foreground space-y-4 text-base leading-relaxed">
							<p>
								RantAI&apos;s scientific technology consulting services provide
								tailored solutions for legacy app modernization, software
								performance optimization, full-stack software development, and
								advanced machine learning engineering and operations.
							</p>
							<p>
								We specialize in revitalizing outdated applications, enhancing
								software security and performance, and delivering comprehensive
								machine learning engineering (MLEng) and operations (MLOps) to
								meet your business needs.
							</p>
						</div>
					</div>
				</section> */}

				{/* Our Expertise */}
				<section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
					<div className="mx-auto max-w-6xl">
						<FadeUp>
							<div className="mb-12 text-center">
								<Badge variant="outline" className="mb-4">
									Our Expertise
								</Badge>
								<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
									Specialized Services
								</h2>
							</div>
						</FadeUp>
						<StaggerContainer
							className="grid gap-8 sm:grid-cols-2"
							stagger={0.12}
						>
							{specializedServices.map((service) => (
								<StaggerItem key={service.title}>
									<Card className="h-full">
										<CardHeader>
											<div className="text-primary mb-4">
												<service.icon className="size-10" />
											</div>
											<CardTitle className="text-xl">{service.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<ul className="space-y-3">
												{service.features.map((feature, idx) => (
													<li
														key={idx}
														className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
													>
														<CheckCircle2Icon className="text-primary mt-0.5 size-4 shrink-0" />
														<span>{feature}</span>
													</li>
												))}
											</ul>
										</CardContent>
									</Card>
								</StaggerItem>
							))}
						</StaggerContainer>
					</div>
				</section>

				{/* CTA */}
				<section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
					<FadeUp>
						<div className="text-center">
							<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
								Let&apos;s Talk about your{" "}
								<span className="text-primary">next project</span>.
							</h2>
							<p className="text-muted-foreground mt-4 text-base leading-relaxed">
								Ready to transform your business with cutting-edge technology?
								Get in touch with us.
							</p>
							<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
								<Button size="lg" asChild>
									<Link href="/#contact">
										Contact Us <ArrowRightIcon className="ml-2 size-4" />
									</Link>
								</Button>
								<Button variant="outline" size="lg" asChild>
									<Link href="/products">View Products</Link>
								</Button>
							</div>
						</div>
					</FadeUp>
				</section>
			</main>

			<Footer />
		</div>
	);
}
