"use client";

import { createClient } from "@/lib/supabase/client";

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  category: string;
  primaryImage: string;
  price: number;
  size: string;
  blouseOption?: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  createdAt: string;
  status:
    | "Order Placed & Verified"
    | "Atelier Inspection & Silk Tagged"
    | "Dispatched via BlueDart Express"
    | "Out for Doorstep Delivery"
    | "Delivered"
    | "Cancelled";
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: "upi" | "card" | "netbanking" | "cod";
  customer: OrderCustomer;
  items: OrderItem[];
}

const STORAGE_KEY = "sreesha_elegance_orders";

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: "SE-84920",
    date: "04 October 2026",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Dispatched via BlueDart Express",
    carrier: "BlueDart Air Express",
    trackingNumber: "BD893201948IN",
    estimatedDelivery: "Thursday, 08 October 2026",
    subtotal: 18500,
    shippingFee: 0,
    discount: 0,
    total: 18500,
    paymentMethod: "upi",
    customer: {
      fullName: "Sreeja Varma",
      phone: "+91 98490 12345",
      email: "sreeja.varma@example.com",
      address: "Flat 402, Royal Residency, Road No. 36, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pinCode: "500033",
      notes: "Silk Mark inspection requested at delivery.",
    },
    items: [
      {
        id: "ks-01",
        title: "Kanchipuram Pure Silk Saree — Emerald & Pure Gold Zari",
        category: "sarees",
        primaryImage:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",
        price: 18500,
        size: "Standard 5.5m + 0.8m Blouse",
        blouseOption: "Unstitched Matching Blouse (Included)",
        quantity: 1,
      },
    ],
  },
  {
    id: "SE-79213",
    date: "18 September 2026",
    createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Delivered",
    carrier: "Delhivery Surface",
    trackingNumber: "DL193840294IN",
    estimatedDelivery: "Delivered on 22 September 2026",
    subtotal: 8900,
    shippingFee: 0,
    discount: 0,
    total: 8900,
    paymentMethod: "card",
    customer: {
      fullName: "Sreeja Varma",
      phone: "+91 98490 12345",
      email: "sreeja.varma@example.com",
      address: "Flat 402, Royal Residency, Road No. 36, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pinCode: "500033",
    },
    items: [
      {
        id: "ku-01",
        title: "Chanderi Silk Anarkali Set — Midnight Blue & Gota Patti",
        category: "kurtis",
        primaryImage:
          "https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=800&q=85",
        price: 8900,
        size: "M",
        quantity: 1,
      },
    ],
  },
];

export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return INITIAL_SAMPLE_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_ORDERS));
      return INITIAL_SAMPLE_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLE_ORDERS;
  } catch {
    return INITIAL_SAMPLE_ORDERS;
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getStoredOrders();
  const normalized = id.trim().toUpperCase();
  return orders.find(
    (o) =>
      o.id.toUpperCase() === normalized || o.id.replace(/-/g, "") === normalized.replace(/-/g, "")
  );
}

export async function fetchOrderById(id: string): Promise<Order | undefined> {
  const normalized = id.trim().toUpperCase();
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .or(`id.eq.${normalized},id.eq.${id}`)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        date: data.date,
        createdAt: data.created_at,
        status: data.status,
        carrier: data.carrier,
        trackingNumber: data.tracking_number,
        estimatedDelivery: data.estimated_delivery,
        subtotal: Number(data.subtotal),
        shippingFee: Number(data.shipping_fee),
        discount: Number(data.discount),
        total: Number(data.total),
        paymentMethod: data.payment_method,
        customer: data.customer,
        items: (data.order_items || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category || "Ethnic Wear",
          primaryImage: item.primary_image || "",
          price: Number(item.price),
          size: item.size,
          blouseOption: item.blouse_option,
          quantity: item.quantity,
        })),
      };
    }
  } catch (err) {
    console.warn("Supabase order fetch fallback to local:", err);
  }

  return getOrderById(id);
}

export async function fetchUserOrders(userId?: string, userPhone?: string): Promise<Order[]> {
  const cleanPhone = userPhone?.replace(/\D/g, "");
  if (userId || cleanPhone) {
    try {
      const supabase = createClient();
      let query = supabase.from("orders").select("*, order_items(*)");

      if (userId && cleanPhone) {
        query = query.or(`user_id.eq.${userId},customer->>phone.eq.${cleanPhone}`);
      } else if (userId) {
        query = query.eq("user_id", userId);
      } else if (cleanPhone) {
        query = query.eq("customer->>phone", cleanPhone);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((o: any) => ({
          id: o.id,
          date: o.date,
          createdAt: o.created_at,
          status: o.status,
          carrier: o.carrier,
          trackingNumber: o.tracking_number,
          estimatedDelivery: o.estimated_delivery,
          subtotal: Number(o.subtotal),
          shippingFee: Number(o.shipping_fee),
          discount: Number(o.discount),
          total: Number(o.total),
          paymentMethod: o.payment_method,
          customer: o.customer,
          items: (o.order_items || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            primaryImage: item.primary_image,
            price: Number(item.price),
            size: item.size,
            blouseOption: item.blouse_option,
            quantity: item.quantity,
          })),
        }));
      }
    } catch (err) {
      console.warn("Could not fetch remote user orders:", err);
    }
  }

  return getStoredOrders();
}

export async function saveOrder(order: Order, userId?: string): Promise<void> {
  // Always persist locally
  if (typeof window !== "undefined") {
    try {
      const current = getStoredOrders();
      const updated = [order, ...current.filter((o) => o.id !== order.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save order to localStorage:", err);
    }
  }

  // Persist to Supabase if available
  try {
    const supabase = createClient();
    const payload = {
      id: order.id,
      user_id: userId || null,
      date: order.date,
      status: order.status,
      carrier: order.carrier,
      tracking_number: order.trackingNumber,
      estimated_delivery: order.estimatedDelivery,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      discount: order.discount,
      total: order.total,
      payment_method: order.paymentMethod,
      customer: order.customer,
    };

    let { error: orderError } = await supabase.from("orders").insert(payload);

    // If UUID validation fails because user_id column in remote DB is still UUID type, retry with user_id: null
    if (
      orderError &&
      (orderError.code === "22P02" || orderError.message?.toLowerCase().includes("uuid"))
    ) {
      const { error: retryError } = await supabase.from("orders").insert({
        ...payload,
        user_id: null,
      });
      orderError = retryError;
    }

    if (orderError) {
      console.warn("Supabase order insert notice:", orderError.message);
      return;
    }

    if (order.items && order.items.length > 0) {
      const itemsToInsert = order.items.map((it) => ({
        order_id: order.id,
        product_id: it.id,
        title: it.title,
        category: it.category,
        primary_image: it.primaryImage,
        price: it.price,
        size: it.size,
        blouse_option: it.blouseOption || null,
        quantity: it.quantity,
      }));

      await supabase.from("order_items").insert(itemsToInsert);
    }
  } catch (err) {
    console.warn("Supabase order sync error:", err);
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: Order["status"]
): Promise<boolean> {
  // 1. Update local storage
  if (typeof window !== "undefined") {
    try {
      const current = getStoredOrders();
      const updated = current.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Local storage order status update warning:", e);
    }
  }

  // 2. Update Supabase
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    return !error;
  } catch (e) {
    console.warn("Supabase order status update error:", e);
    return false;
  }
}

export async function updateOrderTracking(
  orderId: string,
  trackingNumber: string,
  carrier: string = "BlueDart Express"
): Promise<boolean> {
  // 1. Update local storage
  if (typeof window !== "undefined") {
    try {
      const current = getStoredOrders();
      const updated = current.map((o) =>
        o.id === orderId ? { ...o, trackingNumber, carrier } : o
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Local storage tracking update warning:", e);
    }
  }

  // 2. Update Supabase
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({
        tracking_number: trackingNumber,
        carrier,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);
    return !error;
  } catch (e) {
    console.warn("Supabase order tracking update error:", e);
    return false;
  }
}
