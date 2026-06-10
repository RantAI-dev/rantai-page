"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function BlogPublishedToggle({ id, published }: { id: string; published: boolean }) {
  const [checked, setChecked] = useState(published);

  async function handleChange(value: boolean) {
    setChecked(value);
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: value }),
    });
    if (!res.ok) {
      setChecked(!value);
      toast.error("Failed to update");
    }
  }

  return <Switch checked={checked} onCheckedChange={handleChange} />;
}
