"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react";
import type { BlogPost } from "@/lib/markdown";

type Post = Omit<BlogPost, "contentHtml">;

interface Props {
	posts: Post[];
}

export function BlogMain({ posts }: Props) {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const q = query.toLowerCase().trim();
		if (!q) return posts;
		return posts.filter(
			(p) =>
				p.title.toLowerCase().includes(q) ||
				p.excerpt.toLowerCase().includes(q) ||
				p.tag.toLowerCase().includes(q),
		);
	}, [posts, query]);

	return (
		<div className="flex flex-col gap-8">
			{/* Search bar */}
			<div className="relative">
				<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search articles..."
					className="w-full bg-muted/30 border border-border rounded-md pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors font-mono"
				/>
				{query && (
					<button
						onClick={() => setQuery("")}
						className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
					>
						<XIcon className="size-4" />
					</button>
				)}
			</div>

			{/* Results count */}
			<p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">
				{query
					? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${query}"`
					: `${posts.length} article${posts.length !== 1 ? "s" : ""}`}
			</p>

			{/* Post grid */}
			{filtered.length === 0 ? (
				<div className="py-16 text-center">
					<p className="font-mono text-sm text-muted-foreground">
						No articles found for &ldquo;{query}&rdquo;.
					</p>
					<button
						onClick={() => setQuery("")}
						className="mt-3 font-mono text-xs uppercase tracking-wider text-foreground underline underline-offset-4 hover:text-primary transition-colors"
					>
						Clear search
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
					{filtered.map((post) => (
						<Link
							key={post.slug}
							href={`/blog/${post.slug}`}
							className="group flex flex-col gap-5 bg-background p-6 transition-colors hover:bg-muted/20"
						>
							{/* Tag + date */}
							<div className="flex items-center justify-between gap-3">
								<span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
									{post.tag}
								</span>
								<span className="font-mono text-xs text-muted-foreground shrink-0">
									{new Date(post.date).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							</div>

							{/* Title */}
							<h3 className="text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
								{post.title}
							</h3>

							{/* Excerpt */}
							<p className="flex-1 font-mono text-xs leading-relaxed text-muted-foreground line-clamp-3">
								{post.excerpt}
							</p>

							{/* CTA */}
							<span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
								Read article
								<ArrowRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
							</span>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
