"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Book {
	name: string;
	fullName: string;
	imageUrl: string;
}

interface BookCarouselProps {
	books: Book[];
}

export function BookCarousel({ books }: BookCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerView, setItemsPerView] = useState(3);

	useEffect(() => {
		const updateItemsPerView = () => {
			if (window.innerWidth >= 1024) {
				setItemsPerView(3); // lg: 3 items
			} else if (window.innerWidth >= 640) {
				setItemsPerView(2); // sm: 2 items
			} else {
				setItemsPerView(1); // mobile: 1 item
			}
		};

		updateItemsPerView();
		window.addEventListener("resize", updateItemsPerView);
		return () => window.removeEventListener("resize", updateItemsPerView);
	}, []);

	const totalSlides = Math.ceil(books.length / itemsPerView);
	const canGoPrev = currentIndex > 0;
	const canGoNext = currentIndex < totalSlides - 1;

	const goToPrev = () => {
		if (canGoPrev) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const goToNext = () => {
		if (canGoNext) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={goToPrev}
						disabled={!canGoPrev}
						aria-label="Previous books"
						className="shrink-0"
					>
						<ChevronLeftIcon className="size-4" />
					</Button>
					<span className="text-muted-foreground shrink-0 text-sm">
						{currentIndex + 1} / {totalSlides}
					</span>
					<Button
						variant="outline"
						size="icon"
						onClick={goToNext}
						disabled={!canGoNext}
						aria-label="Next books"
						className="shrink-0"
					>
						<ChevronRightIcon className="size-4" />
					</Button>
				</div>
			</div>

			<div className="relative overflow-hidden">
				<div
					className="flex gap-4 transition-transform duration-300 ease-in-out"
					style={{
						transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
					}}
				>
					{books.map((book) => (
						<div
							key={book.name}
							className={cn(
								"min-w-0 shrink-0",
								"w-full",
								"sm:w-[calc(50%-0.5rem)]",
								"lg:w-[calc(33.333%-0.667rem)]"
							)}
						>
							<Card className="group relative overflow-hidden h-full">
								<div className="bg-muted relative aspect-[3/4] w-full overflow-hidden">
									<Image
										src={book.imageUrl}
										alt={book.fullName}
										fill
										className="object-cover transition-transform group-hover:scale-105"
									/>
								</div>
								<CardHeader>
									<CardTitle className="text-base">{book.name}</CardTitle>
									<CardDescription className="leading-relaxed">
										{book.fullName}
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
