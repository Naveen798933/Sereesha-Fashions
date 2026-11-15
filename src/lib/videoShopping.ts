/**
 * Sreesha Elegance — Global NRI Virtual Video Shopping Concierge Engine
 *
 * Provides international timezone conversions, video consultation scheduling,
 * curated bridal weave selection, and calendar invite generation.
 */

export interface TimezoneOption {
  id: string;
  label: string;
  city: string;
  country: string;
  timeZone: string;
  utcOffset: string;
  flag: string;
  currencySymbol: string;
}

export const NRI_TIMEZONES: TimezoneOption[] = [
  {
    id: "us_eastern",
    label: "US Eastern (EST/EDT)",
    city: "New York, Atlanta, Miami",
    country: "United States",
    timeZone: "America/New_York",
    utcOffset: "UTC-5",
    flag: "🇺🇸",
    currencySymbol: "$",
  },
  {
    id: "us_central",
    label: "US Central (CST/CDT)",
    city: "Dallas, Chicago, Houston",
    country: "United States",
    timeZone: "America/Chicago",
    utcOffset: "UTC-6",
    flag: "🇺🇸",
    currencySymbol: "$",
  },
  {
    id: "us_pacific",
    label: "US Pacific (PST/PDT)",
    city: "San Jose, Seattle, San Francisco",
    country: "United States",
    timeZone: "America/Los_Angeles",
    utcOffset: "UTC-8",
    flag: "🇺🇸",
    currencySymbol: "$",
  },
  {
    id: "uk_gmt",
    label: "UK & Ireland (GMT/BST)",
    city: "London, Manchester, Dublin",
    country: "United Kingdom",
    timeZone: "Europe/London",
    utcOffset: "UTC+0",
    flag: "🇬🇧",
    currencySymbol: "£",
  },
  {
    id: "uae_gst",
    label: "UAE & Gulf (GST)",
    city: "Dubai, Abu Dhabi, Doha",
    country: "United Arab Emirates",
    timeZone: "Asia/Dubai",
    utcOffset: "UTC+4",
    flag: "🇦🇪",
    currencySymbol: "AED ",
  },
  {
    id: "sg_sgt",
    label: "Singapore & Malaysia (SGT)",
    city: "Singapore, Kuala Lumpur",
    country: "Singapore",
    timeZone: "Asia/Singapore",
    utcOffset: "UTC+8",
    flag: "🇸🇬",
    currencySymbol: "S$",
  },
  {
    id: "au_aest",
    label: "Australia Eastern (AEST/AEDT)",
    city: "Sydney, Melbourne, Brisbane",
    country: "Australia",
    timeZone: "Australia/Sydney",
    utcOffset: "UTC+11",
    flag: "🇦🇺",
    currencySymbol: "A$",
  },
  {
    id: "in_ist",
    label: "India Standard Time (IST)",
    city: "Hyderabad Flagship Atelier",
    country: "India",
    timeZone: "Asia/Kolkata",
    utcOffset: "UTC+5:30",
    flag: "🇮🇳",
    currencySymbol: "₹",
  },
];

export interface VideoShoppingSlot {
  istSlot: string; // e.g. "11:00 AM - 12:30 PM"
  istStartHour: number; // 11
  istStartMinute: number; // 0
  durationMinutes: number; // 90
  recommendedTimezone: string;
}

export const ATELIER_VIDEO_SLOTS: VideoShoppingSlot[] = [
  {
    istSlot: "11:00 AM - 12:30 PM IST",
    istStartHour: 11,
    istStartMinute: 0,
    durationMinutes: 90,
    recommendedTimezone: "Australia, Singapore, Gulf",
  },
  {
    istSlot: "01:30 PM - 03:00 PM IST",
    istStartHour: 13,
    istStartMinute: 30,
    durationMinutes: 90,
    recommendedTimezone: "Singapore, UAE, UK Morning",
  },
  {
    istSlot: "04:30 PM - 06:00 PM IST",
    istStartHour: 16,
    istStartMinute: 30,
    durationMinutes: 90,
    recommendedTimezone: "UK, Europe, Gulf Evening",
  },
  {
    istSlot: "07:00 PM - 08:30 PM IST",
    istStartHour: 19,
    istStartMinute: 0,
    durationMinutes: 90,
    recommendedTimezone: "US East Coast (Morning), UK (Afternoon)",
  },
  {
    istSlot: "09:00 PM - 10:30 PM IST",
    istStartHour: 21,
    istStartMinute: 0,
    durationMinutes: 90,
    recommendedTimezone: "US East (11:30 AM) & US Pacific (8:30 AM)",
  },
];

export const VIDEO_SHOPPING_WEAVES = [
  {
    id: "kanchipuram_bridal",
    title: "Kanchipuram Pure Silk (Muhurtham)",
    desc: "Heavy Korvai 3-ply mulberry silk with authentic tested silver & gold zari borders.",
  },
  {
    id: "banarasi_katan",
    title: "Banarasi Katan Silk (Kadhwa Weaves)",
    desc: "Handwoven in Varanasi without reverse floats; royal kalka & antique meenakari.",
  },
  {
    id: "paithani_royal",
    title: "Royal Paithani (Peacock & Lotus Pallu)",
    desc: "Heirloom tapestry weave with kaleidoscopic dhoop-chhaon color transitions.",
  },
  {
    id: "organza_tissue",
    title: "Pure Organza & Metallic Tissue Zari",
    desc: "Featherlight gossamer drape perfect for sangeet, cocktail, and destination weddings.",
  },
  {
    id: "bridal_lehengas",
    title: "Couture Bridal Lehengas & Sets",
    desc: "Handcrafted velvet & raw silk kalis with bespoke masterji blouse alignment.",
  },
];

export const NRI_BUDGET_TIERS = [
  {
    id: "tier_1",
    label: "₹25,000 – ₹50,000 (~$300 – $600 USD)",
    desc: "Festive Silk & Family Heirloom Gifting",
  },
  {
    id: "tier_2",
    label: "₹50,000 – ₹1,00,000 (~$600 – $1,200 USD)",
    desc: "Muhurtham & Reception Statement Sarees",
  },
  {
    id: "tier_3",
    label: "₹1,00,000 – ₹2,50,000 (~$1,200 – $3,000 USD)",
    desc: "Grand Bridal Trousseau Suite (3–5 Ensembles)",
  },
  {
    id: "tier_4",
    label: "₹2,50,000+ (~$3,000+ USD)",
    desc: "Bespoke Royal Nizam Bridal Registry",
  },
];

export interface NRIReview {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  date: string;
  sareePurchased: string;
  review: string;
  rating: number;
}

export const NRI_REVIEWS: NRIReview[] = [
  {
    id: "rev_1",
    name: "Dr. Ananya Reddy & Family",
    city: "Dallas, Texas",
    country: "USA",
    flag: "🇺🇸",
    date: "October 2024",
    sareePurchased: "Bridal Crimson Kanchipuram Korvai Silk (₹68,000)",
    review:
      "Shopping for my daughter's wedding from Dallas felt completely seamless. The stylist showed us 12 sarees under natural daylight on WhatsApp HD video, draped the pallu over her shoulder, and zoomed in on the pure zari. Arrived in 4 days via DHL Express!",
    rating: 5,
  },
  {
    id: "rev_2",
    name: "Pooja & Karthik Varma",
    city: "San Jose, California",
    country: "USA",
    flag: "🇺🇸",
    date: "September 2024",
    sareePurchased: "Royal Nizam Kadhwa Banarasi & 2 Tissue Sarees (₹1,45,000)",
    review:
      "The timezone converter made booking for 8:30 AM Pacific so easy. The saree packaging with the gold-stamped box and Silk Mark verification QR cards gave us total peace of mind. Sreesha Elegance is our family's trusted boutique now.",
    rating: 5,
  },
  {
    id: "rev_3",
    name: "Meenakshi Sundaram",
    city: "London",
    country: "United Kingdom",
    flag: "🇬🇧",
    date: "November 2024",
    sareePurchased: "Emerald Gold Kanchipuram & Custom Blouse (₹52,000)",
    review:
      "I was amazed at the bespoke blouse stitching. The masterji took my measurements over the video call, and the fit was millimeter-perfect when it arrived at my doorstep in London within 3 days. No custom duties hassle!",
    rating: 5,
  },
  {
    id: "rev_4",
    name: "Sowjanya Rao",
    city: "Dubai, Downtown",
    country: "UAE",
    flag: "🇦🇪",
    date: "August 2024",
    sareePurchased: "Yeola Paithani Royal Purple with Peacock Pallu (₹58,000)",
    review:
      "Delivery to Dubai took barely 48 hours. The saree fabric has that unmistakable heavy pure mulberry silk sheen. The WhatsApp concierge was so warm, knowledgeable, and patient with my mother.",
    rating: 5,
  },
];

/**
 * Convert an Atelier IST Slot to the target local timezone display string.
 */
export function convertSlotToLocalTime(
  baseDate: Date,
  slot: VideoShoppingSlot,
  targetTimezone: string
): {
  localTimeString: string;
  localDateString: string;
  isDifferentDay: boolean;
  dayDifferenceText: string;
} {
  try {
    // Create UTC Date representing the slot in IST (UTC+5:30)
    // IST is UTC + 5.5 hours, so UTC = IST - 5.5 hours
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const date = baseDate.getDate();

    // UTC timestamp for the IST appointment start
    const utcMillis = Date.UTC(
      year,
      month,
      date,
      slot.istStartHour - 5,
      slot.istStartMinute - 30,
      0
    );

    const targetDate = new Date(utcMillis);

    // Format local time
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: targetTimezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const endDate = new Date(utcMillis + slot.durationMinutes * 60 * 1000);
    const startTimeStr = timeFormatter.format(targetDate);
    const endTimeStr = timeFormatter.format(endDate);

    // Format local date
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: targetTimezone,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const localDateString = dateFormatter.format(targetDate);

    // Check if target local date differs from baseDate
    const baseDateFormatted = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      month: "short",
      day: "numeric",
    }).format(baseDate);

    const isDifferentDay = !localDateString.includes(baseDateFormatted);
    let dayDifferenceText = "";
    if (isDifferentDay) {
      if (targetDate.getTime() < new Date(year, month, date).getTime()) {
        dayDifferenceText = "(Prev Day)";
      } else {
        dayDifferenceText = "(Next Day)";
      }
    }

    return {
      localTimeString: `${startTimeStr} – ${endTimeStr}`,
      localDateString,
      isDifferentDay,
      dayDifferenceText,
    };
  } catch {
    return {
      localTimeString: slot.istSlot,
      localDateString: baseDate.toDateString(),
      isDifferentDay: false,
      dayDifferenceText: "",
    };
  }
}

/**
 * Generate a direct Google Calendar add event URL.
 */
export function generateGoogleCalendarUrl(appointment: {
  id: string;
  title: string;
  dateStr: string;
  timeSlot: string;
  clientTimezone: string;
  customerName: string;
}): string {
  const title = encodeURIComponent(
    `Sreesha Elegance Atelier 1-on-1 Virtual Video Shopping (${appointment.id})`
  );
  const details = encodeURIComponent(
    `Exclusive Virtual Video Shopping Session with Sreesha Elegance Master Stylist.\n\n` +
      `Patron: ${appointment.customerName}\n` +
      `Appointment ID: ${appointment.id}\n` +
      `Slot: ${appointment.timeSlot} (${appointment.clientTimezone})\n` +
      `Concierge Contact: +91 62813 44628\n` +
      `Atelier Location: Kukatpally, Hyderabad, India\n\n` +
      `Our master stylist will initiate the HD video call via WhatsApp at your scheduled slot.`
  );
  const location = encodeURIComponent("WhatsApp Video Call (+91 62813 44628)");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
}
