"use client";

import { MotionInView } from "@/components/motion-in-view";
import BounceCards from "@/components/BounceCards";

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

export function TeamSection() {
	const images = team.map((member) => member.image);
	const imageAlt = team.map((member) => member.name);
	const transformStyles = [
		"rotate(5deg) translate(-250px)",
		"rotate(0deg) translate(-125px)",
		"rotate(-5deg)",
		"rotate(5deg) translate(125px)",
		"rotate(-5deg) translate(250px)",
	];

	return (
		<section className="bg-muted/30 relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
			<div className="mx-auto max-w-6xl">
				<MotionInView>
					<div className="flex flex-col gap-10 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-12 sm:py-8">
						<div className="max-w-xl text-left">
							<h2 className="text-foreground mb-4 text-3xl font-medium tracking-tight sm:text-4xl">
								Meet the Founding Team
							</h2>
							<p className="text-muted-foreground font-mono">
								The people behind RantAI&apos;s mission
							</p>
						</div>

						<BounceCards
							className="w-full max-w-[640px]"
							images={images}
							imageAlt={imageAlt}
							containerWidth={1000}
							containerHeight={360}
							animationDelay={0.9}
							animationStagger={0.3}
							easeType="elastic.out(1, 0.5)"
							transformStyles={transformStyles}
							enableHover
							cardClassName="border-white/80 border-8 bg-card"
							cardChildren={team.map((member) => (
								<div
									key={member.name}
									className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								>
									<h3 className="text-sm font-semibold text-white">
										{member.name}
									</h3>
									<p className="text-xs text-white/80">{member.role}</p>
								</div>
							))}
						/>
					</div>
				</MotionInView>
			</div>
		</section>
	);
}
