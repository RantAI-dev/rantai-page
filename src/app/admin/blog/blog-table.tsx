"use client";

import { useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import type { BlogPost } from "@/lib/db/schema";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { blogColumns } from "./columns";

interface BlogTableProps {
  data: BlogPost[];
  pageCount: number;
  tags: string[];
  initialTag: string;
  initialStatus: string;
}

export function BlogTable({ data, pageCount, tags, initialTag, initialStatus }: BlogTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1.5 w-44">
          <Label>Tag</Label>
          <Select
            value={initialTag || "all"}
            onValueChange={(v) => updateParam("tag", v === "all" ? null : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 w-44">
          <Label>Status</Label>
          <Select
            value={initialStatus || "all"}
            onValueChange={(v) => updateParam("status", v === "all" ? null : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={blogColumns}
        data={data}
        pageCount={pageCount}
        searchPlaceholder="Search by title or tag..."
        onRowClick={(post) => router.push(`/admin/blog/${post.id}/edit`)}
      />
    </div>
  );
}
