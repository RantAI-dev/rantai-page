import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRight, Share2 } from "lucide-react";

import { prepareArticle } from "@/lib/blog/article-html";
import { sanitizeBlogHtml } from "@/lib/blog/sanitize";
import type { BlogPost, PostListItem } from "@/lib/blog/posts";
import { siteConfig } from "@/lib/config";
import { ArticleReader } from "@/components/blog/article-reader";
import { Eyebrow } from "@/components/shared/eyebrow";
import { MotionInView } from "@/components/shared/motion-in-view";
import { ShareDropdown } from "@/components/blog/share-dropdown";
import { SiteShell } from "@/components/layout/site-shell";

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

type BlogPostViewProps = {
  post: BlogPost;
  backHref?: string;
  backLabel?: string;
  /** The article to suggest at the end. */
  next?: PostListItem | null;
};

function NextArticle({ post }: Readonly<{ post: PostListItem }>) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mt-16 flex items-center gap-5 border-t border-neutral-200 pt-8 sm:gap-7"
    >
      <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:w-44">
        {post.thumbnail && (
          <Image src={post.thumbnail} alt="" fill sizes="176px" className="object-cover" />
        )}
        <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.06]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium tracking-[0.08em] text-neutral-500 uppercase">
          Next article
        </p>
        <p className="mt-2 line-clamp-2 text-[17px] leading-snug font-medium tracking-[-0.015em] text-neutral-950 sm:text-xl">
          {post.title}
        </p>
      </div>
      <span className="hidden size-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition-colors duration-200 group-hover:bg-neutral-950 group-hover:text-white sm:grid">
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}

export function BlogPostView({
  post,
  backHref = "/blog",
  backLabel = "All insights",
  next,
}: BlogPostViewProps) {
  const mins = readingTime(post.contentHtml ?? "");
  // Sanitized again on read: also covers posts saved before sanitizing on
  // write, and the admin preview, which renders this same view.
  const { html, headings } = prepareArticle(
    sanitizeBlogHtml(post.contentHtml ?? "")
  );
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const header = (
    <MotionInView>
      <header className="pt-14 sm:pt-20">
        <Link
          href={backHref}
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          {backLabel}
        </Link>

        <Eyebrow className="mt-10 flex text-muted-foreground">{post.tag}</Eyebrow>

        <h1 className="mt-5 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px] text-neutral-500">
            <time dateTime={post.date}>{date}</time>
            <span aria-hidden="true" className="mx-2">·</span>
            {mins} min read
          </p>
          <ShareDropdown
            url={`${siteConfig.url}/blog/${post.slug}`}
            title={post.title}
          >
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-neutral-100 px-4 text-sm text-foreground transition-colors hover:bg-neutral-200/70"
            >
              <Share2 className="size-3.5" />
              Share
            </button>
          </ShareDropdown>
        </div>

        {post.thumbnail && (
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 820px"
              className="object-cover"
              loading="eager"
              priority
            />
          </div>
        )}
      </header>
    </MotionInView>
  );

  return (
    <SiteShell
      cta={{
        title: "Want to learn more?",
        description:
          "Connect with our team to discuss how AI can transform your enterprise.",
        label: "Contact us",
        subject: `About: ${post.title}`,
        showServicesLink: true,
      }}
    >
      <article>
        <ArticleReader headings={headings} header={header}>
          <MotionInView
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="pt-12 pb-24 lg:pb-32"
          >
            <div
              className="prose prose-lg prose-neutral max-w-none wrap-anywhere prose-headings:scroll-mt-24 prose-headings:font-medium prose-headings:tracking-[-0.025em] prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:opacity-70 prose-blockquote:border-l-2 prose-blockquote:border-brand-1 prose-blockquote:font-normal prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-code:before:content-none prose-code:after:content-none prose-img:rounded-xl prose-hr:border-border"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {next && <NextArticle post={next} />}
          </MotionInView>
        </ArticleReader>
      </article>
    </SiteShell>
  );
}
