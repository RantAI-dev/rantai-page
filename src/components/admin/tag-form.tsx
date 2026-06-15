"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TAG_COLOR_PRESETS, gradientForColor } from "@/lib/tag-colors";
import type { Tag } from "@/lib/db/schema";

function ColorSwatch({ color }: { color: string }) {
  return (
    <span className={cn("size-4 shrink-0 rounded bg-gradient-to-br", gradientForColor(color))} />
  );
}

export function TagForm({ tag }: { tag?: Tag }) {
  const router = useRouter();
  const isEdit = !!tag;

  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState(tag?.color ?? "slate");
  const [orderIndex, setOrderIndex] = useState(tag?.orderIndex ?? 0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `/api/admin/tags/${tag.id}` : "/api/admin/tags";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color, orderIndex }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success(isEdit ? "Tag updated" : "Tag created");
      router.push("/admin/tags");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to save");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Product" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Select value={color} onValueChange={setColor}>
          <SelectTrigger id="color">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAG_COLOR_PRESETS.map((preset) => (
              <SelectItem key={preset.key} value={preset.key}>
                <span className="flex items-center gap-2">
                  <ColorSwatch color={preset.key} />
                  {preset.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Dipakai sebagai gradient thumbnail di halaman blog publik.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="orderIndex">Order</Label>
        <Input
          id="orderIndex"
          type="number"
          value={orderIndex}
          onChange={(e) => setOrderIndex(Number(e.target.value))}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update Tag" : "Create Tag"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/tags")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
