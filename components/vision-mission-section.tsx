import Image from "next/image";
import { CheckCircle2Icon } from "lucide-react";
import { MotionInView } from "./motion-in-view";

const missions = [
	"Build AI products that are production-ready, not just demos — solving real business and government operational challenges.",
	"Democratize access to AI capabilities through platforms that don't require deep technical expertise to use.",
	"Provide engineering services that help organizations go from AI strategy to deployed, measurable outcomes.",
	"Develop local AI talent through hands-on education in AI engineering and software development.",
];

export function VisionMissionSection() {
	return (
		<section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
			<div className="mx-auto max-w-6xl space-y-20 lg:space-y-12">
				{/* Row 1 — Vision: Image left, Text right */}
				<MotionInView>
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
						{/* Image composition */}
						<div className="zigzag-image-wrapper">
							<Image
								src="/vision-and-mission/vision-1.png"
								alt="Futuristic smart city powered by AI"
								width={600}
								height={450}
								className="zigzag-image-main"
								loading="eager"
							/>
							<Image
								src="/vision-and-mission/vision-2.png"
								alt="Professionals reviewing AI analytics"
								width={330}
								height={250}
								className="zigzag-image-overlay zigzag-image-overlay bottom-0 right-0"
								loading="eager"
							/>
						</div>

						{/* Text */}
						<div>
							<h2 className="text-foreground mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
								Our Vision
							</h2>
							<p className="text-muted-foreground text-base leading-relaxed">
								To be Indonesia&apos;s leading AI products company — enabling
								government and enterprise to operate intelligently through
								production-grade AI platforms.
							</p>
						</div>
					</div>
				</MotionInView>

				{/* Row 2 — Mission: Text left, Image right */}
				<MotionInView>
					<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
						{/* Text */}
						<div className="order-2 lg:order-1">
							<h2 className="text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
								Our Mission
							</h2>
							<div className="grid gap-4 sm:grid-cols-2">
								{missions.map((mission, idx) => (
									<div key={idx} className="flex gap-3">
										<CheckCircle2Icon className="text-primary mt-0.5 size-5 shrink-0" />
										<p className="text-muted-foreground text-sm leading-relaxed">
											{mission}
										</p>
									</div>
								))}
							</div>
						</div>

						{/* Image composition */}
						<div className="zigzag-image-wrapper order-1 lg:order-2">
							<Image
								src="/vision-and-mission/mission-1.png"
								alt="Team collaborating on AI dashboards"
								width={600}
								height={450}
								className="zigzag-image-main ml-auto"
								loading="eager"
							/>
							<Image
								src="/vision-and-mission/mission-2.png"
								alt="Engineer developing AI solutions"
								width={330}
								height={250}
								className="zigzag-image-overlay zigzag-image-overlay bottom-0 left-0"
								loading="eager"
							/>
						</div>
					</div>
				</MotionInView>
			</div>
		</section>
	);
}
