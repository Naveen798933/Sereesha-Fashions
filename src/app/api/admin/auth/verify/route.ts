import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, error: "No session token provided." },
      { status: 401 }
    );
  }

  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json(
      { authenticated: false, error: "Session expired or invalid." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: session.adminId,
      role: session.role,
    },
  });
}
