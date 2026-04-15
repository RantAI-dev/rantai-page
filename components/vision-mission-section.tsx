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
		<section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
			<div className="mx-auto max-w-6xl">
				<MotionInView>
					<div className="grid gap-6 md:grid-cols-2">
						{/* Vision Card */}
						<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
							<p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">
								Our Vision
							</p>
							<h2 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
								Leading AI Innovation in Indonesia
							</h2>
							<p className="mb-8 text-sm leading-[1.7] text-[#888888]">
								To be Indonesia&apos;s leading AI products company — enabling
								government and enterprise to operate intelligently through
								production-grade AI platforms.
							</p>
							{/* <div className="relative overflow-hidden rounded-xl border border-white/10">
								<div className="relative aspect-[4/3]">
									<Image
										src="/vision-and-mission/vision-1.png"
										alt="Futuristic smart city powered by AI"
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-cover"
										loading="eager"
									/>
								</div>
							</div> */}
						</div>

						{/* Mission Card */}
						<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
							<p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#888888]">
								Our Mission
							</p>
							<h2 className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
								Building the Future of AI
							</h2>
							<div className="space-y-4 mb-8">
								{missions.map((mission, idx) => (
									<div key={idx} className="flex gap-3">
										<CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-[#888888]" />
										<p className="text-sm leading-[1.7] text-[#888888]">
											{mission}
										</p>
									</div>
								))}
							</div>
							{/* <div className="relative overflow-hidden rounded-xl border border-white/10">
								<div className="relative aspect-[4/3]">
									<Image
										src="/vision-and-mission/mission-1.png"
										alt="Team collaborating on AI dashboards"
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-cover"
										loading="eager"
									/>
								</div>
							</div> */}
						</div>
					</div>
				</MotionInView>
			</div>
		</section>
	);
}
