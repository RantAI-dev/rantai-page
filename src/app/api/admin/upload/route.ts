import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { getUploadError, resolveUploadFolder } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const uploadError = getUploadError(file);
  if (uploadError) {
    return NextResponse.json({ error: uploadError }, { status: 400 });
  }

  const folder = resolveUploadFolder(formData.get("folder") as string | null);

  const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
