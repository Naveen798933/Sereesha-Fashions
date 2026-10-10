export interface AdminRecord {
  id: string;
  name: string;
  displayName: string;
  phone: string;
  ownerId: string;
  role: string;
  status: "Active" | "Suspended";
  isOwner: boolean;
  createdAt: string;
}

export const DEFAULT_OWNER_ADMIN: AdminRecord = {
  id: "admin_owner_primary",
  name: "sreesha",
  displayName: "Sreesha",
  phone: "6281344628",
  ownerId: "8899",
  role: "Super Admin / Owner",
  status: "Active",
  isOwner: true,
  createdAt: "2026-10-10T00:00:00.000Z",
};

export const ADMIN_SESSION_STORAGE_KEY = "sreesha_admin_authorized";
export const ADMIN_PERSISTENT_STORAGE_KEY = "sreesha_admin_remember_device";
export const ADMIN_PROFILE_STORAGE_KEY = "sreesha_admin_profile";
export const ADMIN_STAFF_STORE_KEY = "sreesha_admin_staff_registry";

/**
 * Normalizes strings for robust matching (lowercase, trimmed, spaces normalized)
 */
export function normalizeString(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Normalizes phone numbers (strips all non-digit characters)
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // Return last 10 digits if country code is included (e.g. 916281344628 -> 6281344628)
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/**
 * Verifies if the provided credentials match any registered admin
 */
export function verifyAdminCredentials(
  name: string,
  phone: string,
  ownerId: string,
  staffList?: AdminRecord[]
): { success: boolean; admin?: AdminRecord; error?: string } {
  const cleanName = normalizeString(name);
  const cleanPhone = normalizePhone(phone);
  const cleanOwnerId = ownerId.trim();

  if (!cleanName) {
    return { success: false, error: "Please enter your administrator name" };
  }
  if (!cleanPhone || cleanPhone.length < 10) {
    return { success: false, error: "Please enter a valid 10-digit mobile number" };
  }
  if (!cleanOwnerId) {
    return { success: false, error: "Please enter the Owner ID / Security Passcode" };
  }

  // Combine default owner with any custom staff records
  const allAdmins: AdminRecord[] = [DEFAULT_OWNER_ADMIN];
  if (staffList && Array.isArray(staffList)) {
    staffList.forEach((s) => {
      if (s.id !== DEFAULT_OWNER_ADMIN.id && !allAdmins.some((a) => a.id === s.id)) {
        allAdmins.push(s);
      }
    });
  }

  // Find matching admin
  const matched = allAdmins.find((admin) => {
    const adminCleanName = normalizeString(admin.name);
    const adminCleanPhone = normalizePhone(admin.phone);
    const adminCleanOwnerId = admin.ownerId.trim();

    const nameMatches =
      adminCleanName === cleanName ||
      cleanName.includes(adminCleanName) ||
      adminCleanName.includes(cleanName);

    const phoneMatches = adminCleanPhone === cleanPhone;
    const pinMatches = adminCleanOwnerId === cleanOwnerId;

    return nameMatches && phoneMatches && pinMatches;
  });

  if (matched) {
    if (matched.status === "Suspended") {
      return { success: false, error: "This administrator access has been suspended by the Owner" };
    }
    return { success: true, admin: matched };
  }

  return {
    success: false,
    error: "Invalid administrator credentials. Verify your Name, Phone Number, and Owner ID.",
  };
}

/**
 * Retrieves the currently active admin session from client-side storage
 */
export function getClientAdminSession(): AdminRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const sessionAuth = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    const persistentAuth = localStorage.getItem(ADMIN_PERSISTENT_STORAGE_KEY);

    if (sessionAuth === "true" || persistentAuth === "true") {
      const storedProfile = localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        return JSON.parse(storedProfile) as AdminRecord;
      }
      return DEFAULT_OWNER_ADMIN;
    }
  } catch (err) {
    console.warn("Could not read admin session:", err);
  }
  return null;
}

/**
 * Persists an authorized admin session
 */
export function saveClientAdminSession(admin: AdminRecord, remember: boolean = true): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, "true");
    if (remember) {
      localStorage.setItem(ADMIN_PERSISTENT_STORAGE_KEY, "true");
    }
    localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(admin));
  } catch (err) {
    console.warn("Could not save admin session:", err);
  }
}

/**
 * Clears the admin session
 */
export function clearClientAdminSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    localStorage.removeItem(ADMIN_PERSISTENT_STORAGE_KEY);
    localStorage.removeItem(ADMIN_PROFILE_STORAGE_KEY);
  } catch (err) {
    console.warn("Could not clear admin session:", err);
  }
}

/**
 * Retrieves full list of staff admins from localStorage with fallback to default owner
 */
export function getClientStaffList(): AdminRecord[] {
  if (typeof window === "undefined") return [DEFAULT_OWNER_ADMIN];
  try {
    const stored = localStorage.getItem(ADMIN_STAFF_STORE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AdminRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default owner is always present
        if (
          !parsed.some(
            (a) =>
              a.id === DEFAULT_OWNER_ADMIN.id ||
              normalizePhone(a.phone) === DEFAULT_OWNER_ADMIN.phone
          )
        ) {
          return [DEFAULT_OWNER_ADMIN, ...parsed];
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not load staff list:", err);
  }
  return [DEFAULT_OWNER_ADMIN];
}

/**
 * Saves staff list to localStorage
 */
export function saveClientStaffList(list: AdminRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ADMIN_STAFF_STORE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn("Could not save staff list:", err);
  }
}
