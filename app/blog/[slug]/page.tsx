import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { getAllPostSlugs, getPostBySlug } from "@/lib/markdown";
import { MotionInView } from "@/components/motion-in-view";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export async function generateStaticParams() {
	const paths = getAllPostSlugs();
	return paths.map((path) => ({
		slug: path.params.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	return {
		title: post.title,
		description: post.excerpt,
	};
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	return (
		<div className="bg-[#0a0a0a] text-[#f0f0f0] min-h-screen flex flex-col">
			<Navbar />

			<main className="flex-1">
				<article className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
					<div className="mx-auto max-w-3xl">
						<MotionInView>
							<div className="mb-12">
								<Link
									href="/blog"
									className="group inline-flex items-center text-sm font-medium text-[#888888] transition-colors hover:text-white mb-8"
								>
									<ArrowLeftIcon className="mr-2 size-4 transition-transform duration-300 group-hover:-translate-x-1" />
									Back to Blog
								</Link>
								<div className="flex items-center gap-4 mb-6">
									<span className="inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#999999]">
										{post.tag}
									</span>
									<span className="text-sm font-medium text-[#666666]">
										{new Date(post.date).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</span>
								</div>
								<h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl leading-[1.15]">
									{post.title}
								</h1>
								{post.author && (
									<div className="mt-8 flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
											{post.author.charAt(0)}
										</div>
										<span className="text-sm font-medium text-[#cccccc]">
											{post.author}
										</span>
									</div>
								)}
							</div>
						</MotionInView>

						<MotionInView transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}>
							<div
								className="prose prose-invert prose-dark max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#5cb6f9] hover:prose-a:text-[#7cc8ff] prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-hr:border-white/10 prose-blockquote:border-l-4 prose-blockquote:border-white/20 prose-blockquote:bg-white/[0.02] prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-[#cccccc]"
								dangerouslySetInnerHTML={{ __html: post.contentHtml }}
							/>
						</MotionInView>
					</div>
				</article>

				<section className="border-t border-white/5 px-6 py-24 sm:px-8 lg:px-12">
					<div className="mx-auto max-w-3xl text-center">
						<h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
							Want to learn more?
						</h2>
						<p className="mb-8 text-sm leading-relaxed text-[#888888]">
							Subscribe to our newsletter or connect with our team to discuss how AI can transform your enterprise.
						</p>
						<Link
							href="/#contact"
							className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-all duration-200 hover:bg-white/90"
						>
							Contact Us
						</Link>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
