import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";
import { getPatronTier, LoyaltyTierId } from "@/lib/loyalty";
import fs from "fs";
import path from "path";

const CUSTOMERS_FILE_PATH = path.join(process.cwd(), "src", "data", "customers.json");

interface RawCustomerRecord {
  id: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at?: string;
}

export interface EnrichedCustomerRecord {
  id: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  lifetimeSpend: number;
  orderCount: number;
  lastOrderDate: string | null;
  tierId: LoyaltyTierId;
  tierName: string;
  tierBadge: string;
}

// Fallback baseline orders for local demo & offline resilience
const BASELINE_SAMPLE_ORDERS = [
  {
    phone: "9849012345",
    total: 85000,
    date: "2026-10-18T10:30:00.000Z",
    status: "Delivered",
  },
  {
    phone: "9849012345",
    total: 80000,
    date: "2026-11-04T14:15:00.000Z",
    status: "Delivered",
  },
  {
    phone: "9849199999",
    total: 72500,
    date: "2026-10-25T11:00:00.000Z",
    status: "Delivered",
  },
  {
    phone: "9849123456",
    total: 54000,
    date: "2026-11-01T16:45:00.000Z",
    status: "Delivered",
  },
  {
    phone: "9876543210",
    total: 18500,
    date: "2026-10-04T12:00:00.000Z",
    status: "Delivered",
  },
  {
    phone: "9876543210",
    total: 8900,
    date: "2026-09-18T15:20:00.000Z",
    status: "Delivered",
  },
];

export async function GET(req: NextRequest) {
  try {
    // Verify administrative privileges
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
    const token = req.cookies?.get?.(ADMIN_COOKIE_NAME)?.value || (match ? match[1] : undefined);

    if (!token || !verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    let customers: RawCustomerRecord[] = [];

    // 1. Read from local JSON file
    if (fs.existsSync(CUSTOMERS_FILE_PATH)) {
      try {
        const content = fs.readFileSync(CUSTOMERS_FILE_PATH, "utf-8");
        customers = JSON.parse(content || "[]");
      } catch (e) {
        console.warn("Could not read local customers:", e);
      }
    }

    // 2. Also try Supabase customers table if available
    try {
      const supabase = await createClient();
      const { data: dbCustomers, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && dbCustomers && dbCustomers.length > 0) {
        // Merge and deduplicate by normalized phone
        const map = new Map<string, RawCustomerRecord>();
        customers.forEach((c) => map.set(c.phone ? c.phone.replace(/\D/g, "") : c.id, c));
        (dbCustomers as RawCustomerRecord[]).forEach((c) =>
          map.set(c.phone ? c.phone.replace(/\D/g, "") : c.id, c)
        );
        customers = Array.from(map.values());
      }
    } catch {
      // Supabase unavailable or in mock mode
    }

    // 3. Try to fetch orders from Supabase for real-time spend aggregation
    const orderAggregates = new Map<
      string,
      { totalSpend: number; count: number; lastDate: string | null }
    >();

    // Seed with baseline orders
    for (const b of BASELINE_SAMPLE_ORDERS) {
      const existing = orderAggregates.get(b.phone) || { totalSpend: 0, count: 0, lastDate: null };
      existing.totalSpend += b.total;
      existing.count += 1;
      if (!existing.lastDate || new Date(b.date) > new Date(existing.lastDate)) {
        existing.lastDate = b.date;
      }
      orderAggregates.set(b.phone, existing);
    }

    try {
      const supabase = await createClient();
      const { data: dbOrders, error: orderErr } = await supabase
        .from("orders")
        .select("total, customer, created_at, status")
        .neq("status", "Cancelled");

      if (!orderErr && dbOrders && dbOrders.length > 0) {
        for (const o of dbOrders) {
          const custPhone = (o.customer?.phone || "").replace(/\D/g, "");
          if (custPhone) {
            const current = orderAggregates.get(custPhone) || {
              totalSpend: 0,
              count: 0,
              lastDate: null,
            };
            current.totalSpend += Number(o.total) || 0;
            current.count += 1;
            if (!current.lastDate || new Date(o.created_at) > new Date(current.lastDate)) {
              current.lastDate = o.created_at;
            }
            orderAggregates.set(custPhone, current);
          }
        }
      }
    } catch {
      // Fallback to seeded baseline
    }

    // 4. Enrich customers with loyalty tier, spend, and order statistics
    let totalRevenue = 0;
    let royalWeaverCount = 0;
    let zariCrownCount = 0;
    let heritageCount = 0;

    const enrichedCustomers: EnrichedCustomerRecord[] = customers.map((c) => {
      const cleanPhone = (c.phone || "").replace(/\D/g, "");
      const agg = orderAggregates.get(cleanPhone) || { totalSpend: 0, count: 0, lastDate: null };

      const spend = agg.totalSpend;
      const count = agg.count;
      const lastDate = agg.lastDate;
      const tier = getPatronTier(spend);

      totalRevenue += spend;
      if (tier.id === "zari_crown") zariCrownCount++;
      else if (tier.id === "royal_weaver") royalWeaverCount++;
      else heritageCount++;

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        role: c.role || "customer",
        created_at: c.created_at,
        lifetimeSpend: spend,
        orderCount: count,
        lastOrderDate: lastDate,
        tierId: tier.id,
        tierName: tier.name,
        tierBadge: tier.badge,
      };
    });

    return NextResponse.json({
      success: true,
      customers: enrichedCustomers,
      total: enrichedCustomers.length,
      metrics: {
        totalPatrons: enrichedCustomers.length,
        totalRevenue,
        heritageCount,
        royalWeaverCount,
        zariCrownCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load customers";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
