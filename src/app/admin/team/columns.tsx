"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ExternalLinkIcon, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import type { TeamMember } from "@/lib/db/schema";
import type { Option } from "@/types/data-table";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { RowDragHandle } from "@/components/data-table/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

function TeamActionsCell({ member }: { member: TeamMember }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/team/${member.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      toast.success("Deleted");
      router.push("/admin/team");
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
          {member.linkedin ? (
            <DropdownMenuItem asChild>
              <Link href={member.linkedin} target="_blank" rel="noreferrer">
                <ExternalLinkIcon />
                LinkedIn
              </Link>
            </DropdownMenuItem>
          ) : null}
          {member.github ? (
            <DropdownMenuItem asChild>
              <Link href={member.github} target="_blank" rel="noreferrer">
                <ExternalLinkIcon />
                GitHub
              </Link>
            </DropdownMenuItem>
          ) : null}
          {member.linkedin || member.github ? <DropdownMenuSeparator /> : null}
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
export function getTeamColumns(roleOptions: Option[]): ColumnDef<TeamMember, any>[] {
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
      id: "photo",
      header: "",
      cell: ({ row }) =>
        row.original.imageUrl ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={row.original.imageUrl}
              alt={row.original.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {row.original.name.charAt(0)}
          </div>
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
      id: "role",
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} label="Role" />,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground block truncate">{getValue<string>()}</span>
      ),
      meta: { label: "Role", variant: "multiSelect", options: roleOptions },
      size: 280,
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
          <TeamActionsCell member={row.original} />
        </div>
      ),
      size: 64,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
    },
  ];
}
