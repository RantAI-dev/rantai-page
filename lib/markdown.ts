import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	tag: string;
	excerpt: string;
	author?: string;
	contentHtml: string;
}

export function getAllPostSlugs() {
	if (!fs.existsSync(contentDirectory)) return [];
	const fileNames = fs.readdirSync(contentDirectory);
	return fileNames.map((fileName) => {
		return {
			params: {
				slug: fileName.replace(/\.mdx$/, ""),
			},
		};
	});
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
	try {
		const fullPath = path.join(contentDirectory, `${slug}.mdx`);
		const fileContents = fs.readFileSync(fullPath, "utf8");

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Use remark to convert markdown into HTML string
		const processedContent = await remark()
			.use(html)
			.process(matterResult.content);
		const contentHtml = processedContent.toString();

		return {
			slug,
			title: matterResult.data.title,
			date: matterResult.data.date,
			tag: matterResult.data.tag,
			excerpt: matterResult.data.excerpt,
			author: matterResult.data.author,
			contentHtml,
		};
	} catch (error) {
		console.error("Error retrieving post by slug:", error);
		return null;
	}
}

export function getAllPosts(): Omit<BlogPost, "contentHtml">[] {
	if (!fs.existsSync(contentDirectory)) return [];

	const fileNames = fs.readdirSync(contentDirectory);
	const allPostsData = fileNames.map((fileName) => {
		const slug = fileName.replace(/\.mdx$/, "");

		const fullPath = path.join(contentDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, "utf8");

		const matterResult = matter(fileContents);

		return {
			slug,
			title: matterResult.data.title,
			date: matterResult.data.date,
			tag: matterResult.data.tag,
			excerpt: matterResult.data.excerpt,
			author: matterResult.data.author,
		};
	});

	// Sort posts by date
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}
