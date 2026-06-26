"use client";

import { useState } from "react";
import { toast } from "sonner";
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
  published: boolean;
  scheduledFor?: Date | string | null;
};

// Renders the post status as a badge — Scheduled / Published / Unpublished — that
// doubles as a quick action. Clicking opens a confirmation before publishing
// (when scheduled or unpublished) or unpublishing. Publishing clears any
// schedule server-side.
export function BlogStatusBadge({ id, published, scheduledFor }: Props) {
  const scheduledDate = scheduledFor ? new Date(scheduledFor) : null;
  const validSchedule = scheduledDate != null && !Number.isNaN(scheduledDate.getTime());

  const [isPublished, setIsPublished] = useState(published);
  // Lazy init reads the clock once on mount, keeping render pure.
  const [isScheduled, setIsScheduled] = useState(
    () => !published && validSchedule && scheduledDate!.getTime() > Date.now(),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function update(nextPublished: boolean) {
    const prev = { isPublished, isScheduled };
    setPending(true);
    setIsPublished(nextPublished);
    setIsScheduled(false);

    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: nextPublished }),
    });

    setPending(false);
    setConfirmOpen(false);
    if (!res.ok) {
      setIsPublished(prev.isPublished);
      setIsScheduled(prev.isScheduled);
      toast.error("Failed to update");
    }
  }

  const status = isScheduled
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
    : isPublished
      ? {
          label: "Published",
          variant: "default" as const,
          confirmTitle: "Unpublish this post?",
          confirmBody: "It will be hidden from the blog until you publish it again.",
          action: "Unpublish",
        }
      : {
          label: "Unpublished",
          variant: "secondary" as const,
          confirmTitle: "Publish this post?",
          confirmBody: "It will go live on the blog immediately.",
          action: "Publish",
        };

  return (
    <>
      <Badge asChild variant={status.variant}>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="cursor-pointer transition hover:opacity-80"
        >
          {status.label}
        </button>
      </Badge>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{status.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{status.confirmBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                // Keep the dialog open until the request resolves.
                e.preventDefault();
                update(!isPublished);
              }}
              disabled={pending}
            >
              {pending ? "Saving…" : status.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
