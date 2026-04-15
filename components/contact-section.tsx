import { MotionInView } from "@/components/motion-in-view";

export function ContactSection() {
	return (
		<section id="contact" className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
			<div className="mx-auto max-w-300">
				<MotionInView>
					<div className="rounded-xl border border-white/20 bg-[#010C14] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-12 lg:gap-24">
						{/* Left Side */}
						<div className="flex-1 flex flex-col justify-around">
							<h2 className="text-4xl lg:text-[56px] font-medium text-white max-w-lg mb-12 md:mb-0">
								Let&apos;s Build AI That Actually Works
							</h2>
							<p className="font-mono text-sm text-[#7483F1] max-w-85">
								We&apos;d love to hear from you — send us a message and
								we&apos;ll be in touch soon.
							</p>
						</div>

						{/* Right Side Form */}
						<div className="flex-1 max-w-lg w-full shrink-0">
							<form className="space-y-6">
								<div className="grid gap-6 sm:grid-cols-2">
									<div className="space-y-2">
										<label
											htmlFor="contact-name"
											className="font-mono text-xs font-semibold uppercase tracking-wider text-[#e2e8f0]"
										>
											Name
										</label>
										<input
											id="contact-name"
											name="name"
											placeholder="Your name"
											className="h-10 w-full rounded-md border border-white/5 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#6b7280] focus:border-white/20 focus:outline-none"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="contact-email"
											className="font-mono text-xs font-semibold uppercase tracking-wider text-[#e2e8f0]"
										>
											Email
										</label>
										<input
											id="contact-email"
											name="email"
											type="email"
											placeholder="your@email.com"
											className="h-10 w-full rounded-md border border-white/5 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#6b7280] focus:border-white/20 focus:outline-none"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="contact-organization"
										className="font-mono text-xs font-semibold uppercase tracking-wider text-[#e2e8f0]"
									>
										Organization
									</label>
									<input
										id="contact-organization"
										name="organization"
										placeholder="Your company or institution"
										className="h-10 w-full rounded-md border border-white/5 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[#6b7280] focus:border-white/20 focus:outline-none"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="contact-message"
										className="font-mono text-xs font-semibold uppercase tracking-wider text-[#e2e8f0]"
									>
										Message
									</label>
									<textarea
										id="contact-message"
										name="message"
										placeholder="Tell us about your project or requirements..."
										rows={4}
										className="w-full rounded-md border border-white/5 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-[#6b7280] focus:border-white/20 focus:outline-none"
									/>
								</div>
								<div className="flex justify-end pt-2">
									<button
										type="submit"
										className="font-mono text-[13px] font-semibold tracking-wider text-[#050a11] uppercase bg-white px-6 py-2.5 rounded hover:bg-white/90 transition-colors"
									>
										Submit Message
									</button>
								</div>
							</form>
						</div>
					</div>
				</MotionInView>
			</div>
		</section>
	);
}
