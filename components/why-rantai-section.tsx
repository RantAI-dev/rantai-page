import Image from "next/image";
import {
	ShieldCheckIcon,
	FactoryIcon,
	MapPinIcon,
	UnlockIcon,
	SettingsIcon,
	BookOpenIcon,
} from "lucide-react";
import { MotionInView } from "./motion-in-view";
import type { LucideIcon } from "lucide-react";

const whyRantai = [
	{
		title: "Products, Not Just Services",
		description:
			"We build our own platforms to guarantee long-term roadmap continuity.",
		icon: FactoryIcon,
		image: "/why/why-products.png",
	},
	{
		title: "Production-Grade",
		description:
			"Deployed in real production environments — built for scale, security, and reliability.",
		icon: ShieldCheckIcon,
		image: "/why/why-production.png",
	},
	{
		title: "Local Expertise",
		description:
			"Deep understanding of Indonesian government regulations and compliance requirements.",
		icon: MapPinIcon,
		image: "/why/why-local.png",
	},
	{
		title: "No Vendor Lock-in",
		description:
			"Support for 100+ LLMs, allowing you to switch providers without rebuilding.",
		icon: UnlockIcon,
		image: "/why/why-vendor.png",
	},
	{
		title: "End-to-End Capability",
		description:
			"One partner for the full lifecycle, from AI strategy to deployment and support.",
		icon: SettingsIcon,
		image: "/why/why-e2e.png",
	},
	{
		title: "Open Standards",
		description:
			"Built on open-source foundations for full auditability and no black boxes.",
		icon: BookOpenIcon,
		image: "/why/why-open.png",
	},
];

function WhyRantaiCard({
	title,
	description,
	icon: Icon,
	image,
}: {
	title: string;
	description: string;
	icon: LucideIcon;
	image: string;
}) {
	return (
		<div className="bg-card ring-foreground/10 group flex flex-col overflow-hidden rounded-xl ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
			{/* Image wrapper */}
			<div className="relative h-48 w-full overflow-hidden">
				<Image
					src={image}
					alt={title}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					loading="eager"
				/>
				{/* Gradient fade overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
				{/* Icon badge */}
				<div className="text-primary absolute bottom-3 left-4">
					<Icon className="size-6 drop-shadow-md" />
				</div>
			</div>

			{/* Text area */}
			<div className="flex flex-1 flex-col p-5">
				<h3 className="text-foreground mb-1.5 text-lg font-semibold">
					{title}
				</h3>
				<p className="text-muted-foreground text-sm leading-relaxed">
					{description}
				</p>
			</div>
		</div>
	);
}

export function WhyRantaiSection() {
	return (
		<section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
			<div className="mx-auto max-w-6xl">
				<MotionInView>
					<h2 className="text-foreground mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
						Why RantAI?
					</h2>
					<p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-base">
						What sets us apart as your AI technology partner.
					</p>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{whyRantai.map((item) => (
							<WhyRantaiCard
								key={item.title}
								title={item.title}
								description={item.description}
								icon={item.icon}
								image={item.image}
							/>
						))}
					</div>
				</MotionInView>
			</div>
		</section>
	);
}
