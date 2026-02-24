import Link from "next/link";
import { MailIcon, MapPinIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function Footer() {
	return (
		<footer className="border-border/40 border-t bg-muted/10 px-4 py-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand - Mastra-style: logo + tagline */}
					<div className="space-y-3">
						<Link
							href="/"
							className="text-foreground flex items-center gap-1.5 font-semibold"
						>
							<span>Rant</span>
							<Badge variant="default" className="text-xs px-1.5 py-0">
								AI
							</Badge>
						</Link>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Enterprise AI Products & Engineering. Building production-ready AI
							platforms for government and enterprise.
						</p>
					</div>

					{/* Products */}
					<div className="space-y-3">
						<h4 className="text-foreground text-sm font-semibold">Products</h4>
						<nav className="flex flex-col gap-2">
							<Link
								href="/products#agents"
								className="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								RantAI Agents
							</Link>
							<Link
								href="/products#analytics"
								className="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								RantAI Analytics
							</Link>
							<Link
								href="/products#zerocode"
								className="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								RantAI ZeroCode
							</Link>
						</nav>
					</div>

					{/* Developers / Company */}
					<div className="space-y-3">
						<h4 className="text-foreground text-sm font-semibold">Company</h4>
						<nav className="flex flex-col gap-2">
							<Link
								href="/services"
								className="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								Services
							</Link>
							<Link
								href="/academy"
								className="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								Academy
							</Link>
							<Link
								href="/#contact"
								className="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								Contact
							</Link>
						</nav>
					</div>

					{/* Contact */}
					<div className="space-y-3">
						<h4 className="text-foreground text-sm font-semibold">
							Get in Touch
						</h4>
						<div className="text-muted-foreground space-y-2 text-sm">
							<p className="flex items-center gap-2">
								<MapPinIcon className="size-4 shrink-0" />
								Depok, West Java, Indonesia
							</p>
							<p className="flex items-center gap-2">
								<MailIcon className="size-4 shrink-0" />
								<a
									href="mailto:admin@rantai.dev"
									className="hover:text-foreground transition-colors"
								>
									admin@rantai.dev
								</a>
							</p>
						</div>
					</div>
				</div>

				<div className="border-border mt-8 border-t pt-6">
					<p className="text-muted-foreground text-center text-sm">
						&copy; {new Date().getFullYear()} RantAI. Enterprise AI Products &
						Engineering.
					</p>
				</div>
			</div>
		</footer>
	);
}
