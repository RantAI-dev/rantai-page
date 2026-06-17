import { NextRequest, NextResponse } from "next/server";
import { runBlobGc } from "@/lib/blob-gc";

// Listing + deleting many blobs can take a while; give the function headroom.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically when
  // CRON_SECRET is configured. This also gates manual invocations.
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ?dryRun=1 reports what would be deleted without deleting anything.
  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";

  const result = await runBlobGc({ dryRun });
  return NextResponse.json(result);
}
