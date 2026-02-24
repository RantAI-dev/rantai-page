"use client";

import TiltedCard from "./TiltedCard";
import { MotionInView } from "./motion-in-view";

const partners = [
	{
		name: "NexusQuantum Technologies",
		logo: "/partners/nqrust.png",
	},
	{
		name: "Quantum Investa Utama (QIU)",
		logo: "/partners/ventures.png",
	},
	{
		name: "Bohrlabs",
		logo: "/partners/bohrlabs.png",
	},
];

export function PartnersSection() {
	return (
		<section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
			<div className="mx-auto max-w-6xl">
				<MotionInView>
					<h2 className="text-foreground mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
						Meet Our Partners
					</h2>
					<p className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-base">
						We work closely with leading technology companies to deliver
						impactful solutions.
					</p>
					<div className="flex flex-col sm:flex-row justify-center place-items-center gap-4">
						{partners.map((partner) => (
							<TiltedCard
								key={partner.name}
								imageSrc={partner.logo}
								altText={partner.name}
								captionText={partner.name}
								containerHeight="400px"
								containerWidth="300px"
								imageHeight="400px"
								imageWidth="300px"
								scaleOnHover={1}
								rotateAmplitude={12}
								showMobileWarning={false}
								showTooltip={false}
								displayOverlayContent={true}
							/>
						))}
					</div>
				</MotionInView>
			</div>
		</section>
	);
}
