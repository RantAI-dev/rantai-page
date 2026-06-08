import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { LogoutButton } from "@/components/admin/logout-button";

// Admin pages must always reflect the current DB state — never serve cached HTML.
export const dynamic = "force-dynamic";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/thumbnail", label: "Thumbnail" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <span className="font-semibold text-sm">RantAI CMS</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-border">
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
      <Toaster />
    </div>
  );
}
