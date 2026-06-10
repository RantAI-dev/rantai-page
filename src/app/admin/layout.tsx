import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Admin pages must always reflect the current DB state — never serve cached HTML.
export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
