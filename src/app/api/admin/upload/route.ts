import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";
import { createServerAdminClient } from "@/lib/supabase/server";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure public/uploads exists
if (!fs.existsSync(UPLOADS_DIR)) {
  try {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  } catch {}
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

function checkAdminAuth(req: NextRequest): boolean {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const token = req.cookies?.get?.(ADMIN_COOKIE_NAME)?.value || (match ? match[1] : undefined);
  return Boolean(token && verifySessionToken(token));
}

export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object" || !("arrayBuffer" in file)) {
      return NextResponse.json(
        { success: false, error: "No file uploaded. Please supply a file field in formData." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File exceeds 25MB maximum upload limit." },
        { status: 400 }
      );
    }

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid file format. Only JPEG, PNG, WebP, AVIF, and MP4/WebM videos are allowed.",
        },
        { status: 400 }
      );
    }

    // Determine extension
    const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "bin";
    const randomHash = crypto.randomBytes(8).toString("hex");
    const uniqueFileName = `atelier_${Date.now()}_${randomHash}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Try uploading to Supabase Storage if configured
    let cloudUrl: string | null = null;
    try {
      const supabase = createServerAdminClient();
      const bucket = mimeType.startsWith("video/") ? "atelier-videos" : "product-images";

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueFileName, buffer, { contentType: mimeType, upsert: true });

      if (!error && data?.path) {
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        if (publicData?.publicUrl) {
          cloudUrl = publicData.publicUrl;
        }
      }
    } catch {
      // Graceful fallback to local uploads directory
    }

    // 2. Save file to local public/uploads/ as reliable storage
    const targetFilePath = path.join(UPLOADS_DIR, uniqueFileName);
    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = cloudUrl || `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      fileSize: file.size,
      mimeType,
      message: "Media asset uploaded successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to process upload";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
