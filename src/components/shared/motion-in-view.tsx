"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { defaultViewport, defaultTransition } from "@/lib/motion-variants";

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
	const reduceMotion = useReducedMotion();

	return (
		<motion.div
			initial={reduceMotion ? false : { opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={viewport}
			transition={reduceMotion ? { duration: 0 } : transition}
			className={cn("relative", className)}
			{...rest}
		>
			{children}
		</motion.div>
	);
}
