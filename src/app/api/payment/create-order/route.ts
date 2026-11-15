import { NextResponse } from "next/server";
import { razorpay, getRazorpayKeyId } from "@/lib/razorpay";
import { PRODUCTS } from "@/data/products";
import { createServerAdminClient } from "@/lib/supabase/server";

interface OrderItemInput {
  id?: string;
  productId?: string;
  quantity?: number;
  price?: number;
  title?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      items,
      couponCode,
      giftPackaging,
      customer,
      amount: clientAmount,
      currency = "INR",
      receipt,
      notes = {},
    } = body;

    let finalAmount = 0;
    let computedSubtotal = 0;
    let computedDiscount = 0;

    // 1. Authoritative Server-Side Price Calculation if items array provided
    if (Array.isArray(items) && items.length > 0) {
      // Create price map from base catalog
      const productMap = new Map<string, { price: number; title: string; inStock?: boolean }>();
      PRODUCTS.forEach((p) => {
        productMap.set(p.id, { price: p.price, title: p.title, inStock: p.inStock ?? true });
      });

      // Try checking dynamic products from database
      try {
        const supabase = createServerAdminClient();
        const itemIds = items.map((it: OrderItemInput) => it.id || it.productId).filter(Boolean);
        const { data: dbProducts } = await supabase
          .from("products")
          .select("id, title, price, is_in_stock")
          .in("id", itemIds);

        if (dbProducts && Array.isArray(dbProducts)) {
          dbProducts.forEach((dp) => {
            productMap.set(dp.id, {
              price: Number(dp.price),
              title: dp.title,
              inStock: dp.is_in_stock !== false,
            });
          });
        }
      } catch {
        // Fall back gracefully to base PRODUCTS catalog
      }

      // Calculate authoritative subtotal
      for (const it of items as OrderItemInput[]) {
        const id = it.id || it.productId || "";
        const catalogItem = productMap.get(id);
        const quantity = Math.max(1, Number(it.quantity) || 1);
        const price = catalogItem ? catalogItem.price : Number(it.price) || 0;
        computedSubtotal += price * quantity;
      }

      // Validate promotional coupon code authoritatively
      if (couponCode && typeof couponCode === "string") {
        const cleanCode = couponCode.trim().toUpperCase();
        if (cleanCode === "WELCOME10") {
          computedDiscount = Math.round(computedSubtotal * 0.1);
        } else if (cleanCode === "ROYAL15") {
          if (computedSubtotal >= 15000) {
            computedDiscount = Math.round(computedSubtotal * 0.15);
          }
        } else if (cleanCode === "BRIDE15") {
          computedDiscount = Math.round(computedSubtotal * 0.15);
        } else if (cleanCode === "FESTIVE2500") {
          if (computedSubtotal >= 25000) {
            computedDiscount = 2500;
          }
        } else {
          try {
            const supabase = createServerAdminClient();
            const { data: coupon } = await supabase
              .from("coupons")
              .select("*")
              .eq("code", cleanCode)
              .eq("active", true)
              .single();

            if (coupon) {
              const minSpend = Number(
                coupon.min_order ?? coupon.min_spend ?? coupon.min_order_amount ?? 0
              );
              if (computedSubtotal >= minSpend) {
                const discountVal = Number(coupon.discount_value || coupon.value || 0);
                const discountType = coupon.discount_type || coupon.type;
                computedDiscount =
                  discountType === "percentage"
                    ? Math.round((computedSubtotal * discountVal) / 100)
                    : discountVal;
              }
            }
          } catch {
            // Ignore coupon lookup errors
          }
        }
      }

      const shippingFee = computedSubtotal >= 5000 ? 0 : 250;
      const packagingFee = giftPackaging ? 250 : 0;
      finalAmount = Math.max(0, computedSubtotal - computedDiscount + shippingFee + packagingFee);
    } else if (clientAmount && Number(clientAmount) > 0) {
      // Fallback for direct unit tests or generic payment orders
      finalAmount = Number(clientAmount);
    }

    if (!finalAmount || finalAmount <= 0) {
      return NextResponse.json({ error: "Invalid order amount specified" }, { status: 400 });
    }

    // Razorpay amount is in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(Number(finalAmount) * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        ...notes,
        customerName: customer?.fullName || notes?.customerName || "",
        customerEmail: customer?.email || notes?.customerEmail || "",
        customerPhone: customer?.phone || notes?.customerPhone || "",
        computedSubtotal: String(computedSubtotal),
        computedDiscount: String(computedDiscount),
      },
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch {
      if (
        process.env.NODE_ENV === "production" &&
        process.env.RAZORPAY_KEY_ID &&
        process.env.RAZORPAY_KEY_SECRET
      ) {
        return NextResponse.json(
          { error: "Payment gateway error. Please try again." },
          { status: 502 }
        );
      }
      // In dev or demo mode without live Razorpay keys, gracefully provide mock order
      const orderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      order = {
        id: orderId,
        entity: "order",
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: "created",
        created_at: Math.floor(Date.now() / 1000),
      };
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment gateway order" },
      { status: 500 }
    );
  }
}
