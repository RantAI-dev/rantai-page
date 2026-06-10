import Link from "next/link";
import { Pencil, Share2 } from "lucide-react";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { siteConfig } from "@/lib/config";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BlogPublishedToggle } from "@/components/admin/blog-published-toggle";
import { ShareDropdown } from "@/components/share-dropdown";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminBlogPage() {
  const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button size="sm">New Post</Button>
        </Link>
      </div>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tag</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No posts yet.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium max-w-xs truncate">{post.title}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{post.tag}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  <BlogPublishedToggle id={post.id} published={post.published} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <Tooltip>
                      <ShareDropdown url={`${siteConfig.url}/blog/${post.slug}`} title={post.title}>
                        <TooltipTrigger asChild>
                          <Button variant="ghost">
                            <Share2 />
                          </Button>
                        </TooltipTrigger>
                      </ShareDropdown>
                      <TooltipContent>Share</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" asChild>
                          <Link href={`/admin/blog/${post.id}/edit`} >
                            <Pencil />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <DeleteButton id={post.id} endpoint="/api/admin/blog" redirectTo="/admin/blog" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
