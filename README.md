# Sreesha Elegance — Hyderabad Flagship Web Platform

> _Wear Your Elegance._  
> Premium Indian Fashion & Ethnic Wear E-Commerce Platform for Hyderabad, Telangana.

---

## 🏛️ Project Overview

**Sreesha Elegance** is a commercial-grade, luxury fashion e-commerce platform built with Next.js App Router, TypeScript strict mode, and a custom design system reflecting the royal heritage of Hyderabad. The platform showcases pure handloom sarees (Kanchipuram, Banarasi, Paithani), bespoke bridal lehengas, designer anarkalis, and contemporary festive silhouettes.

---

## 🎨 Design System & Brand Identity

- **Color Palette:**
  - **Ivory Canvas:** `#FAF7F2` (Warm, editorial background)
  - **Warm Off-White Surfaces:** `#FFFFFF` and `#F5F2EB`
  - **Deep Charcoal Text:** `#1C1B19`
  - **Champagne Gold Accent:** `#B79B63` (Hairlines, badges, focus rings)
  - **Semantic Accents:** Emerald Success (`#2D6A4F`), Crimson Error (`#9A3434`)
- **Typography:**
  - **Headings & Display:** `Cormorant Garamond` (High-contrast luxury serif loaded via `next/font/google`)
  - **Body & Controls:** `Inter` (Clean, legible sans-serif with letter-spaced micro-labels)
- **Motion & Accessibility:**
  - Smooth scrolling via `Lenis`
  - Page transitions via `Framer Motion`
  - Strict adherence to `prefers-reduced-motion`
  - WCAG 2.2 AA compliant touch targets (≥ 44px) and keyboard navigation traps.

---

## 🧰 UI Kit Components

All components are located in `src/components/ui/` and adhere to the Master Brief:

1. `Button`: Primary charcoal, secondary warm, champagne gold, outline, ghost, link, loading spinner, disabled.
2. `Input`: Accessible labels, helper text, error messages, search/mail icon slots.
3. `Select`: Accessible dropdown built on `@radix-ui/react-select`.
4. `Checkbox`: Custom accessible checkbox built on `@radix-ui/react-checkbox`.
5. `Badge`: Luxury micro-badges (`NEW`, `BESTSELLER`, `SALE`, `HANDWOVEN`).
6. `Modal`: Accessible dialog built on `@radix-ui/react-dialog` with focus trap and Escape handler.
7. `Drawer`: Slide-in drawer sheet for cart, mobile nav, and filters.
8. `Accordion`: Collapsible specification drawers built on `@radix-ui/react-accordion`.
9. `Tabs`: Accessible tab navigation built on `@radix-ui/react-tabs`.
10. `Toast`: Minimalist luxury notifications built on `Sonner`.
11. `Skeleton`: Warm-toned shimmering placeholders for zero-CLS loading states.
12. `Breadcrumb`: Semantic breadcrumb trail with chevron separators.
13. `Rating`: Read-only and interactive star ratings in champagne gold with review counts.
14. `QuantityStepper`: Bounded increment/decrement stepper with stock limits.
15. `ProductCard`: 4:5 editorial aspect ratio, hover image swap, size chips, quick add, quick view, and INR pricing.
16. `EmptyState`: Editorial empty state with icon, serif header, and action buttons.
17. `ErrorState`: Graceful error boundary state with retry triggers.

> **Living Showcase:** Visit [`/design-system`](http://localhost:3000/design-system) to view all components in default, hover, focus, disabled, and loading states.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (recommended 22 or 24)
- npm 10+

### Installation & Environment Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront or [http://localhost:3000/design-system](http://localhost:3000/design-system) for the design system.

---

## 🧪 Testing & Code Quality

| Command                | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `npm run typecheck`    | Strict TypeScript verification (`tsc --noEmit`) |
| `npm run lint`         | ESLint check with Next.js Core Web Vitals       |
| `npm run format:check` | Prettier style verification                     |
| `npm run format`       | Prettier auto-formatter                         |
| `npm run test`         | Vitest unit test suite (DOM & components)       |
| `npm run test:e2e`     | Playwright E2E suite (Desktop & Mobile)         |
| `npm run build`        | Next.js optimized production build              |

---

## 📁 Repository Structure

```
├── .github/workflows/ci.yml       # CI pipeline (typecheck, lint, test, build)
├── e2e/smoke.spec.ts              # Playwright E2E smoke tests
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts, chrome, SEO
│   │   ├── page.tsx               # Homepage foundation
│   │   ├── not-found.tsx          # Custom luxury 404 page
│   │   ├── error.tsx              # Error boundary
│   │   ├── globals.css            # Tailwind theme tokens & variables
│   │   └── design-system/page.tsx # Living UI kit showcase
│   ├── components/
│   │   ├── layout/                # AnnouncementBar, Header, Footer, SmoothScroll
│   │   ├── seo/                   # Organization & WebSite JSON-LD
│   │   └── ui/                    # 17 UI kit primitives
│   └── lib/
│       ├── seo.ts                 # Metadata constructor & canonical URLs
│       └── utils.ts               # cn class merge & formatINR helper
├── .env.example                   # Documented configuration template
├── playwright.config.ts           # Playwright desktop & mobile configuration
└── vitest.config.ts               # Vitest jsdom test configuration
```

---

## 📌 Phased Build Roadmap

- [x] **Phase 0:** Foundation, repo, design tokens, UI kit, layout chrome, tests, CI.
- [ ] **Phase 1:** Supabase schema, migrations, RLS policies, auth flows, seed data (~48 products).
- [ ] **Phase 2:** Cinematic Home, listing pages with URL filters/sort, typo-tolerant search overlay.
- [ ] **Phase 3:** Product Detail Page (PDP), gallery, swatches, size guide, PIN checker, reviews.
- [ ] **Phase 4:** Cart drawer, guest/user cart merge, pricing service, coupon engine, wishlist.
- [ ] **Phase 5:** Checkout, Razorpay payments, HMAC signature verification, webhooks, GST invoices.
- [ ] **Phase 6:** My Account portal, order tracking timeline, guest order tracker.
- [ ] **Phase 7:** Admin dashboard (products, inventory movements, orders, coupons, audit logs).
- [ ] **Phase 8:** Editorial content pages (About, Contact, FAQs, Privacy DPDP), SEO & a11y audit.
- [ ] **Phase 9:** Lighthouse ≥ 90 performance tuning, security hardening, full E2E, deployment.
