"use client";

import Image from "next/image";
import { MotionInView } from "@/components/motion-in-view";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const team = [
	{
		name: "Raffy Aulia Adnan",
		role: "Chief Executive Officer (CEO)",
		image: "/team/Raffy.png",
	},
	{
		name: "Evan P. Hardinatha",
		role: "Chief Software Engineer",
		image: "/team/Evan.png",
	},
	{
		name: "Razka Athallah Adnan",
		role: "VP Scientist",
		image: "/team/Razka.png",
	},
	{
		name: "Mitchell Chandi",
		role: "VP Engineer",
		image: "/team/Mitchell.png",
	},
	{
		name: "Farrel Pujokusumo",
		role: "VP Data Science",
		image: "/team/Farrel.png",
	},
];

/* ------------------------------------------------------------------ */
/*  TeamCard                                                           */
/* ------------------------------------------------------------------ */

function TeamCard({ member }: { member: (typeof team)[number] }) {
	return (
		<div className="group">
			<div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
				<Image
					src={member.image}
					alt={member.name}
					className="object-cover transition-all duration-500 group-hover:scale-105"
					fill
					sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
				/>
				{/* Gradient fade */}
				<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
			</div>
			<h3 className="text-sm font-semibold text-white">{member.name}</h3>
			<p className="mt-0.5 text-xs text-[#888888]">{member.role}</p>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  TeamSection                                                        */
/* ------------------------------------------------------------------ */

export function TeamSection() {
	return (
		<section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
			<div className="mx-auto max-w-6xl">
				<MotionInView>
					<p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">
						Our Team
					</p>
					<h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Meet the Founding Team
					</h2>
					<p className="mb-12 max-w-2xl text-sm leading-[1.7] text-[#888888]">
						The people behind RantAI&apos;s mission
					</p>
				</MotionInView>

				<MotionInView>
					<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{team.map((member) => (
							<TeamCard key={member.name} member={member} />
						))}
					</div>
				</MotionInView>
			</div>
		</section>
	);
}
