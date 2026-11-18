import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";
import { createServerAdminClient } from "@/lib/supabase/server";
import { OrderStatus } from "@/lib/orders";
import { sendShippingNotificationEmail, sendDeliveryNotificationEmail } from "@/lib/email";
import { readLocalOrders, writeLocalOrders } from "@/lib/serverStores";

function checkAdminAuth(req: NextRequest): boolean {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const token = req.cookies?.get?.(ADMIN_COOKIE_NAME)?.value || (match ? match[1] : undefined);
  return Boolean(token && verifySessionToken(token));
}

// GET: Returns orders for Admin Dashboard
export async function GET(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    let orders = readLocalOrders();

    try {
      const supabase = createServerAdminClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        orders = data.map((d) => ({
          id: d.id,
          date: d.date || "Recent",
          createdAt: d.created_at,
          status: d.status as OrderStatus,
          carrier: d.carrier || "BlueDart Express",
          trackingNumber: d.tracking_number || "",
          estimatedDelivery: d.estimated_delivery || "",
          subtotal: Number(d.subtotal || 0),
          shippingFee: Number(d.shipping_fee || 0),
          discount: Number(d.discount || 0),
          total: Number(d.total || 0),
          paymentMethod: d.payment_method || "upi",
          paymentStatus: d.payment_status || "paid",
          customer: d.customer || {
            fullName: "Patron",
            phone: "",
            email: "",
            address: "",
            city: "Hyderabad",
            state: "Telangana",
            pinCode: "500085",
          },
          items: Array.isArray(d.order_items)
            ? d.order_items.map(
                (it: {
                  id: string;
                  title: string;
                  category?: string;
                  primary_image?: string;
                  price: number;
                  size: string;
                  blouse_option?: string;
                  quantity: number;
                }) => ({
                  id: it.id,
                  title: it.title,
                  category: it.category || "sarees",
                  primaryImage: it.primary_image || "",
                  price: Number(it.price || 0),
                  size: it.size || "Standard",
                  blouseOption: it.blouse_option,
                  quantity: it.quantity || 1,
                })
              )
            : [],
        }));
        writeLocalOrders(orders);
      }
    } catch {
      // Return local cache on DB failure
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const status = searchParams.get("status");

    if (status && status !== "ALL") {
      orders = orders.filter((o) => o.status === status);
    }

    if (search) {
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(search) ||
          o.customer.fullName.toLowerCase().includes(search) ||
          o.customer.phone.includes(search) ||
          o.customer.email.toLowerCase().includes(search) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      orders,
      totalCount: orders.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PATCH: Update order status or tracking number
export async function PATCH(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, status, carrier, trackingNumber, estimatedDelivery } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required." }, { status: 400 });
    }

    // 1. Update local JSON
    const current = readLocalOrders();
    const targetOrder = current.find((o) => o.id === orderId);

    if (!targetOrder) {
      return NextResponse.json(
        { success: false, error: `Order #${orderId} not found.` },
        { status: 404 }
      );
    }

    if (status) targetOrder.status = status;
    if (carrier) targetOrder.carrier = carrier;
    if (trackingNumber !== undefined) targetOrder.trackingNumber = trackingNumber;
    if (estimatedDelivery) targetOrder.estimatedDelivery = estimatedDelivery;

    writeLocalOrders(current);

    // 2. Update Supabase
    try {
      const supabase = createServerAdminClient();
      await supabase
        .from("orders")
        .update({
          status: targetOrder.status,
          carrier: targetOrder.carrier,
          tracking_number: targetOrder.trackingNumber,
          estimated_delivery: targetOrder.estimatedDelivery,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    } catch (dbErr) {
      console.warn("[Orders API] Supabase update notice:", dbErr);
    }

    // 3. Trigger customer notifications when dispatched or delivered
    if (status && status.includes("Dispatched") && targetOrder.customer.email) {
      sendShippingNotificationEmail({
        orderId: targetOrder.id,
        customerName: targetOrder.customer.fullName,
        customerEmail: targetOrder.customer.email,
        carrier: targetOrder.carrier,
        trackingNumber: targetOrder.trackingNumber || "Assigned on Dispatch",
        items: targetOrder.items.map((it) => ({
          title: it.title,
          size: it.size || "Standard",
          quantity: it.quantity,
          price: it.price,
        })),
        shippingAddress: {
          street: targetOrder.customer.address,
          city: targetOrder.customer.city,
          state: targetOrder.customer.state,
          pinCode: targetOrder.customer.pinCode,
        },
      }).catch((e) => console.warn("[Orders API] Shipping email notice:", e));
    } else if (status === "Delivered" && targetOrder.customer.email) {
      sendDeliveryNotificationEmail({
        orderId: targetOrder.id,
        customerName: targetOrder.customer.fullName,
        customerEmail: targetOrder.customer.email,
        deliveredDate: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        carrier: targetOrder.carrier || "BlueDart Express",
        trackingNumber: targetOrder.trackingNumber || "Delivered",
        items: targetOrder.items.map((it) => ({
          title: it.title,
          size: it.size || "Standard",
          quantity: it.quantity,
          price: it.price,
        })),
      }).catch((e) => console.warn("[Orders API] Delivery email notice:", e));
    }

    return NextResponse.json({
      success: true,
      order: targetOrder,
      message: `Order #${orderId} updated successfully.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update order";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
