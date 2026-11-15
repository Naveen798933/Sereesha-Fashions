/**
 * Sreesha Elegance — Atelier Appointment Services & Contracts
 */

export type AppointmentServiceType =
  "bridal_trousseau" | "masterji_blouse" | "virtual_nri_video" | "festive_styling";

export type AppointmentStatus = "Confirmed" | "Completed" | "Rescheduled" | "Cancelled";

export interface AppointmentServiceOption {
  id: AppointmentServiceType;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  defaultMode: "in_store" | "virtual_video";
  allowedModes: ("in_store" | "virtual_video")[];
  badge?: string;
}

export const APPOINTMENT_SERVICES: AppointmentServiceOption[] = [
  {
    id: "bridal_trousseau",
    title: "Bridal Trousseau & Heirloom Silks",
    subtitle: "Kanchipuram, Banarasi Kadhwa & Paithani Masterpieces",
    description:
      "A dedicated 90-minute private styling salon with our master drapers. Preview certified pure mulberry silks, authentic silver/gold zari borders, and matching dupattas under studio chandeliers.",
    duration: "90 Mins",
    defaultMode: "in_store",
    allowedModes: ["in_store", "virtual_video"],
    badge: "MOST POPULAR",
  },
  {
    id: "masterji_blouse",
    title: "Bespoke Masterji Blouse Tailoring",
    subtitle: "Custom Necklines, Sleeve Embroidery & Exact Fitting",
    description:
      "Meet directly with our masterji at our Kukatpally atelier for personalized measurement taking, custom back designs, neckline contouring, and padding alignment.",
    duration: "60 Mins",
    defaultMode: "in_store",
    allowedModes: ["in_store"],
    badge: "BESPOKE FIT",
  },
  {
    id: "virtual_nri_video",
    title: "Global NRI 1-on-1 Video Shopping",
    subtitle: "Private WhatsApp Walkthrough for Patrons Abroad",
    description:
      "Exclusive video call session for Telugu and Indian diaspora in the USA, UK, Canada, Australia, and UAE. Inspect silk drape, zari sheen, and color tones live on HD video.",
    duration: "60 Mins",
    defaultMode: "virtual_video",
    allowedModes: ["virtual_video"],
    badge: "NRI PRIVÉ",
  },
  {
    id: "festive_styling",
    title: "Festive Wardrobe & Occasion Curation",
    subtitle: "Sangeet, Reception & Milestone Occasion Ensembles",
    description:
      "Curate coordinated lehengas, pure organza tissue sarees, and designer anarkali sets tailored for your festive calendar with our senior fashion stylists.",
    duration: "60 Mins",
    defaultMode: "in_store",
    allowedModes: ["in_store", "virtual_video"],
  },
];

export const ATELIER_TIME_SLOTS = [
  "11:00 AM - 12:30 PM",
  "01:00 PM - 02:30 PM",
  "03:00 PM - 04:30 PM",
  "05:00 PM - 06:30 PM",
  "07:00 PM - 08:30 PM",
];

export interface AppointmentRecord {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: AppointmentServiceType;
  serviceTitle: string;
  mode: "in_store" | "virtual_video";
  date: string;
  timeSlot: string;
  city: string;
  occasionDate?: string;
  notes?: string;
  status: AppointmentStatus;
}

const STORAGE_KEY = "sreesha_appointments_v1";

const INITIAL_DEMO_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: "SE-APT-9041",
    createdAt: "2026-11-14T10:00:00.000Z",
    customerName: "Sowmya Kamineni",
    customerPhone: "+91 98490 54321",
    customerEmail: "sowmya.k@example.com",
    serviceType: "bridal_trousseau",
    serviceTitle: "Bridal Trousseau & Heirloom Silks",
    mode: "in_store",
    date: "Saturday, 21 November 2026",
    timeSlot: "11:00 AM - 12:30 PM",
    city: "Jubilee Hills, Hyderabad",
    occasionDate: "15 January 2027",
    notes: "Looking for emerald green Kanchipuram muhurtham saree with heavy gold zari border.",
    status: "Confirmed",
  },
  {
    id: "SE-APT-9042",
    createdAt: "2026-11-14T14:30:00.000Z",
    customerName: "Radhika Chalasani",
    customerPhone: "+1 408 555 0192",
    customerEmail: "radhika.c@example.com",
    serviceType: "virtual_nri_video",
    serviceTitle: "Global NRI 1-on-1 Video Shopping",
    mode: "virtual_video",
    date: "Sunday, 22 November 2026",
    timeSlot: "07:00 PM - 08:30 PM",
    city: "San Jose, California (USA)",
    occasionDate: "28 February 2027",
    notes: "Bride's mother trousseau selection. Need Banarasi kadhwa and pure tissue sarees.",
    status: "Confirmed",
  },
];

export function getStoredAppointments(): AppointmentRecord[] {
  if (typeof window === "undefined") return INITIAL_DEMO_APPOINTMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_APPOINTMENTS));
  } catch {}
  return INITIAL_DEMO_APPOINTMENTS;
}

export function saveAppointmentLocal(record: AppointmentRecord): void {
  if (typeof window === "undefined") return;
  try {
    const list = getStoredAppointments();
    const updated = [record, ...list.filter((a) => a.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function updateAppointmentStatusLocal(
  id: string,
  newStatus: AppointmentStatus
): AppointmentRecord[] {
  if (typeof window === "undefined") return INITIAL_DEMO_APPOINTMENTS;
  try {
    const list = getStoredAppointments();
    const updated = list.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return INITIAL_DEMO_APPOINTMENTS;
  }
}
