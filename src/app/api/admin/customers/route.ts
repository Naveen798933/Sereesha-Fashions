import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

const CUSTOMERS_FILE_PATH = path.join(process.cwd(), "src", "data", "customers.json");

export async function GET() {
  try {
    let customers: any[] = [];

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
        // Merge and deduplicate by phone
        const map = new Map<string, any>();
        customers.forEach((c) => map.set(c.phone, c));
        dbCustomers.forEach((c) => map.set(c.phone, c));
        customers = Array.from(map.values());
      }
    } catch {}

    return NextResponse.json({
      success: true,
      customers,
      total: customers.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load customers" },
      { status: 500 }
    );
  }
}
