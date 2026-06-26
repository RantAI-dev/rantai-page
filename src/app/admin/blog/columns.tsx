"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, MoreHorizontal, Trash2, Link2, Share2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import { siteConfig } from "@/lib/config";
import type { BlogPost } from "@/lib/db/schema";
import type { Option } from "@/types/data-table";
import {
  XIcon,
  LinkedInIcon,
  ThreadsIcon,
  FacebookIcon,
} from "@/components/icons";

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

function BlogActionsCell({ post }: { post: BlogPost }) {
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
      "noopener,noreferrer"
    );
  }

  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareThreads() {
    window.open(
      `https://www.threads.net/intent/post?text=${encodeURIComponent(post.title + " " + url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
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
  { label: "Published", value: "true" },
  { label: "Unpublished", value: "false" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBlogColumns(tagOptions: Option[]): ColumnDef<BlogPost, any>[] {
  return [
    {
      id: "thumbnail",
      accessorKey: "thumbnail",
      header: "",
      cell: ({ getValue }) => {
        const src = getValue<string | null>();
        return src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="h-10 w-16 rounded object-cover bg-muted"
          />
        ) : (
          <div className="flex h-10 w-16 items-center justify-center rounded bg-muted text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
          </div>
        );
      },
      meta: { label: "Thumbnail" },
      size: 80,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Title" />,
      cell: ({ getValue }) => (
        <span className="font-medium block truncate">{getValue<string>()}</span>
      ),
      meta: { label: "Title" },
      size: 640,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "tag",
      accessorKey: "tag",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Tag" />,
      cell: ({ getValue }) => <Badge variant="outline">{getValue<string>()}</Badge>,
      meta: { label: "Tag", variant: "multiSelect", options: tagOptions },
      size: 130,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Created" />,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {new Date(getValue<Date>()).toLocaleString("en-GB", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </span>
      ),
      meta: { label: "Created" },
      size: 180,
      enableSorting: true,
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Modified" />,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {new Date(getValue<Date>()).toLocaleString("en-GB", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </span>
      ),
      meta: { label: "Modified" },
      size: 180,
      enableSorting: true,
    },
    {
      id: "published",
      accessorKey: "published",
      header: "Status",
      cell: ({ getValue, row }) => (
        <BlogStatusBadge
          id={row.original.id}
          published={getValue<boolean>()}
          scheduledFor={row.original.scheduledFor}
        />
      ),
      meta: { label: "Status", variant: "multiSelect", options: STATUS_OPTIONS },
      size: 100,
      enableSorting: false,
      enableColumnFilter: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <BlogActionsCell post={row.original} />
        </div>
      ),
      size: 64,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    },
  ];
}
