import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

const CUSTOMERS_FILE_PATH = path.join(process.cwd(), "src", "data", "customers.json");

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

function readLocalCustomers(): CustomerRecord[] {
  try {
    if (fs.existsSync(CUSTOMERS_FILE_PATH)) {
      const content = fs.readFileSync(CUSTOMERS_FILE_PATH, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (err) {
    console.warn("Could not read local customers file:", err);
  }
  return [];
}

function saveLocalCustomer(customer: CustomerRecord): void {
  try {
    const list = readLocalCustomers();
    const existingIndex = list.findIndex((c) => c.phone === customer.phone);
    if (existingIndex >= 0) {
      list[existingIndex] = {
        ...list[existingIndex],
        ...customer,
        updated_at: new Date().toISOString(),
      };
    } else {
      list.push(customer);
    }
    const dir = path.dirname(CUSTOMERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CUSTOMERS_FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to local customers file:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, name, action } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Please enter your 10-digit mobile number" },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    let existingCustomer: CustomerRecord | null = null;

    // 1. Check local file first
    const localCustomers = readLocalCustomers();
    const localMatch = localCustomers.find((c) => c.phone === cleanPhone);
    if (localMatch) {
      existingCustomer = localMatch;
    }

    // 2. Also try Supabase customers table if available
    try {
      const supabase = await createClient();
      const { data: dbCustomer, error: searchError } = await supabase
        .from("customers")
        .select("*")
        .eq("phone", cleanPhone)
        .maybeSingle();

      if (!searchError && dbCustomer) {
        existingCustomer = dbCustomer as CustomerRecord;
      }
    } catch (dbErr) {
      // Supabase table might not exist yet or offline
    }

    // Handle SIGNUP
    if (action === "signup") {
      const cleanName = (name || "").trim();
      if (!cleanName) {
        return NextResponse.json(
          { success: false, error: "Please provide your full name" },
          { status: 400 }
        );
      }

      if (existingCustomer) {
        const updated: CustomerRecord = {
          ...existingCustomer,
          name: cleanName,
          updated_at: new Date().toISOString(),
        };
        saveLocalCustomer(updated);

        // Try updating in Supabase as well
        try {
          const supabase = await createClient();
          await supabase
            .from("customers")
            .update({ name: cleanName, updated_at: updated.updated_at })
            .eq("phone", cleanPhone);
        } catch {}

        return NextResponse.json({
          success: true,
          customer: updated,
          isNew: false,
          message: `Welcome back, ${cleanName}! Your atelier access is ready.`,
        });
      }

      // New customer creation
      const newCustomer: CustomerRecord = {
        id: `cust_${cleanPhone}`,
        name: cleanName,
        phone: cleanPhone,
        role: "customer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      saveLocalCustomer(newCustomer);

      // Attempt to save to Supabase
      try {
        const supabase = await createClient();
        const { data: created } = await supabase
          .from("customers")
          .insert([newCustomer])
          .select()
          .single();

        if (created) {
          saveLocalCustomer(created);
          return NextResponse.json({
            success: true,
            customer: created,
            isNew: true,
            message: `Welcome to Sreesha Elegance, ${cleanName}!`,
          });
        }
      } catch {}

      return NextResponse.json({
        success: true,
        customer: newCustomer,
        isNew: true,
        message: `Welcome to Sreesha Elegance, ${cleanName}!`,
      });
    }

    // Handle LOGIN
    if (existingCustomer) {
      return NextResponse.json({
        success: true,
        customer: existingCustomer,
        isNew: false,
        message: `Welcome back, ${existingCustomer.name}!`,
      });
    }

    // If user provided a name during login fallback, auto-register them seamlessly!
    if (name && name.trim()) {
      const cleanName = name.trim();
      const newCustomer: CustomerRecord = {
        id: `cust_${cleanPhone}`,
        name: cleanName,
        phone: cleanPhone,
        role: "customer",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      saveLocalCustomer(newCustomer);

      try {
        const supabase = await createClient();
        await supabase.from("customers").insert([newCustomer]);
      } catch {}

      return NextResponse.json({
        success: true,
        customer: newCustomer,
        isNew: true,
        message: `Welcome to Sreesha Elegance, ${cleanName}!`,
      });
    }

    // Not registered yet
    return NextResponse.json(
      {
        success: false,
        notFound: true,
        error: "No account found with this phone number. Please register with your name.",
      },
      { status: 404 }
    );
  } catch (error: unknown) {
    console.error("Phone auth API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
