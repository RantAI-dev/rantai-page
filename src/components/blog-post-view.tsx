import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, Share2 } from "lucide-react";

import type { BlogPost } from "@/lib/blog";
import { siteConfig } from "@/lib/config";
import { Eyebrow } from "@/components/eyebrow";
import { MotionInView } from "@/components/motion-in-view";
import { ShareDropdown } from "@/components/share-dropdown";
import { SiteShell } from "@/components/site-shell";

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

type BlogPostViewProps = {
  post: BlogPost;
  backHref?: string;
  backLabel?: string;
};

export function BlogPostView({
  post,
  backHref = "/blog",
  backLabel = "All insights",
}: BlogPostViewProps) {
  const mins = readingTime(post.contentHtml ?? "");
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        <MotionInView>
          <header className="mx-auto max-w-3xl px-5 pt-14 sm:px-8 sm:pt-20">
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

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
              <p className="font-label text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                {date}
                <span aria-hidden="true" className="mx-2">·</span>
                {mins} min read
              </p>
              <ShareDropdown
                url={`${siteConfig.url}/blog/${post.slug}`}
                title={post.title}
              >
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-foreground/20 px-4 text-sm text-foreground transition-colors hover:border-foreground/60"
                >
                  <Share2 className="size-3.5" />
                  Share
                </button>
              </ShareDropdown>
            </div>
          </header>
        </MotionInView>

        {post.thumbnail && (
          <MotionInView className="mx-auto mt-10 max-w-5xl px-3 sm:px-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                loading="eager"
                priority
              />
            </div>
          </MotionInView>
        )}

        <MotionInView
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl px-5 pt-12 pb-24 sm:px-8 lg:pb-32"
        >
          <div
            className="prose prose-lg prose-neutral max-w-none wrap-anywhere prose-headings:font-medium prose-headings:tracking-[-0.025em] prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:opacity-70 prose-blockquote:border-l-2 prose-blockquote:border-brand-1 prose-blockquote:font-normal prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-pre:rounded-xl prose-pre:bg-neutral-950 prose-img:rounded-xl prose-hr:border-border"
            dangerouslySetInnerHTML={{ __html: post.contentHtml ?? "" }}
          />
        </MotionInView>
      </article>
    </SiteShell>
  );
}
