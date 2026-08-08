"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { BlogPublicationStatus } from "@/lib/blog-date";
import { Badge } from "@/components/ui/badge";
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

type Props = {
  id: string;
  status: BlogPublicationStatus;
  scheduledFor?: Date | string | null;
};

// Renders the post status as a badge — Scheduled / Published / Unpublished — that
// doubles as a quick action. Clicking opens a confirmation before publishing
// (when scheduled or unpublished) or unpublishing. Publishing clears any
// schedule server-side.
export function BlogStatusBadge({ id, status, scheduledFor }: Props) {
  const router = useRouter();
  const scheduledDate = scheduledFor ? new Date(scheduledFor) : null;
  const validSchedule = scheduledDate != null && !Number.isNaN(scheduledDate.getTime());
  const scheduledTime = validSchedule ? scheduledDate.getTime() : null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);

  // Refresh when a scheduled post reaches its go-live time so the badge cannot
  // remain stale on a CMS tab that has been left open.
  useEffect(() => {
    if (status !== "scheduled" || scheduledTime == null) return;
    const delay = scheduledTime - Date.now();
    if (delay <= 0) {
      router.refresh();
      return;
    }

    const timeout = window.setTimeout(() => router.refresh(), Math.min(delay + 250, 2_147_483_647));
    return () => window.clearTimeout(timeout);
  }, [router, scheduledTime, status]);

  async function update(nextPublished: boolean) {
    setPending(true);

    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: nextPublished }),
    });

    setPending(false);
    setConfirmOpen(false);
    if (!res.ok) {
      toast.error("Failed to update");
      return;
    }

    toast.success(nextPublished ? "Post published" : "Post moved to draft");
    router.refresh();
  }

  const display =
    status === "scheduled"
      ? {
          label: "Scheduled",
          variant: "outline" as const,
          confirmTitle: "Publish now?",
          confirmBody: `This publishes the post immediately, overriding its schedule of ${scheduledDate!.toLocaleString(
            "en-GB",
            { dateStyle: "medium", timeStyle: "short" },
          )}.`,
          action: "Publish now",
        }
      : status === "published"
        ? {
            label: "Published",
            variant: "default" as const,
            confirmTitle: "Unpublish this post?",
            confirmBody: "It will be hidden from the blog until you publish it again.",
            action: "Unpublish",
          }
        : {
            label: "Draft",
            variant: "secondary" as const,
            confirmTitle: "Publish this post?",
            confirmBody: "It will go live on the blog immediately.",
            action: "Publish",
          };

  return (
    <>
      <Badge asChild variant={display.variant}>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="cursor-pointer transition hover:opacity-80"
        >
          {display.label}
        </button>
      </Badge>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{display.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{display.confirmBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                // Keep the dialog open until the request resolves.
                e.preventDefault();
                update(status !== "published");
              }}
              disabled={pending}
            >
              {pending ? "Saving…" : display.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
