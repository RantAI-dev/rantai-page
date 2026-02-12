import Link from "next/link";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookCarousel } from "@/components/book-carousel";
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
	GraduationCapIcon,
	ArrowRightIcon,
	BookMarkedIcon,
	BuildingIcon,
	TargetIcon,
	TrendingUpIcon,
	RocketIcon,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Academy",
	description:
		"RantAI Academy — Book Publisher and Classes. Academy with GenAI Learning and Tailored Enterprise Solutions.",
};

/* ------------------------------------------------------------------ */
/*  Key Highlights                                                     */
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
];

/* ------------------------------------------------------------------ */
/*  Books                                                               */
/* ------------------------------------------------------------------ */

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
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AcademyPage() {
	return (
		<div className="bg-background text-foreground min-h-screen">
			<Navbar />

			<main>
				{/* Hero */}
				<section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
					<div className="bg-primary/5 absolute inset-0 -z-10 opacity-40" />
					<div className="mx-auto max-w-3xl text-center">
						<Badge variant="outline" className="mb-4">
							Book Publisher and Classes
						</Badge>
						<h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
							RantAI Academy
						</h1>
						<p className="text-muted-foreground mt-4 text-lg leading-relaxed">
							Academy with GenAI Learning and Tailored Enterprise Solutions.
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Button size="lg" asChild>
								<Link href="/#contact">
									Enroll Now <ArrowRightIcon className="ml-2 size-4" />
								</Link>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<Link href="#publications">View Publications</Link>
							</Button>
						</div>
					</div>
				</section>

				<Separator className="bg-border" />

				{/* Who Are We */}
				<section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
					<div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
						<div>
							<div className="text-primary mb-4">
								<GraduationCapIcon className="size-12" />
							</div>
							<Badge variant="outline" className="mb-4">
								Who Are We?
							</Badge>
							<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
								Leading in Advanced Education
							</h2>
						</div>
						<div className="text-muted-foreground space-y-4 text-base leading-relaxed">
							<p>
								RantAI Academy delivers advanced education in modern Software,
								AI, Simulation, and Blockchain, powered by GenAI and Rust
								language.
							</p>
							<p>
								Covering key disciplines like mathematics, physics, chemistry,
								biology, life sciences, material science, and earth sciences, we
								emphasize mastery of Numerical, Semi-numerical, Non-numerical,
								and Quantum algorithms. Whether you&apos;re tackling complex
								technologies or advancing in scientific computation, RantAI
								Academy provides the precise tools and expertise to excel.
							</p>
						</div>
					</div>
				</section>

				{/* Key Highlights */}
				<section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
					<div className="mx-auto max-w-6xl">
						<div className="grid gap-6 sm:grid-cols-3">
							{highlights.map((item) => (
								<Card key={item.title}>
									<CardHeader>
										<div className="text-primary mb-2">
											<item.icon className="size-8" />
										</div>
										<CardTitle className="text-base">{item.title}</CardTitle>
										<CardDescription className="leading-relaxed">
											{item.description}
										</CardDescription>
									</CardHeader>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* RantAI Publishing */}
				<section
					id="publications"
					className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
				>
					<div className="mb-4 text-center">
						<div className="text-primary mb-4 flex justify-center">
							<BookMarkedIcon className="size-12" />
						</div>
						<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
							RantAI Publishing
						</h2>
						<p className="text-muted-foreground mt-4 text-base">Our Books</p>
					</div>

					<BookCarousel books={books} />
				</section>

				{/* CTA */}
				<section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              RantAI Academy for Enterprises
						</h2>
						<p className="text-muted-foreground mt-4 text-base leading-relaxed">
              We offer domain-specific, customized books tailored for scientists and engineers in various industries. Our comprehensive resources include a GenAI prompts catalog, specialized use cases, and well-tested sample codes, all designed to meet the unique needs of your industry and empower your teams with practical, cutting-edge knowledge.
						</p>
						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Button size="lg" asChild>
								<Link href="/#contact">
									Contact Us <ArrowRightIcon className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
