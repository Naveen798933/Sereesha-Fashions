import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  AppointmentRecord,
  APPOINTMENT_SERVICES,
  AppointmentServiceType,
} from "@/lib/appointments";
import { sendAppointmentConfirmationEmail, sendAdminAppointmentAlert } from "@/lib/email";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      serviceType,
      mode,
      date,
      timeSlot,
      city,
      occasionDate,
      notes,
    } = body;

    if (!customerName || !customerPhone || !customerEmail || !serviceType || !date || !timeSlot) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required appointment details." },
        { status: 400 }
      );
    }

    if (!customerEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const serviceDef = APPOINTMENT_SERVICES.find((s) => s.id === serviceType);
    const serviceTitle = serviceDef ? serviceDef.title : "Atelier Private Consultation";

    const appointmentId = `SE-APT-${Math.floor(1000 + Math.random() * 9000)}`;

    const record: AppointmentRecord = {
      id: appointmentId,
      createdAt: new Date().toISOString(),
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      customerEmail: String(customerEmail).trim().toLowerCase(),
      serviceType: serviceType as AppointmentServiceType,
      serviceTitle,
      mode: mode === "virtual_video" ? "virtual_video" : "in_store",
      date: String(date).trim(),
      timeSlot: String(timeSlot).trim(),
      city: String(city || "Hyderabad").trim(),
      occasionDate: occasionDate ? String(occasionDate).trim() : undefined,
      notes: notes ? String(notes).trim() : undefined,
      status: "Confirmed",
    };

    // Attempt to persist in Supabase appointments table if available
    try {
      const supabase = await createClient();
      await supabase.from("appointments").insert({
        id: record.id,
        created_at: record.createdAt,
        customer_name: record.customerName,
        customer_phone: record.customerPhone,
        customer_email: record.customerEmail,
        service_type: record.serviceType,
        service_title: record.serviceTitle,
        mode: record.mode,
        date: record.date,
        time_slot: record.timeSlot,
        city: record.city,
        occasion_date: record.occasionDate,
        notes: record.notes,
        status: record.status,
      });
    } catch {
      // Graceful fallback to client storage
    }

    // 1. Dispatch luxury patron confirmation email via Resend
    const emailRes = await sendAppointmentConfirmationEmail({
      appointmentId: record.id,
      customerName: record.customerName,
      customerEmail: record.customerEmail,
      customerPhone: record.customerPhone,
      serviceType: record.serviceType,
      serviceLabel: record.serviceTitle,
      date: record.date,
      timeSlot: record.timeSlot,
      mode: record.mode,
      city: record.city,
      occasionDate: record.occasionDate,
      notes: record.notes,
    });

    // 2. Alert atelier boutique management
    sendAdminAppointmentAlert({
      appointmentId: record.id,
      customerName: record.customerName,
      customerEmail: record.customerEmail,
      customerPhone: record.customerPhone,
      serviceType: record.serviceType,
      serviceLabel: record.serviceTitle,
      date: record.date,
      timeSlot: record.timeSlot,
      mode: record.mode,
      city: record.city,
      occasionDate: record.occasionDate,
      notes: record.notes,
    }).catch((err) => console.warn("[Appointments API] Admin alert notification notice:", err));

    return NextResponse.json({
      success: true,
      appointment: record,
      emailId: emailRes.id,
      message: "Atelier appointment confirmed successfully.",
    });
  } catch (err: unknown) {
    console.error("[Appointments API Error]:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error booking appointment." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    let adminToken: string | undefined;

    // Extract admin session token from request cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`(?:^|; )${ADMIN_COOKIE_NAME}=([^;]*)`));
    if (match) {
      adminToken = decodeURIComponent(match[1]);
    } else {
      try {
        const cookieStore = await cookies();
        adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
      } catch {}
    }

    if (!adminToken || !verifySessionToken(adminToken)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required." },
        { status: 401 }
      );
    }

    // Attempt to read from Supabase
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, appointments: data });
      }
    } catch {}

    return NextResponse.json({ success: true, appointments: [] });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
