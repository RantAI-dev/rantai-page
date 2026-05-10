import { db } from "@/lib/db";
import { blogPosts, books, teamMembers } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminDashboard() {
  const [postCount, bookCount, teamCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(blogPosts),
    db.select({ count: sql<number>`count(*)` }).from(books),
    db.select({ count: sql<number>`count(*)` }).from(teamMembers),
  ]);

  const stats = [
    { title: "Blog Posts", count: postCount[0].count, href: "/admin/blog" },
    { title: "Books", count: bookCount[0].count, href: "/admin/books" },
    { title: "Team Members", count: teamCount[0].count, href: "/admin/team" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
