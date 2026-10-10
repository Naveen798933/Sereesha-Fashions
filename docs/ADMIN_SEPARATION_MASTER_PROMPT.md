# Master Prompt: Customer & Atelier Admin Separation Architecture

> **Repository:** Sreesha Elegance — Hyderabad Luxury Ethnic Wear & Handloom Couture  
> **Target Framework:** Next.js 16 (Turbopack), React 19, TypeScript (Strict Mode), Tailwind CSS v4, Supabase SSR  
> **Document Purpose:** Master specification and prompt blueprint for separating the Customer and Admin panels, enforcing multi-tier authentication, registering primary Owner credentials, and delegating secondary staff access.

---

## 1. System Intent & Architectural Boundaries

### The Separation Rule

1. **Customer Domain (`/`, `/women/*`, `/collections`, `/cart`, `/checkout`, `/account`, `/wishlist`)**:
   - Designed exclusively for patrons and clients browsing haute couture, configuring bespoke blouse options, tracking deliveries, and placing orders.
   - Requires zero friction (instant phone recognition without OTP or password lockouts).
   - Must have **zero direct access** or exposed controls to inventory modification, gross profit metrics, or administrative data.

2. **Atelier Admin Domain (`/admin/*`)**:
   - An isolated, royal dark-themed management suite (`bg-[#1C1B19]`, `#B79B63` gold accents).
   - Exclusively accessible by the registered Owner and authorized boutique staff members.
   - **Zero Backdoors:** Instant bypass buttons are strictly forbidden. Access is guarded by full credential verification:
     - **Administrator Full Name**
     - **Registered 10-Digit Mobile Number**
     - **Owner ID / Security Passcode**
   - Self-contained routing: Orders fulfillment, inventory stock, coupon management, patron directory, and staff access governance.

---

## 2. Default Registered Owner Credentials

The primary atelier owner is pre-registered as the permanent root authority:

| Attribute               | Specification         | Verification Rule                                                      |
| :---------------------- | :-------------------- | :--------------------------------------------------------------------- |
| **Owner Name**          | `sreesha`             | Case-insensitive trimmed match (`sreesha`, `Sreesha`, `Sreesha Varma`) |
| **Registered Mobile**   | `6281344628`          | Exact 10-digit match (strips `+91` or spaces)                          |
| **Owner ID / Passcode** | `8899`                | Exact security PIN match                                               |
| **Administrative Role** | `Super Admin / Owner` | Root authority, non-deletable, non-revocable                           |
| **Account Status**      | `Active`              | Permanent record                                                       |

---

## 3. Data Model & Storage Specifications

### Admin Record Schema (`src/lib/adminAuth.ts` & `src/data/admins.json`)

```typescript
export interface AdminRecord {
  id: string; // Unique ID, e.g. "admin_owner_primary" or "admin_staff_1773..."
  name: string; // Canonical lowercase search name, e.g. "sreesha"
  displayName: string; // Formatted presentation name, e.g. "Sreesha"
  phone: string; // 10-digit Indian mobile number, e.g. "6281344628"
  ownerId: string; // Passcode / Security PIN, e.g. "8899"
  role: string; // Role designation: "Super Admin / Owner" | "Store Manager" | "Inventory Curator" | "Order Dispatcher" | "Co-Admin"
  status: "Active" | "Suspended";
  isOwner: boolean; // True for primary owner (cannot be deleted)
  createdAt: string; // ISO 8601 timestamp
}
```

### Storage Redundancy Strategy

1. **Persistent JSON Storage**: `src/data/admins.json` serves as the initial state and local filesystem repository.
2. **In-Memory Serverless Cache**: `/api/admin/staff` maintains an in-memory cache to guarantee zero-downtime operations in serverless/Vercel read-only filesystem environments.
3. **Client-Side Mirroring**: `localStorage` (`sreesha_admin_staff_registry`) ensures client-side continuity even if offline or during network interruptions.

---

## 4. Authentication Workflow

### A. Customer Sign In & Registration (`/login`)

- **Mode 1 — Patron Sign In**:
  - Input: 10-digit Indian Mobile Number.
  - Action: Verifies customer records in `customers.json` or Supabase.
  - Success: Automatically restores cart, orders, and addresses.
  - Not Found: Seamlessly switches to New Client mode without error jarring.
- **Mode 2 — New Client**:
  - Inputs: Full Name + 10-digit Mobile Number.
  - Action: Registers new patron profile instantly.

### B. Atelier Admin Portal Login (`/login?tab=admin` or `/admin`)

- **Mode 3 — Atelier Admin**:
  - Distinct royal dark theme card with key crest.
  - Inputs Required:
    1. `adminName`: Registered Administrator Full Name
    2. `adminPhone`: Registered 10-Digit Mobile
    3. `adminOwnerId`: Secret Owner ID / Passcode with password mask and show/hide eye toggle.
  - **Confidentiality & Zero-Leakage Policy**:
    - No public Quick-Fill helper chips or exposed plaintext credentials on the login screen.
    - Input fields employ generic, non-revealing placeholders (`"Administrator name"`, `"10-digit registered mobile"`, `"Enter security passcode"`).
    - Secret passcodes are masked by default (`type="password"`) with eye toggle visibility control.
  - Verification calls `POST /api/admin/staff` with `{ action: "verify_login" }` and falls back to client-side `verifyAdminCredentials`.
  - On Successful Verification:
    - Stores `sreesha_admin_authorized = "true"` in `sessionStorage` / `localStorage`.
    - Stores `sreesha_admin_profile` with active admin record.
    - Emits toast: `"Welcome back, [Name]! Entering Atelier Admin Portal..."`
    - Redirects directly to `/admin`.
  - On Rejection:
    - Displays red error banner: `"Invalid administrator credentials. Please check Name, Mobile, and Owner ID."`

---

## 5. Staff Access Delegation System (`/admin/staff`)

The primary Owner and co-admins can grant secondary administrative access to boutique staff:

### Delegated Staff Roles

1. **Store Manager**: Full visibility across orders fulfillment, inventory levels, and customer inquiries.
2. **Inventory Curator**: Can add, edit, or discount silk weaves and bridal lehengas in catalog.
3. **Order Dispatcher**: Can update BlueDart / courier AWB tracking numbers and dispatch statuses.
4. **Co-Admin**: Full administrative authority alongside the Owner.

### API Endpoints (`/api/admin/staff`)

- `GET`: Returns the active list of authorized administrators.
- `POST`:
  - `action === "verify_login"`: Verifies credentials during login.
  - Default: Adds a new staff admin member (validates non-duplicate phone and minimum 4-character passcode).
- `DELETE`: Revokes staff access by ID (Owner account is permanently protected from deletion).

---

## 6. Route Protection & Proxy Verification

- **Admin Layout Guard (`src/app/admin/layout.tsx`)**:
  - Runs on every `/admin/*` route mount.
  - Reads `getClientAdminSession()`.
  - If unauthenticated, displays the locked Admin Authentication portal screen with direct return link to the public boutique.
- **Robots Exclusion (`src/app/robots.ts`)**:
  - Disallows crawlers and search engine indexing on `/admin` and `/admin/*`.
- **Footer & Header Decoupling**:
  - Public footer links directly to `/login?tab=admin`, preventing public users from seeing raw admin layout shells.

---

## 7. Master Execution Prompt

Copy and paste the following prompt to reproduce or deploy this architecture across any fresh Next.js environment:

```markdown
You are an expert Next.js and full-stack software engineer. Implement a complete separation between the Customer and Admin portals for the "Sreesha Elegance" luxury ethnic e-commerce application. Follow these exact specifications:

1. ADMIN CREDENTIALS & STORE:
   - Create `src/data/admins.json` and initialize it with the primary owner:
     - Name: "sreesha"
     - Display Name: "Sreesha"
     - Phone: "6281344628"
     - Owner ID: "8899"
     - Role: "Super Admin / Owner"
     - isOwner: true, status: "Active"
   - Implement `src/lib/adminAuth.ts` with credential normalization, validation (`verifyAdminCredentials`), session helpers (`getClientAdminSession`, `saveClientAdminSession`, `clearClientAdminSession`), and staff list caching.

2. API ROUTE:
   - Create `src/app/api/admin/staff/route.ts`:
     - GET: Returns all active admin records.
     - POST: Supports `action: "verify_login"` for authenticating admins, and default action for adding new staff members (with validation against duplicates).
     - DELETE: Revokes staff by ID, strictly preventing deletion of the primary Owner.

3. DUAL LOGIN INTERFACE:
   - Update `src/app/login/page.tsx` with a 3-tab segmented selector:
     - "Patron Sign In" (Phone only)
     - "New Client" (Name + Phone)
     - "Atelier Admin" (Phone, Name, Owner ID)
   - When "Atelier Admin" is active:
     - Apply an opulent dark theme card (`bg-[#1C1B19]`, gold border `#3E3A34`).
     - Collect Name, 10-digit Mobile, and Owner ID.
     - Validate via API and local fallback, save admin session, and redirect to `/admin`.
     - Include a quick-fill demo button for the registered owner.

4. ADMIN PORTAL PROTECTION & LAYOUT:
   - Update `src/app/admin/layout.tsx`:
     - Check for valid admin session. If missing, render the locked Admin Authentication form.
     - Remove any quick bypass or backdoor buttons.
     - Add a "Staff & Access" link (`/admin/staff`) with `UserCheck` icon to sidebar navigation.
     - Display active admin badge and a "Lock/Sign Out" button that clears session and redirects to `/login?tab=admin`.

5. STAFF MANAGEMENT PAGE:
   - Create `src/app/admin/staff/page.tsx`:
     - Display primary Owner highlight card (Sreesha, 6281344628, 8899).
     - Render active staff table with search, role badges, and toggleable passcode display.
     - Provide a modal to "Grant New Admin Access" (Name, Phone, Passcode, Role).
     - Allow revoking staff members (with confirmation, protecting Owner).

6. QUALITY ASSURANCE:
   - Ensure 0 TypeScript errors (`tsc --noEmit`), 0 ESLint warnings (`eslint`), and 100% Prettier formatting.
   - Verify that `next build` compiles all routes cleanly with zero static generation errors.
```
