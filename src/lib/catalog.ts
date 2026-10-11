"use client";

import { Product, PRODUCTS } from "@/data/products";
import { createClient } from "@/lib/supabase/client";

export const STORAGE_CUSTOM_PRODUCTS_KEY = "sreesha_admin_custom_products";
export const STORAGE_STOCK_MAP_KEY = "sreesha_admin_stock_map";
export const STORAGE_CATEGORIES_KEY = "sreesha_admin_categories";
export const STORAGE_REVIEWS_KEY = "sreesha_admin_reviews";
export const STORAGE_DELETED_PRODUCTS_KEY = "sreesha_admin_deleted_products";

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  subcategories: string[];
  displayOrder: number;
  isActive: boolean;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-sarees",
    slug: "sarees",
    name: "Silk Sarees",
    description:
      "Authentic Kanchipuram, Banarasi, and Chanderi pure silk handlooms with gold zari.",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
    subcategories: [
      "Kanchipuram Silk",
      "Banarasi Brocade",
      "Chanderi Zari",
      "Gadwal Handloom",
      "Tussar Silk",
    ],
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "cat-lehengas",
    slug: "lehengas",
    name: "Bridal Lehengas",
    description:
      "Opulent velvet and raw silk bridal lehengas with zardozi and gota patti embroidery.",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85",
    subcategories: ["Bridal Velvet", "Raw Silk Circular", "Banarasi Weave", "Pastel Reception"],
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "cat-kurtis",
    slug: "kurtis",
    name: "Designer Kurtis & Sets",
    description:
      "Celebration anarkalis, festive straight kurtis, and palazzo ensembles in chanderi silk.",
    imageUrl:
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85",
    subcategories: [
      "Floor-length Anarkali",
      "Straight Festive Cut",
      "Kurta & Pant Sets",
      "Angrakha Style",
    ],
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "cat-contemporary",
    slug: "contemporary",
    name: "Contemporary & Fusion",
    description:
      "Modern Indo-western drapes, cape sets, pre-stitched sarees, and celebration gowns.",
    imageUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85",
    subcategories: [
      "Pre-stitched Concept Sarees",
      "Jacket & Cape Ensembles",
      "Festive Draped Gowns",
    ],
    displayOrder: 4,
    isActive: true,
  },
];

export interface AdminReviewItem {
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
}

export const INITIAL_ADMIN_REVIEWS: AdminReviewItem[] = [
  {
    id: "rev-1",
    productId: "saree-01",
    productTitle: "Kanchipuram Pure Silk Saree — Emerald & Pure Gold Zari",
    author: "Lakshmi Prasanna",
    city: "Banjara Hills, Hyderabad",
    rating: 5,
    date: "02 October 2026",
    title: "Mesmerizing Zari Luster & Pure Silk Authenticity",
    comment:
      "Wore this to my sister's wedding in Hyderabad. The drape is so rich and the gold zari border has that authentic heavy sheen that looks breathtaking under chandeliers. Received non-stop compliments!",
    fit: "Bespoke Master Fit",
    verified: true,
    status: "approved",
  },
  {
    id: "rev-2",
    productId: "saree-01",
    productTitle: "Kanchipuram Pure Silk Saree — Emerald & Pure Gold Zari",
    author: "Gayatri Krishnan",
    city: "Indiranagar, Bengaluru",
    rating: 5,
    date: "28 September 2026",
    title: "Silk Mark tag verified, flawless fall & pico finish",
    comment:
      "Arrived in 2 days to Bengaluru in the gold-stamped luxury hardbox. Checked the Silk Mark QR code immediately—100% genuine mulberry silk. The masterji custom blouse fits like a dream.",
    fit: "True to Size",
    verified: true,
    status: "approved",
  },
  {
    id: "rev-3",
    productId: "saree-01",
    productTitle: "Kanchipuram Pure Silk Saree — Emerald & Pure Gold Zari",
    author: "Swathi Rao",
    city: "Colaba, Mumbai",
    rating: 5,
    date: "14 September 2026",
    title: "Heirloom grade bridal quality",
    comment:
      "I was skeptical about buying bridal silk online, but the WhatsApp video preview session gave me complete confidence. The actual saree is even more opulent in hand than photos depict.",
    fit: "Bespoke Master Fit",
    verified: true,
    status: "approved",
  },
];

// ============================================================================
// PRODUCT FUNCTIONS
// ============================================================================

/**
 * Returns all products for the customer storefront (excluding archived products,
 * applying live stock overrides)
 */
export function getCustomerProducts(): Product[] {
  if (typeof window === "undefined") return PRODUCTS;

  let customProducts: Product[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) customProducts = parsed;
    }
  } catch {}

  let deletedIds: string[] = [];
  try {
    const storedDel = localStorage.getItem(STORAGE_DELETED_PRODUCTS_KEY);
    if (storedDel) {
      const parsed = JSON.parse(storedDel);
      if (Array.isArray(parsed)) deletedIds = parsed;
    }
  } catch {}

  let stockMap: Record<string, boolean> = {};
  try {
    const storedStock = localStorage.getItem(STORAGE_STOCK_MAP_KEY);
    if (storedStock) stockMap = JSON.parse(storedStock);
  } catch {}

  const productMap = new Map<string, Product>();
  PRODUCTS.forEach((p) => {
    if (!deletedIds.includes(p.id)) productMap.set(p.id, p);
  });
  customProducts.forEach((p) => {
    if (!deletedIds.includes(p.id)) productMap.set(p.id, p);
  });

  const merged = Array.from(productMap.values()).filter(
    (p) => p.status !== "archived" && p.status !== "draft"
  );

  return merged.map((p) => ({
    ...p,
    inStock: stockMap[p.id] !== undefined ? stockMap[p.id] : (p.inStock ?? true),
  }));
}

/**
 * Returns all products for the Admin Panel (including Drafts, Active, and Archived)
 */
export function getAdminProducts(): Product[] {
  if (typeof window === "undefined") return PRODUCTS;

  let customProducts: Product[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) customProducts = parsed;
    }
  } catch {}

  let deletedIds: string[] = [];
  try {
    const storedDel = localStorage.getItem(STORAGE_DELETED_PRODUCTS_KEY);
    if (storedDel) {
      const parsed = JSON.parse(storedDel);
      if (Array.isArray(parsed)) deletedIds = parsed;
    }
  } catch {}

  let stockMap: Record<string, boolean> = {};
  try {
    const storedStock = localStorage.getItem(STORAGE_STOCK_MAP_KEY);
    if (storedStock) stockMap = JSON.parse(storedStock);
  } catch {}

  const productMap = new Map<string, Product>();
  PRODUCTS.forEach((p) => {
    if (!deletedIds.includes(p.id)) productMap.set(p.id, p);
  });
  customProducts.forEach((p) => {
    if (!deletedIds.includes(p.id)) productMap.set(p.id, p);
  });

  const all = Array.from(productMap.values());
  return all.map((p) => ({
    ...p,
    status: p.status || "active",
    inStock: stockMap[p.id] !== undefined ? stockMap[p.id] : (p.inStock ?? true),
    stock: p.stock !== undefined ? p.stock : 15,
  }));
}

/**
 * Saves a new product or updates an existing one
 */
export async function saveProduct(product: Product): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    // If product was previously marked deleted, unmark it
    const storedDel = localStorage.getItem(STORAGE_DELETED_PRODUCTS_KEY);
    if (storedDel) {
      const deletedIds: string[] = JSON.parse(storedDel);
      const filteredDel = deletedIds.filter((id) => id !== product.id);
      localStorage.setItem(STORAGE_DELETED_PRODUCTS_KEY, JSON.stringify(filteredDel));
    }

    const stored = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
    const existing: Product[] = stored ? JSON.parse(stored) : [];

    const index = existing.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      existing[index] = { ...existing[index], ...product, updatedAt: new Date().toISOString() };
    } else {
      existing.unshift({
        ...product,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(existing));

    // Also update stock map
    const stockMapStr = localStorage.getItem(STORAGE_STOCK_MAP_KEY);
    const stockMap = stockMapStr ? JSON.parse(stockMapStr) : {};
    stockMap[product.id] = product.inStock !== false;
    localStorage.setItem(STORAGE_STOCK_MAP_KEY, JSON.stringify(stockMap));
  } catch {}

  // Sync with Supabase if online
  try {
    const supabase = createClient();
    await supabase.from("products").upsert({
      id: product.id,
      slug: product.slug,
      title: product.title,
      category: product.category,
      category_label: product.categoryLabel,
      collection: product.collection || "Atelier Edit",
      price: product.price,
      original_price: product.originalPrice || null,
      primary_image: product.primaryImage,
      gallery_images: product.galleryImages,
      badge: product.badge || null,
      sizes: product.sizes,
      fabric: product.fabric,
      weave: product.weave,
      color: product.color,
      occasion: product.occasion,
      silk_mark_certified: product.silkMarkCertified,
      blouse_included: product.blouseIncluded,
      short_description: product.shortDescription,
      description: product.description,
      details: product.details,
      in_stock: product.inStock !== false,
      video_url: product.videoUrl || null,
      sku: product.sku || null,
      brand: product.brand || "Sreesha Elegance",
      status: product.status || "active",
      stock: product.stock || 15,
      colors: product.colors || [product.color],
      tags: product.tags || [],
    });
  } catch {}
}

/**
 * Removes a product completely
 */
export async function deleteProduct(productId: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
    if (stored) {
      const existing: Product[] = JSON.parse(stored);
      const filtered = existing.filter((p) => p.id !== productId);
      localStorage.setItem(STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(filtered));
    }

    const storedDel = localStorage.getItem(STORAGE_DELETED_PRODUCTS_KEY);
    const deletedIds: string[] = storedDel ? JSON.parse(storedDel) : [];
    if (!deletedIds.includes(productId)) {
      deletedIds.push(productId);
      localStorage.setItem(STORAGE_DELETED_PRODUCTS_KEY, JSON.stringify(deletedIds));
    }
  } catch {}

  try {
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", productId);
  } catch {}
}

/**
 * Toggles product stock availability
 */
export async function setProductStock(productId: string, inStock: boolean): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const storedStock = localStorage.getItem(STORAGE_STOCK_MAP_KEY);
    const stockMap = storedStock ? JSON.parse(storedStock) : {};
    stockMap[productId] = inStock;
    localStorage.setItem(STORAGE_STOCK_MAP_KEY, JSON.stringify(stockMap));
  } catch {}

  try {
    const supabase = createClient();
    await supabase.from("products").update({ in_stock: inStock }).eq("id", productId);
  } catch {}
}

// ============================================================================
// CATEGORY FUNCTIONS
// ============================================================================

export function getCategories(): CategoryItem[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;

  try {
    const stored = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  return DEFAULT_CATEGORIES;
}

export async function saveCategory(category: CategoryItem): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const current = getCategories();
    const index = current.findIndex((c) => c.id === category.id || c.slug === category.slug);
    if (index >= 0) {
      current[index] = category;
    } else {
      current.push(category);
    }
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(current));
  } catch {}

  try {
    const supabase = createClient();
    await supabase.from("categories").upsert({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      image_url: category.imageUrl,
      subcategories: category.subcategories,
      display_order: category.displayOrder,
      is_active: category.isActive,
    });
  } catch {}
}

export async function deleteCategory(categoryId: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const current = getCategories().filter((c) => c.id !== categoryId);
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(current));
  } catch {}

  try {
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", categoryId);
  } catch {}
}

// ============================================================================
// REVIEW MODERATION FUNCTIONS
// ============================================================================

export function getAdminReviews(): AdminReviewItem[] {
  if (typeof window === "undefined") return INITIAL_ADMIN_REVIEWS;

  try {
    const stored = localStorage.getItem(STORAGE_REVIEWS_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  return INITIAL_ADMIN_REVIEWS;
}

export async function updateReviewStatus(
  reviewId: string,
  status: "approved" | "pending" | "hidden" | "spam"
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const current = getAdminReviews();
    const updated = current.map((r) => (r.id === reviewId ? { ...r, status } : r));
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updated));
  } catch {}

  try {
    const supabase = createClient();
    await supabase.from("reviews").update({ status }).eq("id", reviewId);
  } catch {}
}

export async function deleteReviewItem(reviewId: string): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const current = getAdminReviews().filter((r) => r.id !== reviewId);
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(current));
  } catch {}

  try {
    const supabase = createClient();
    await supabase.from("reviews").delete().eq("id", reviewId);
  } catch {}
}
