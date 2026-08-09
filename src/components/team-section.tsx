"use client";

import { useEffect, useRef, useState } from "react";
import {
	AnimatePresence,
	motion,
	useInView,
	useReducedMotion,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const team = [
	{
		name: "Raffy Aulia Adnan",
		role: "Chief Executive Officer (CEO)",
		imageBlue: "/team/Raffy - Blue.png",
		imageBlack: "/team/Raffy - Black.png",
	},
	{
		name: "Evan P. Hardinatha",
		role: "Chief Software Engineer",
		imageBlue: "/team/Evan - Blue.png",
		imageBlack: "/team/Evan - Black.png",
	},
	{
		name: "Razka Athallah Adnan",
		role: "VP Scientist",
		imageBlue: "/team/Razka - Blue.png",
		imageBlack: "/team/Razka - Black.png",
	},
  {
    name: "Farrel Pujokusumo",
    role: "VP Data Science",
    imageBlue: "/team/Farrel - Blue.png",
    imageBlack: "/team/Farrel - Black.png",
  },
	{
		name: "Mitchell Chandi",
		role: "VP Engineer",
		imageBlue: "/team/Mitchell - Blue.png",
		imageBlack: "/team/Mitchell - Black.png",
	},
];

export function TeamSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (!isInView || reduceMotion) return;

		const timer = setTimeout(() => {
			setActiveIndex((prev) => (prev + 1) % team.length);
		}, 5000);
		return () => clearTimeout(timer);
	}, [activeIndex, isInView, reduceMotion]);

	return (
		<section
			ref={sectionRef}
			className="bg-background border-border border-t border-b relative overflow-hidden px-4 md:px-8 py-24 sm:py-32"
		>
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col lg:flex-row gap-16 lg:gap-8 justify-between">
					{/* Left side text items */}
					<motion.div
						initial={reduceMotion ? false : { opacity: 0, x: -28 }}
						animate={isInView ? { opacity: 1, x: 0 } : undefined}
						transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
						className="lg:w-1/3 flex flex-col justify-between"
					>
						<div>
							<h2 className="text-white text-4xl sm:text-5xl font-medium tracking-tight mb-4 leading-tight">
								Meet the Founding Team
							</h2>
							<p className="text-white/60 font-mono text-sm sm:text-base mb-6">
								The people behind RantAI&apos;s mission
							</p>
							<Link
								href="/our-team"
								className="inline-flex items-center gap-2 font-mono text-sm text-white/60 border border-white/20 px-4 py-2 hover:text-white hover:border-white/50 transition-colors duration-200 mb-12"
							>
								Meet the full team →
							</Link>
						</div>

						<div className="hidden lg:block relative mt-auto">
							<TeamInfo
								team={team}
								activeIndex={activeIndex}
								setActiveIndex={setActiveIndex}
								reduceMotion={Boolean(reduceMotion)}
							/>
						</div>
					</motion.div>

					{/* Right side Images */}
					<div className="lg:w-[60%] h-100 lg:h-125 flex gap-1 sm:gap-2">
						{team.map((member, i) => (
							<motion.div
								key={member.name}
								layout
								onClick={() => setActiveIndex(i)}
								className="relative cursor-pointer overflow-hidden rounded-sm"
								initial={reduceMotion ? false : { opacity: 0, y: 30 }}
								animate={{
									flex: activeIndex === i ? 5 : 1,
									opacity: isInView ? 1 : 0,
									y: isInView ? 0 : 30,
								}}
								whileHover={
									reduceMotion
										? undefined
										: { flex: activeIndex === i ? 5 : 1.5 }
								}
								transition={{
									flex: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
									opacity: {
										duration: 0.55,
										delay: reduceMotion ? 0 : 0.12 + i * 0.07,
									},
									y: {
										duration: 0.65,
										delay: reduceMotion ? 0 : 0.12 + i * 0.07,
										ease: [0.22, 1, 0.36, 1],
									},
								}}
							>
								{/* Black & White Image - Default */}
								<div className="absolute inset-0">
									<Image
										src={member.imageBlack}
										alt={member.name}
										fill
										className="object-cover object-center"
										sizes="(max-width: 768px) 100vw, 50vw"
									/>
								</div>

								{/* Blue Image - Active */}
								<motion.div
									className="absolute inset-0"
									initial={false}
									animate={{ opacity: activeIndex === i ? 1 : 0 }}
									transition={{ duration: 0.5 }}
								>
									<Image
										src={member.imageBlue}
										alt={`${member.name} Active`}
										fill
										className="object-cover object-center"
										sizes="(max-width: 768px) 100vw, 50vw"
									/>
								</motion.div>
							</motion.div>
						))}
					</div>

					{/* Nav & Info on mobile */}
					<div className="block lg:hidden mt-2">
						<TeamInfo
							team={team}
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
							reduceMotion={Boolean(reduceMotion)}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

interface TeamMember {
	readonly name: string;
	readonly role: string;
	readonly imageBlue: string;
	readonly imageBlack: string;
}

function TeamInfo({
	team,
	activeIndex,
	setActiveIndex,
	reduceMotion,
}: {
	readonly team: TeamMember[];
	readonly activeIndex: number;
	readonly setActiveIndex: (i: number) => void;
	readonly reduceMotion: boolean;
}) {
	return (
		<div>
			{/* Indicators */}
			<div className="flex gap-2 items-center mb-8">
				{team.map((_, i) => (
					<div
						key={i}
						className={`h-3 border border-white/40 cursor-pointer overflow-hidden relative transition-all duration-500 ease-out ${
							activeIndex === i ? "w-20" : "w-3 hover:border-white/80"
						}`}
						onClick={() => setActiveIndex(i)}
					>
						{activeIndex === i && (
							<motion.div
								className="h-full bg-white origin-left"
								initial={reduceMotion ? false : { scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{
									duration: reduceMotion ? 0 : 5,
									ease: "linear",
								}}
								key={`progress-${i}`}
							/>
						)}
					</div>
				))}
			</div>

			{/* active member details */}
			<div className="h-24">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeIndex}
						initial={reduceMotion ? false : { opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						exit={reduceMotion ? undefined : { opacity: 0, y: -15 }}
						transition={{
							duration: reduceMotion ? 0 : 0.4,
							ease: "backOut",
						}}
					>
						<h3 className="text-white text-2xl sm:text-3xl font-medium tracking-tight">
							{team[activeIndex].name}
						</h3>
						<p className="text-white/60 font-mono text-sm sm:text-base mt-2">
							{team[activeIndex].role}
						</p>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
