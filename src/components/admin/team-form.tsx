"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ThumbnailUpload } from "@/components/admin/thumbnail-upload";
import type { TeamMember } from "@/lib/db/schema";

export function TeamForm({ member }: { member?: TeamMember }) {
  const router = useRouter();
  const isEdit = !!member;

  const [name, setName] = useState(member?.name ?? "");
  const [role, setRole] = useState(member?.role ?? "");
  const [bio, setBio] = useState(member?.bio ?? "");
  const [imageUrl, setImageUrl] = useState(member?.imageUrl ?? "");
  const [linkedin, setLinkedin] = useState(member?.linkedin ?? "");
  const [github, setGithub] = useState(member?.github ?? "");
  const [orderIndex, setOrderIndex] = useState(member?.orderIndex ?? 0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `/api/admin/team/${member.id}` : "/api/admin/team";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        role,
        bio: bio || null,
        imageUrl: imageUrl || null,
        linkedin: linkedin || null,
        github: github || null,
        orderIndex,
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success(isEdit ? "Member updated" : "Member added");
      router.push("/admin/team");
      router.refresh();
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Failed to save");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required placeholder="Software Engineer" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </div>

      <ThumbnailUpload label="Photo" value={imageUrl} onChange={setImageUrl} folder="team" />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="orderIndex">Order</Label>
        <Input id="orderIndex" type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : isEdit ? "Update Member" : "Add Member"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/team")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
