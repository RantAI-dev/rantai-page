"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/products", label: "Products" },
	{ href: "/services", label: "Services" },
	{ href: "/academy", label: "Academy" },
];

export function Navbar() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
    <header className="border-border mx-auto max-w-4xl rounded-lg sticky top-4 z-50 border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="text-foreground flex items-center gap-2 font-semibold"
					aria-label="RantAI Home"
				>
					<Image
						src="/rant-ai.png"
						alt="RantAI"
						width={120}
						height={40}
						className="h-8 w-auto"
						priority
					/>
					<span className="hidden sm:inline">RantAI</span>
				</Link>

				{/* Desktop nav */}
				<nav className="text-muted-foreground hidden items-center gap-6 md:flex">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"text-sm font-medium transition-colors hover:text-foreground",
								pathname === item.href && "text-foreground"
							)}
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					<Button asChild className="hidden sm:inline-flex">
						<Link href="/#contact">Contact Us</Link>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setMobileOpen(!mobileOpen)}
						aria-label="Toggle menu"
					>
						{mobileOpen ? (
							<XIcon className="size-5" />
						) : (
							<MenuIcon className="size-5" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile nav */}
			{mobileOpen && (
				<nav className="border-border border-t px-4 py-3 md:hidden">
					<div className="flex flex-col gap-2">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setMobileOpen(false)}
								className={cn(
									"rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
									pathname === item.href
										? "text-foreground bg-muted"
										: "text-muted-foreground"
								)}
							>
								{item.label}
							</Link>
						))}
						<Button asChild size="sm" className="mt-2">
							<Link href="/#contact">Contact Us</Link>
						</Button>
					</div>
				</nav>
			)}
		</header>
	);
}
