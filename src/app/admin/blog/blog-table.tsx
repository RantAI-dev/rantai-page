"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { SearchIcon } from "lucide-react";

import type { BlogPost } from "@/lib/db/schema";
import type { Option } from "@/types/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { Input } from "@/components/ui/input";

import { getBlogColumns, STATUS_OPTIONS } from "./columns";

interface BlogTableProps {
  data: BlogPost[];
  pageCount: number;
  tags: string[];
}

export function BlogTable({ data, pageCount, tags }: BlogTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const tagOptions = useMemo<Option[]>(
    () => tags.map((tag) => ({ label: tag, value: tag })),
    [tags],
  );

  const columns = useMemo(() => getBlogColumns(tagOptions), [tagOptions]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    shallow: false,
    startTransition,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    getRowId: (row) => row.id,
  });

  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: false, startTransition }),
  );
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false, startTransition }),
  );

  // Keep the input in sync when `q` changes externally (e.g. back/forward
  // navigation) using React's render-phase state adjustment pattern.
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

  return (
    <DataTable
      table={table}
      onRowClick={(post) => router.push(`/admin/blog/${post.id}/edit`)}
      className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or tag..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="pl-9"
            />
          </div>
          <DataTableFacetedFilter
            column={table.getColumn("tag")}
            title="Tag"
            options={tagOptions}
            multiple
          />
          <DataTableFacetedFilter
            column={table.getColumn("published")}
            title="Status"
            options={STATUS_OPTIONS}
            multiple
          />
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </DataTable>
  );
}
