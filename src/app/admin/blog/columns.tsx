"use client";

import Link from "next/link";
import { EyeIcon, Pencil, Share2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { siteConfig } from "@/lib/config";
import type { BlogPost } from "@/lib/db/schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BlogPublishedToggle } from "@/components/admin/blog-published-toggle";
import { ShareDropdown } from "@/components/share-dropdown";
import { DeleteButton } from "@/components/admin/delete-button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const blogColumns: ColumnDef<BlogPost, any>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ getValue }) => (
      <span className="font-medium max-w-xs truncate block">{getValue<string>()}</span>
    ),
    enableSorting: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "tag",
    header: "Tag",
    cell: ({ getValue }) => <Badge variant="outline">{getValue<string>()}</Badge>,
    enableSorting: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {new Date(getValue<Date>()).toLocaleString("en-GB", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </span>
    ),
    enableSorting: true,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "updatedAt",
    header: "Modified",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">
        {new Date(getValue<Date>()).toLocaleString("en-GB", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </span>
    ),
    enableSorting: true,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ getValue, row }) => (
      <BlogPublishedToggle id={row.original.id} published={getValue<boolean>()} />
    ),
    enableSorting: false,
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="flex items-center gap-1 justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={`/admin/blog/preview/${post.slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <EyeIcon className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
          <Tooltip>
            <ShareDropdown url={`${siteConfig.url}/blog/${post.slug}`} title={post.title}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
            </ShareDropdown>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/admin/blog/${post.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <DeleteButton id={post.id} endpoint="/api/admin/blog" redirectTo="/admin/blog" />
        </div>
      );
    },
    enableSorting: false,
    enableGlobalFilter: false,
  },
];
