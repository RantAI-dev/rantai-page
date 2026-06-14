"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  pageCount: number;
  searchPlaceholder?: string;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
  columns,
  data,
  pageCount,
  searchPlaceholder = "Search...",
  onRowClick,
}: DataTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(searchParams.get("page") ?? "1");
  const currentSort = searchParams.get("sort") ?? "";
  const currentOrder = (searchParams.get("order") ?? "desc") as "asc" | "desc";
  const currentQ = searchParams.get("q") ?? "";

  const [searchValue, setSearchValue] = useState(currentQ);

  // Sync input when URL changes externally (back/forward browser navigation)
  useEffect(() => {
    setSearchValue(currentQ);
  }, [currentQ]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>, mode: "push" | "replace" = "replace") => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const url = `${pathname}?${params.toString()}`;
      startTransition(() => {
        if (mode === "push") {
          router.push(url);
        } else {
          router.replace(url);
        }
      });
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentQ) {
        updateParams({ q: searchValue || null, page: "1" }, "replace");
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const sorting: SortingState = currentSort
    ? [{ id: currentSort, desc: currentOrder === "desc" }]
    : [];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      if (next.length === 0) {
        updateParams({ sort: null, order: null, page: "1" }, "replace");
      } else {
        updateParams({
          sort: next[0].id,
          order: next[0].desc ? "desc" : "asc",
          page: "1",
        }, "replace");
      }
    },
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="max-w-sm"
      />

      <div
        className={`rounded-md border border-border overflow-hidden transition-opacity duration-150 ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, i) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  const isLast = i === headerGroup.headers.length - 1;
                  return (
                    <TableHead key={header.id} className={isLast ? "text-right" : ""}>
                      {canSort ? (
                        <button
                          className="flex items-center gap-1.5 font-medium hover:text-foreground transition-colors"
                          onClick={() =>
                            header.column.toggleSorting(isSorted === "asc")
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {isSorted === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5" />
                          ) : isSorted === "desc" ? (
                            <ArrowDown className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        <span className="font-medium">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-muted-foreground"
                >
                  {currentQ ? "No results match your search." : "No data."}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-muted/30 transition-colors${onRowClick ? " cursor-pointer" : ""}`}
                  onClick={(e) => {
                    if (!onRowClick) return;
                    const target = e.target as HTMLElement;
                    if (target.closest('button, a, input, [role="menuitem"], [role="checkbox"], [role="option"]')) return;
                    onRowClick(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <TableCell
                      key={cell.id}
                      className={
                        i === row.getVisibleCells().length - 1 ? "text-right" : ""
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {currentPage} of {pageCount || 1}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateParams({ page: String(currentPage - 1) }, "push")}
            disabled={currentPage <= 1 || isPending}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateParams({ page: String(currentPage + 1) }, "push")}
            disabled={currentPage >= pageCount || isPending}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
