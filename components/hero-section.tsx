"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";
import { useTheme } from "next-themes";

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
};
const transition = { duration: 0.6, ease: "easeOut" as const };

export function HeroSection() {
	const { resolvedTheme } = useTheme();
	const color = resolvedTheme === "dark" ? "#5CB6F9" : "#737373";

	return (
		<section className="relative overflow-hidden px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--primary)/12%,transparent)]" />
			<Particles
				className="absolute inset-0 z-0"
				quantity={200}
				ease={80}
				size={1}
				color={color}
				refresh
			/>
			<div className="mx-auto max-w-4xl text-center">
				<h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.1]">
					<motion.span
						className="block"
						{...fadeInUp}
						transition={{ ...transition, delay: 0 }}
					>
						Build Intelligent Systems.
					</motion.span>
					<motion.span
						className="text-primary block"
						{...fadeInUp}
						transition={{ ...transition, delay: 0.12 }}
					>
						Deploy with Confidence.
					</motion.span>
				</h1>
				<motion.p
					className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl"
					{...fadeInUp}
					transition={{ ...transition, delay: 0.24 }}
				>
					RantAI is an all-in-one platform for building AI-powered applications
					and agents — enterprise-grade, production-ready.
				</motion.p>
				<motion.div
					className="mt-10"
					{...fadeInUp}
					transition={{ ...transition, delay: 0.38 }}
				>
					<Button size="lg" className="h-11 px-6 text-base" asChild>
						<Link href="/products">
							Start Building
							<ArrowRightIcon className="ml-2 size-4" />
						</Link>
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
