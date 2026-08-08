"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  EyeIcon,
  ImageIcon,
  Link2,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import { siteConfig } from "@/lib/config";
import { getBlogPostingDate, type BlogPublicationStatus } from "@/lib/blog-date";
import type { BlogPost } from "@/lib/db/schema";
import type { Option } from "@/types/data-table";
import { XIcon, LinkedInIcon, ThreadsIcon, FacebookIcon } from "@/components/icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BlogStatusBadge } from "@/components/admin/blog-status-badge";

const adminDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const adminDayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const adminTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatAdminDate(value: Date | string): string {
  return adminDateFormatter.format(new Date(value));
}

export type AdminBlogPost = BlogPost & {
  publicationStatus: BlogPublicationStatus;
};

function BlogActionsCell({ post }: { post: AdminBlogPost }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const url = `${siteConfig.url}/blog/${post.slug}`;

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      toast.success("Deleted");
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  }

  function shareX() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareThreads() {
    window.open(
      `https://www.threads.net/intent/post?text=${encodeURIComponent(post.title + " " + url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Actions for ${post.title}`}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/blog/${post.id}/edit`}>
              <Pencil />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/blog/preview/${post.slug}`} target="_blank" rel="noreferrer">
              <EyeIcon />
              Preview
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Share2 />
              Share
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={copyLink}>
                <Link2 />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={shareX}>
                <XIcon />
                Share on X
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareLinkedIn}>
                <LinkedInIcon />
                Share on LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareThreads}>
                <ThreadsIcon />
                Share on Threads
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareFacebook}>
                <FacebookIcon />
                Share on Facebook
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const STATUS_OPTIONS: Option[] = [
  { label: "Published", value: "published" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Draft", value: "draft" },
];

const STATUS_DISPLAY = {
  published: { label: "Published", variant: "default" as const },
  scheduled: { label: "Scheduled", variant: "outline" as const },
  draft: { label: "Draft", variant: "secondary" as const },
} satisfies Record<
  BlogPublicationStatus,
  { label: string; variant: "default" | "outline" | "secondary" }
>;

export function getBlogColumns(tagOptions: Option[]): ColumnDef<AdminBlogPost>[] {
  return [
    {
      id: "thumbnail",
      accessorKey: "thumbnail",
      header: "",
      cell: ({ getValue }) => {
        const src = getValue<string | null>();
        return src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-10 w-16 rounded bg-muted object-cover" />
        ) : (
          <div className="flex h-10 w-16 items-center justify-center rounded bg-muted text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
          </div>
        );
      },
      meta: { label: "Thumbnail", className: "max-lg:hidden" },
      size: 72,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Title" />,
      cell: ({ getValue, row }) => (
        <Link
          href={`/admin/blog/${row.original.id}/edit`}
          className="block truncate font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {getValue<string>()}
        </Link>
      ),
      meta: { label: "Title", className: "max-md:!w-[160px]" },
      size: 400,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "tag",
      accessorKey: "tag",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Tag" />,
      cell: ({ getValue }) => <Badge variant="outline">{getValue<string>()}</Badge>,
      meta: {
        label: "Tag",
        variant: "multiSelect",
        options: tagOptions,
        className: "max-lg:hidden",
      },
      size: 120,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Created" />,
      cell: ({ getValue }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {formatAdminDate(getValue<Date>())}
        </span>
      ),
      meta: { label: "Created", className: "max-xl:hidden" },
      size: 170,
      enableSorting: true,
    },
    {
      id: "scheduledFor",
      accessorFn: (post) => getBlogPostingDate(post),
      header: ({ column }) => <DataTableColumnHeader column={column} label="Posting date" />,
      cell: ({ getValue, row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {getValue<Date | null>() ? formatAdminDate(getValue<Date>()) : "Not published"}
          {row.original.publicationStatus === "scheduled" ? (
            <span className="mt-0.5 block text-xs">Scheduled</span>
          ) : null}
        </span>
      ),
      meta: { label: "Posting date", className: "max-md:hidden" },
      size: 170,
      enableSorting: true,
    },
    {
      id: "publicationStatus",
      accessorKey: "publicationStatus",
      header: "Status",
      cell: ({ getValue, row }) => (
        <BlogStatusBadge
          id={row.original.id}
          status={getValue<BlogPublicationStatus>()}
          scheduledFor={row.original.scheduledFor}
        />
      ),
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: STATUS_OPTIONS,
        className: "max-md:hidden",
      },
      size: 100,
      enableSorting: false,
      enableColumnFilter: true,
    },
    {
      id: "publishingSummary",
      accessorFn: (post) => post.publicationStatus,
      header: "Publishing",
      cell: ({ row }) => {
        const postingDate = getBlogPostingDate(row.original);
        const statusDisplay = STATUS_DISPLAY[row.original.publicationStatus];

        return (
          <div className="flex flex-col items-start gap-1">
            <Badge variant={statusDisplay.variant}>{statusDisplay.label}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="size-3 shrink-0" />
              {postingDate ? (
                <span>
                  <span className="block">{adminDayFormatter.format(postingDate)}</span>
                  <span className="block">{adminTimeFormatter.format(postingDate)}</span>
                </span>
              ) : (
                "Not published"
              )}
            </span>
          </div>
        );
      },
      meta: { label: "Publishing", className: "md:hidden max-md:!w-[145px]" },
      size: 145,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <BlogActionsCell post={row.original} />
        </div>
      ),
      meta: { className: "max-md:!w-10" },
      size: 48,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    },
  ];
}
