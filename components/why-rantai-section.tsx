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
	},
	{
		title: "Production-Grade",
		description:
			"Deployed in real production environments — built for scale, security, and reliability.",
		icon: ShieldCheckIcon,
	},
	{
		title: "Local Expertise",
		description:
			"Deep understanding of Indonesian government regulations and compliance requirements.",
		icon: MapPinIcon,
	},
	{
		title: "No Vendor Lock-in",
		description:
			"Support for 100+ LLMs, allowing you to switch providers without rebuilding.",
		icon: UnlockIcon,
	},
	{
		title: "End-to-End Capability",
		description:
			"One partner for the full lifecycle, from AI strategy to deployment and support.",
		icon: SettingsIcon,
	},
	{
		title: "Open Standards",
		description:
			"Built on open-source foundations for full auditability and no black boxes.",
		icon: BookOpenIcon,
	},
];

function WhyRantaiCard({
	title,
	description,
	icon: Icon,
}: {
	title: string;
	description: string;
	icon: LucideIcon;
}) {
	return (
		<div className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/15">
			<div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-white/5">
				<Icon className="size-5 text-[#999999]" />
			</div>
			<h3 className="mb-2 text-base font-semibold text-white">
				{title}
			</h3>
			<p className="text-sm leading-[1.7] text-[#888888]">
				{description}
			</p>
		</div>
	);
}

export function WhyRantaiSection() {
	return (
		<section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
			<div className="mx-auto max-w-6xl">
				<MotionInView>
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">
						Why RantAI
					</p>
					<h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
						What sets us apart as your AI technology partner.
					</h2>
					<p className="mb-12 max-w-2xl text-sm leading-[1.7] text-[#888888]">
						We combine product-first thinking with deep engineering expertise to deliver AI solutions that actually work in production.
					</p>
				</MotionInView>
				<MotionInView>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{whyRantai.map((item) => (
							<WhyRantaiCard
								key={item.title}
								title={item.title}
								description={item.description}
								icon={item.icon}
							/>
						))}
					</div>
				</MotionInView>
			</div>
		</section>
	);
}
