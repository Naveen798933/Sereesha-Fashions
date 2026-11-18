import fs from "fs";
import path from "path";
import { Order } from "@/lib/orders";

// ============================================================================
// 1. CATEGORIES STORE
// ============================================================================

export interface CategoryPayload {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  subcategories: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const CATEGORIES_FILE_PATH = path.join(process.cwd(), "src", "data", "categories.json");

export function readLocalCategories(): CategoryPayload[] {
  try {
    if (fs.existsSync(CATEGORIES_FILE_PATH)) {
      const content = fs.readFileSync(CATEGORIES_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local categories:", err);
  }
  return [];
}

export function writeLocalCategories(categories: CategoryPayload[]): void {
  try {
    fs.writeFileSync(CATEGORIES_FILE_PATH, JSON.stringify(categories, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write categories to local JSON:", err);
  }
}

// ============================================================================
// 2. COUPONS STORE
// ============================================================================

export interface CouponRecord {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

const COUPONS_FILE_PATH = path.join(process.cwd(), "src", "data", "coupons.json");

export function readLocalCoupons(): CouponRecord[] {
  try {
    if (fs.existsSync(COUPONS_FILE_PATH)) {
      const content = fs.readFileSync(COUPONS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local coupons:", err);
  }
  return [];
}

export function writeLocalCoupons(coupons: CouponRecord[]): void {
  try {
    fs.writeFileSync(COUPONS_FILE_PATH, JSON.stringify(coupons, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write coupons to local JSON:", err);
  }
}

// ============================================================================
// 3. REVIEWS STORE
// ============================================================================

export interface ReviewRecord {
  id: string;
  productId: string;
  productTitle: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  fit: string;
  verified: boolean;
  status: "approved" | "pending" | "hidden" | "spam";
  createdAt?: string;
  updatedAt?: string;
}

const REVIEWS_FILE_PATH = path.join(process.cwd(), "src", "data", "reviews.json");

export function readLocalReviews(): ReviewRecord[] {
  try {
    if (fs.existsSync(REVIEWS_FILE_PATH)) {
      const content = fs.readFileSync(REVIEWS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local reviews:", err);
  }
  return [];
}

export function writeLocalReviews(reviews: ReviewRecord[]): void {
  try {
    fs.writeFileSync(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write reviews to local JSON:", err);
  }
}

// ============================================================================
// 4. ORDERS STORE
// ============================================================================

const ORDERS_FILE_PATH = path.join(process.cwd(), "src", "data", "orders.json");

export function readLocalOrders(): Order[] {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const content = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local orders:", err);
  }
  return [];
}

export function writeLocalOrders(orders: Order[]): void {
  try {
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write orders to local JSON:", err);
  }
}
