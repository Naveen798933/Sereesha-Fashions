import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Please enter a promotional coupon code" },
        { status: 400 }
      );
    }

    const cleanCode = String(code).trim().toUpperCase();
    const total = Number(cartTotal) || 0;

    // First check hardcoded boutique coupons as fallback
    if (cleanCode === "WELCOME10") {
      const discount = Math.round(total * 0.1);
      return NextResponse.json({
        valid: true,
        code: cleanCode,
        discountType: "percentage",
        discountValue: 10,
        discountAmount: discount,
        message: "Atelier Welcome Privileges Applied (10% Savings)",
      });
    }

    if (cleanCode === "ROYAL15") {
      if (total < 15000) {
        return NextResponse.json({
          valid: false,
          error: "ROYAL15 requires a minimum order value of ₹15,000",
        });
      }
      const discount = Math.round(total * 0.15);
      return NextResponse.json({
        valid: true,
        code: cleanCode,
        discountType: "percentage",
        discountValue: 15,
        discountAmount: discount,
        message: "Royal Nizam Privileges Applied (15% Savings)",
      });
    }

    if (cleanCode === "BRIDE15") {
      const discount = Math.round(total * 0.15);
      return NextResponse.json({
        valid: true,
        code: cleanCode,
        discountType: "percentage",
        discountValue: 15,
        discountAmount: discount,
        message: "Bridal Season Privileges Applied (15% Savings)",
      });
    }

    if (cleanCode === "FESTIVE2500") {
      if (total < 25000) {
        return NextResponse.json({
          valid: false,
          error: "FESTIVE2500 requires a minimum order value of ₹25,000",
        });
      }
      return NextResponse.json({
        valid: true,
        code: cleanCode,
        discountType: "fixed",
        discountValue: 2500,
        discountAmount: 2500,
        message: "Festive Celebration Discount Applied (₹2,500 FLAT OFF)",
      });
    }

    // Next query Supabase coupons table
    try {
      const supabase = await createClient();
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", cleanCode)
        .eq("active", true)
        .maybeSingle();

      if (!error && coupon) {
        if (total < (coupon.min_order || 0)) {
          return NextResponse.json({
            valid: false,
            error: `Code ${cleanCode} requires a minimum cart value of ₹${coupon.min_order.toLocaleString("en-IN")}`,
          });
        }

        let discount = 0;
        if (coupon.discount_type === "percentage") {
          discount = Math.round((total * coupon.discount_value) / 100);
        } else {
          discount = Math.min(total, coupon.discount_value);
        }

        return NextResponse.json({
          valid: true,
          code: cleanCode,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value,
          discountAmount: discount,
          message: `Privilege code ${cleanCode} applied successfully!`,
        });
      }
    } catch {
      // ignore db error, proceed to fallback error
    }

    return NextResponse.json({
      valid: false,
      error: `Coupon "${cleanCode}" is invalid or expired. Try WELCOME10 or ROYAL15`,
    });
  } catch (error: unknown) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Unable to validate coupon code at this time." },
      { status: 500 }
    );
  }
}
