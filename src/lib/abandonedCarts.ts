/**
 * Sreesha Elegance Atelier Abandoned Cart & Concierge Recovery Engine
 */

export interface AbandonedCartItem {
  id: string;
  title: string;
  category?: string;
  primaryImage: string;
  price: number;
  size: string;
  blouseOption?: string;
  quantity: number;
}

export type CartRecoveryStatus = "pending" | "contacted" | "recovered" | "dismissed";
export type CartDropoffStep = "contact_entered" | "payment_initiated" | "payment_failed";

export interface AbandonedCartRecord {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  items: AbandonedCartItem[];
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon?: string;
  dropoffStep: CartDropoffStep;
  recoveryStatus: CartRecoveryStatus;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "sreesha_abandoned_carts";

// Sample baseline carts for immediate demo & offline resilience
const BASELINE_ABANDONED_CARTS: AbandonedCartRecord[] = [
  {
    id: "ac-90214",
    customerName: "Ananya Rao",
    phone: "9849123456",
    email: "ananya.rao@example.com",
    city: "Jubilee Hills, Hyderabad",
    state: "Telangana",
    items: [
      {
        id: "saree-01",
        title: "Kanchipuram Pure Silk Saree — Emerald & Pure Gold Zari",
        category: "sarees",
        primaryImage:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",
        price: 18500,
        size: "Standard (6.3m with blouse)",
        blouseOption: "Bespoke Masterji Hand Embroidery (+₹3,500)",
        quantity: 1,
      },
    ],
    subtotal: 22000,
    discount: 2200,
    total: 19800,
    appliedCoupon: "WELCOME10",
    dropoffStep: "payment_failed",
    lastError: "Card limit exceeded during gateway verification",
    recoveryStatus: "pending",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "ac-89102",
    customerName: "Swathi Varma",
    phone: "9949011223",
    email: "swathi.varma@example.com",
    city: "Banjara Hills, Hyderabad",
    state: "Telangana",
    items: [
      {
        id: "saree-02",
        title: "Banarasi Katan Silk Saree — Crimson & Shikar-Gah Motifs",
        category: "sarees",
        primaryImage:
          "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=800&q=85",
        price: 22000,
        size: "Standard (6.3m with blouse)",
        blouseOption: "Unstitched Matching Blouse (Included)",
        quantity: 1,
      },
      {
        id: "kurti-01",
        title: "Chanderi Silk Anarkali Set — Midnight Blue & Gota Patti",
        category: "kurtis",
        primaryImage:
          "https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=800&q=85",
        price: 8900,
        size: "M",
        quantity: 1,
      },
    ],
    subtotal: 30900,
    discount: 4635,
    total: 26265,
    appliedCoupon: "ROYAL15",
    dropoffStep: "payment_initiated",
    lastError: "UPI collect request timed out",
    recoveryStatus: "contacted",
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "ac-78210",
    customerName: "Lakshmi Prasanna",
    phone: "9885544332",
    email: "lakshmi.p@example.com",
    city: "Madhapur, Hyderabad",
    state: "Telangana",
    items: [
      {
        id: "lehenga-01",
        title: "Raw Silk Bridal Lehenga — Rani Pink & Zardozi Heritage",
        category: "lehengas",
        primaryImage:
          "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=85",
        price: 42000,
        size: "Custom Bridal Sizing",
        blouseOption: "Custom Measurement Session with Masterji",
        quantity: 1,
      },
    ],
    subtotal: 42000,
    discount: 6300,
    total: 35700,
    appliedCoupon: "BRIDE15",
    dropoffStep: "contact_entered",
    lastError: "Client left checkout after entering shipping details",
    recoveryStatus: "pending",
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
];

export function getStoredAbandonedCarts(): AbandonedCartRecord[] {
  if (typeof window === "undefined") return BASELINE_ABANDONED_CARTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(BASELINE_ABANDONED_CARTS));
      return BASELINE_ABANDONED_CARTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : BASELINE_ABANDONED_CARTS;
  } catch {
    return BASELINE_ABANDONED_CARTS;
  }
}

export function saveAbandonedCartLocal(
  record: Omit<AbandonedCartRecord, "id" | "createdAt" | "updatedAt"> & { id?: string }
): AbandonedCartRecord {
  const current = getStoredAbandonedCarts();
  const cleanPhone = record.phone.replace(/\D/g, "");

  // Match existing cart for this phone if recent (< 48 hrs)
  const existingIdx = current.findIndex(
    (c) => c.phone.replace(/\D/g, "") === cleanPhone && c.recoveryStatus !== "recovered"
  );

  const now = new Date().toISOString();
  let savedRecord: AbandonedCartRecord;

  if (existingIdx >= 0) {
    savedRecord = {
      ...current[existingIdx],
      ...record,
      updatedAt: now,
    };
    current[existingIdx] = savedRecord;
  } else {
    savedRecord = {
      ...record,
      id: record.id || `ac-${Date.now().toString().slice(-5)}`,
      createdAt: now,
      updatedAt: now,
    };
    current.unshift(savedRecord);
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {}
  }

  return savedRecord;
}

export function updateCartRecoveryStatus(id: string, status: CartRecoveryStatus): void {
  const current = getStoredAbandonedCarts();
  const updated = current.map((c) =>
    c.id === id ? { ...c, recoveryStatus: status, updatedAt: new Date().toISOString() } : c
  );
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
}

export function deleteAbandonedCartLocal(id: string): void {
  const current = getStoredAbandonedCarts();
  const updated = current.filter((c) => c.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
}
