"use client";

import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const defaultViewport = { once: true, margin: "0px 0px -60px 0px" as const };
const defaultTransition = { duration: 0.6, ease: "easeOut" as const };

type MotionInViewProps = {
	children: React.ReactNode;
	className?: string;
	viewport?: { once?: boolean; margin?: string; amount?: number };
} & Omit<ComponentProps<typeof motion.div>, "initial" | "whileInView" | "viewport">;

/**
 * Wraps content in a motion.div that fades in and moves up when it enters the viewport.
 * Replaces the previous CSS-based AnimateOnScroll.
 */
export function MotionInView({
	children,
	className,
	viewport = defaultViewport,
	transition = defaultTransition,
	...rest
}: MotionInViewProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={viewport}
			transition={transition}
			className={cn(className)}
			{...rest}
		>
			{children}
		</motion.div>
	);
}
