import { NextRequest, NextResponse } from "next/server";
import { verifyHandloomCertificate } from "@/lib/authenticity";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query =
      searchParams.get("query") ||
      searchParams.get("cert") ||
      searchParams.get("slug") ||
      searchParams.get("id");

    if (!query || !query.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing query parameter. Provide cert, query, or slug to verify.",
        },
        { status: 400 }
      );
    }

    const certificate = verifyHandloomCertificate(query.trim());

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          error: `No certified handloom record found matching query "${query}". Please verify the 8-digit certificate number on your Silk Mark tag.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      certificate,
      verifiedAt: new Date().toISOString(),
      authority: "Silk Mark Organization of India (SMOI) & Sreesha Elegance Atelier Registry",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to verify certificate";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
