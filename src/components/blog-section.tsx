import { getPosts } from "@/lib/blog";
import { BlogSectionContent } from "./blog-section-content";

export async function BlogSection() {
	const { posts } = await getPosts({ limit: 3 });

	// Nothing published yet — hide the section entirely rather than show an
	// empty grid on the homepage.
	if (posts.length === 0) return null;

	return <BlogSectionContent posts={posts} />;
}
