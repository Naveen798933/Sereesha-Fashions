import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail, OrderEmailPayload } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as OrderEmailPayload;

    if (!payload || !payload.orderId || !payload.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required order or customer email fields" },
        { status: 400 }
      );
    }

    const result = await sendOrderConfirmationEmail(payload);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Order confirmation email dispatch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error sending email",
      },
      { status: 500 }
    );
  }
}
