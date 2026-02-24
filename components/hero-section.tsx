"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import DarkVeil from "@/components/DarkVeil";

const fadeInUp = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
};
const transition = { duration: 0.6, ease: "easeOut" as const };

export function HeroSection() {
	const { resolvedTheme } = useTheme();
	const isDark = resolvedTheme === "dark";

	return (
		<section className="relative h-dvh overflow-hidden -mt-16 px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32 lg:px-8">
			{/* Background — DarkVeil canvas */}
			<div className="pointer-events-none absolute inset-0 z-0 h-full w-full dark:invert-0 invert dark:opacity-100 opacity-60 transition-opacity duration-300">
				<DarkVeil
					hueShift={isDark ? 35 : 200}
					speed={0.3}
					noiseIntensity={0.03}
					scanlineIntensity={0}
					scanlineFrequency={0}
					warpAmount={0}
					resolutionScale={1}
				/>
			</div>

			<div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center text-center">
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
