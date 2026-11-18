import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";
import { createServerAdminClient } from "@/lib/supabase/server";
import { readLocalCategories, writeLocalCategories, CategoryPayload } from "@/lib/serverStores";

function checkAdminAuth(req: NextRequest): boolean {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const token = req.cookies?.get?.(ADMIN_COOKIE_NAME)?.value || (match ? match[1] : undefined);
  return Boolean(token && verifySessionToken(token));
}

// GET: Returns all categories
export async function GET() {
  try {
    let categories: CategoryPayload[] = readLocalCategories();

    // Attempt to merge or fetch latest from Supabase
    try {
      const supabase = createServerAdminClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        categories = data.map((d) => ({
          id: d.id,
          slug: d.slug,
          name: d.name,
          description: d.description || "",
          imageUrl: d.image_url || "",
          subcategories: Array.isArray(d.subcategories) ? d.subcategories : [],
          displayOrder: d.display_order ?? 1,
          isActive: d.is_active !== false,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
        writeLocalCategories(categories);
      }
    } catch {
      // Return local cache on DB failure
    }

    return NextResponse.json({
      success: true,
      categories: categories.sort((a, b) => a.displayOrder - b.displayOrder),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch categories";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Upsert category (Create or Update)
export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      id,
      slug,
      name,
      description = "",
      imageUrl = "",
      subcategories = [],
      displayOrder = 1,
      isActive = true,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Category name and slug are required." },
        { status: 400 }
      );
    }

    const cleanSlug = String(slug).trim().toLowerCase();
    const catId = id || `cat-${cleanSlug}`;
    const now = new Date().toISOString();

    const categoryItem: CategoryPayload = {
      id: catId,
      slug: cleanSlug,
      name: String(name).trim(),
      description: String(description).trim(),
      imageUrl: String(imageUrl).trim(),
      subcategories: Array.isArray(subcategories) ? subcategories : [],
      displayOrder: Number(displayOrder) || 1,
      isActive: Boolean(isActive),
      updatedAt: now,
    };

    // 1. Update local JSON file
    const current = readLocalCategories();
    const existingIndex = current.findIndex((c) => c.id === catId || c.slug === cleanSlug);
    if (existingIndex >= 0) {
      current[existingIndex] = { ...current[existingIndex], ...categoryItem };
    } else {
      current.push({ ...categoryItem, createdAt: now });
    }
    writeLocalCategories(current);

    // 2. Upsert to Supabase categories table
    try {
      const supabase = createServerAdminClient();
      await supabase.from("categories").upsert({
        id: categoryItem.id,
        slug: categoryItem.slug,
        name: categoryItem.name,
        description: categoryItem.description,
        image_url: categoryItem.imageUrl,
        subcategories: categoryItem.subcategories,
        display_order: categoryItem.displayOrder,
        is_active: categoryItem.isActive,
        updated_at: now,
      });
    } catch (dbErr) {
      console.warn("[Categories API] Supabase upsert notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      category: categoryItem,
      message: `Category "${categoryItem.name}" saved successfully.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save category";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Remove category
export async function DELETE(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required for deletion." },
        { status: 400 }
      );
    }

    // 1. Remove from local JSON
    const current = readLocalCategories();
    const updated = current.filter((c) => c.id !== id);
    writeLocalCategories(updated);

    // 2. Remove from Supabase
    try {
      const supabase = createServerAdminClient();
      await supabase.from("categories").delete().eq("id", id);
    } catch (dbErr) {
      console.warn("[Categories API] Supabase delete notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Category removed successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete category";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
