import Link from "next/link";

import { MotionInView } from "@/components/motion-in-view";
import { HeroSection } from "@/components/hero-section";
import { VisionMissionSection } from "@/components/vision-mission-section";
import { WhyRantaiSection } from "@/components/why-rantai-section";
import { WhatWeDoSection } from "@/components/what-we-do-section";
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
import { BrainCircuitIcon, ServerIcon, ArrowRightIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

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
				<WhatWeDoSection />

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
