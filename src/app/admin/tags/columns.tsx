"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import type { Tag } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { gradientForColor } from "@/lib/tag-colors";

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

function TagActionsCell({ tag }: { tag: Tag }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/tags/${tag.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      toast.success("Deleted");
      setDeleteOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to delete");
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
          <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tag?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Tags still used by posts cannot be deleted.
            </AlertDialogDescription>
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
export function getTagColumns(): ColumnDef<Tag, any>[] {
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
      id: "color",
      header: "",
      cell: ({ row }) => (
        <div
          className={cn(
            "h-6 w-10 rounded-md bg-gradient-to-br",
            gradientForColor(row.original.color),
          )}
        />
      ),
      size: 64,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
      cell: ({ getValue }) => (
        <span className="font-medium block truncate">{getValue<string>()}</span>
      ),
      meta: { label: "Name" },
      size: 360,
      enableSorting: true,
      enableHiding: false,
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
          <TagActionsCell tag={row.original} />
        </div>
      ),
      size: 64,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    },
  ];
}
