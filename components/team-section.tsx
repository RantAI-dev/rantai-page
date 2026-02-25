"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MotionInView } from "@/components/motion-in-view";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
	type CarouselApi,
} from "@/components/ui/carousel";

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

function getAvatarUrl(name: string) {
	const encoded = encodeURIComponent(name);
	return `https://ui-avatars.com/api/?name=${encoded}&size=400&background=1a2530&color=5cb6f9&bold=true&format=svg`;
}

/* ------------------------------------------------------------------ */
/*  TeamCard                                                           */
/* ------------------------------------------------------------------ */

function TeamCard({ member }: { member: (typeof team)[number] }) {
	return (
		<div className="group relative select-none">
			<div className="relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 ease-out flex flex-col hover:shadow-md">
				{/* Image area */}
				<div className="relative aspect-3/4 w-full overflow-hidden">
					<Image
						src={member.image || getAvatarUrl(member.name)}
						alt={member.name}
						className="object-cover transition-all duration-500 group-hover:scale-105"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>

					{/* Gradient overlay */}
					<div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black via-black/70 to-transparent opacity-100" />

					{/* Content (name + role) */}
					<div className="absolute inset-0 flex flex-col justify-end p-5">
						<h3 className="text-lg font-bold text-white">{member.name}</h3>
						<p className="mt-0.5 text-sm text-white/80">{member.role}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/*  TeamSection                                                        */
/* ------------------------------------------------------------------ */

export function TeamSection() {
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		if (!api) return;

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);

	return (
		<section className="bg-muted/30 relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
			<div className="mx-auto max-w-6xl">
				<MotionInView>
					{/* Heading */}
					<div className="mb-12 text-center sm:mb-16">
						<h2 className="text-foreground mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
							Meet the Founding Team
						</h2>
						<p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-base">
							The people behind RantAI&apos;s mission
						</p>
					</div>

					{/* Carousel */}
					<Carousel
						setApi={setApi}
						opts={{
							align: "start",
							loop: true,
						}}
						className="mx-auto w-full max-w-5xl"
					>
						<CarouselContent className="-ml-3 sm:-ml-4">
							{team.map((member) => (
								<CarouselItem
									key={member.name}
									className="pl-3 sm:pl-4 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
								>
									<TeamCard member={member} />
								</CarouselItem>
							))}
						</CarouselContent>

						{/* Navigation arrows */}
						<CarouselPrevious className="hidden sm:inline-flex -left-10 lg:-left-14 border-border bg-card/80 backdrop-blur-sm text-foreground hover:bg-card hover:text-foreground" />
						<CarouselNext className="hidden sm:inline-flex -right-10 lg:-right-14 border-border bg-card/80 backdrop-blur-sm text-foreground hover:bg-card hover:text-foreground" />
					</Carousel>

					{/* Pagination dots */}
					{count > 0 && (
						<div className="mt-8 flex items-center justify-center gap-2">
							{Array.from({ length: count }).map((_, idx) => (
								<button
									key={idx}
									type="button"
									aria-label={`Go to slide ${idx + 1}`}
									className={cn(
										"h-1.5 rounded-full transition-all duration-300",
										current === idx
											? "w-6 bg-primary"
											: "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
									)}
									onClick={() => api?.scrollTo(idx)}
								/>
							))}
						</div>
					)}
				</MotionInView>
			</div>
		</section>
	);
}
