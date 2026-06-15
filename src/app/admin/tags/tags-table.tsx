"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";

import type { Tag } from "@/lib/db/schema";
import { useDataTable } from "@/hooks/use-data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Input } from "@/components/ui/input";

import { getTagColumns } from "./columns";

interface TagsTableProps {
  data: Tag[];
  pageCount: number;
}

export function TagsTable({ data, pageCount }: TagsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local copy so drag-and-drop can reorder rows optimistically before the
  // server round-trip; re-synced whenever fresh server data arrives.
  const [rows, setRows] = useState(data);
  const [prevData, setPrevData] = useState(data);
  if (data !== prevData) {
    setPrevData(data);
    setRows(data);
  }

  const columns = useMemo(() => getTagColumns(), []);

  const { table } = useDataTable({
    data: rows,
    columns,
    pageCount,
    shallow: false,
    startTransition,
    initialState: {
      sorting: [{ id: "orderIndex", desc: false }],
      columnVisibility: { orderIndex: false },
      columnPinning: { right: ["actions"] },
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    getRowId: (row) => row.id,
  });

  // Reordering only makes sense while rows are shown in their stored order,
  // so enable it only when sorting by Order ascending (or unsorted).
  const sorting = table.getState().sorting;
  const reorderEnabled =
    sorting.length === 0 || (sorting[0]?.id === "orderIndex" && !sorting[0].desc);

  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: false, startTransition }),
  );
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false, startTransition }),
  );

  const [searchValue, setSearchValue] = useState(q);
  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setSearchValue(q);
  }

  const debouncedSearch = useDebouncedCallback((value: string) => {
    void setPage(1);
    void setQ(value === "" ? null : value);
  }, 300);

  async function handleReorder(orderedIds: string[]) {
    let payload: { id: string; orderIndex: number }[] = [];

    setRows((prev) => {
      const byId = new Map(prev.map((row) => [row.id, row]));
      const reordered = orderedIds
        .map((id) => byId.get(id))
        .filter((row): row is Tag => Boolean(row));
      const sortedIndexes = prev.map((row) => row.orderIndex).sort((a, b) => a - b);
      const next = reordered.map((row, i) => ({
        ...row,
        orderIndex: sortedIndexes[i] ?? row.orderIndex,
      }));
      payload = next.map((row) => ({ id: row.id, orderIndex: row.orderIndex }));
      return next;
    });

    const res = await fetch("/api/admin/tags/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      toast.error("Failed to save order");
      router.refresh();
    }
  }

  return (
    <DataTable
      table={table}
      onRowClick={(tag) => router.push(`/admin/tags/${tag.id}/edit`)}
      onReorder={reorderEnabled ? handleReorder : undefined}
      className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedSearch(e.target.value);
            }}
            className="pl-9"
          />
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </DataTable>
  );
}
