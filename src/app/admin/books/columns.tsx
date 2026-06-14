"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLinkIcon, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import type { Book } from "@/lib/db/schema";
import type { Option } from "@/types/data-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { RowDragHandle } from "@/components/data-table/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

function BookActionsCell({ book }: { book: Book }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/books/${book.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      toast.success("Deleted");
      router.push("/admin/books");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBookColumns(categoryOptions: Option[]): ColumnDef<Book, any>[] {
  return [
    {
      id: "drag",
      header: "",
      cell: () => (
        <div className="flex justify-center">
          <RowDragHandle />
        </div>
      ),
      size: 44,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    },
    {
      id: "cover",
      header: "",
      cell: ({ row }) => (
        <div className="relative h-10 w-8 overflow-hidden rounded">
          <Image
            src={row.original.imageUrl}
            alt={row.original.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ),
      size: 56,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    },
    {
      id: "code",
      accessorKey: "code",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Code" />,
      cell: ({ getValue }) => (
        <span className="font-mono text-xs font-medium">{getValue<string>()}</span>
      ),
      meta: { label: "Code" },
      size: 140,
      enableSorting: true,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
      cell: ({ getValue }) => (
        <span className="font-medium block truncate">{getValue<string>()}</span>
      ),
      meta: { label: "Name" },
      size: 460,
      enableSorting: true,
      enableHiding: false,
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Category" />,
      cell: ({ getValue }) => <Badge variant="outline">{getValue<string>()}</Badge>,
      meta: { label: "Category", variant: "multiSelect", options: categoryOptions },
      size: 160,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: "links",
      header: "Links",
      cell: ({ row }) =>
        row.original.url ? (
          <a
            href={row.original.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLinkIcon className="size-3.5" />
            Visit
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
      meta: { label: "Links" },
      size: 120,
      enableSorting: false,
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
      id: "orderIndex",
      accessorKey: "orderIndex",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Order" />,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue<number>()}</span>
      ),
      meta: { label: "Order" },
      size: 100,
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <BookActionsCell book={row.original} />
        </div>
      ),
      size: 64,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    },
  ];
}
