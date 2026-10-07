"use client";

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
    | "Delivered";
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

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredOrders();
    const updated = [order, ...current.filter((o) => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save order to localStorage:", err);
  }
}
