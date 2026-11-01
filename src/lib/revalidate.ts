import { revalidatePath } from "next/cache"

// Public pages are prerendered. When the CMS changes something, every page
// that shows it has to be rebuilt; keeping the lists here means a new page
// that reads posts, books or team members only needs adding in one place.

/** A post was created, edited, published or removed. */
export function revalidatePosts(...slugs: string[]) {
  revalidatePath("/") // latest insights on the home page
  revalidatePath("/blog")
  revalidatePath("/blog/[slug]", "page") // "next article" links shift too
  for (const slug of slugs) revalidatePath(`/blog/${slug}`)
  revalidatePath("/sitemap.xml")
  revalidatePath("/rss.xml")
}

/** Tags (names, colours, order) changed. */
export function revalidateTags() {
  revalidatePath("/blog")
  revalidatePath("/blog/[slug]", "page")
}

/** Academy books changed. */
export function revalidateBooks() {
  revalidatePath("/academy")
  revalidatePath("/our-team") // book count and covers in "Who we are"
}

/** Team members changed. */
export function revalidateTeam() {
  revalidatePath("/our-team")
  revalidatePath("/team")
}
