"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Search,
  ExternalLink,
  Check,
  X,
  Plus,
  Filter,
  Sparkles,
  Trash2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";
import { formatINR } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

const STORAGE_CUSTOM_PRODUCTS_KEY = "sreesha_admin_custom_products";
const STORAGE_STOCK_MAP_KEY = "sreesha_admin_stock_map";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(() => {
    if (typeof window === "undefined") return PRODUCTS;
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return [...parsed, ...PRODUCTS];
      }
    } catch {}
    return PRODUCTS;
  });

  const [stockMap, setStockMap] = React.useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(STORAGE_STOCK_MAP_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {};
  });

  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [stockStatusFilter, setStockStatusFilter] = React.useState<
    "all" | "in_stock" | "out_of_stock"
  >("all");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Add Product Form State
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<
    "sarees" | "lehengas" | "kurtis" | "contemporary"
  >("sarees");
  const [newPrice, setNewPrice] = React.useState("");
  const [newOriginalPrice, setNewOriginalPrice] = React.useState("");
  const [newFabric, setNewFabric] = React.useState("Pure Kanchipuram Silk");
  const [newWeave, setNewWeave] = React.useState("Zari Brocade Weave");
  const [newImage, setNewImage] = React.useState(
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
  );

  const toggleStock = async (id: string) => {
    const current = stockMap[id] !== false; // default true
    const next = !current;

    setStockMap((prev) => {
      const updated = { ...prev, [id]: next };
      try {
        localStorage.setItem(STORAGE_STOCK_MAP_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const supabase = createClient();
      await supabase.from("products").update({ in_stock: next }).eq("id", id);
    } catch {}

    showToast.success(`Item status set to: ${next ? "In Stock" : "Out of Stock"}`);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this ensemble from the catalog?")) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((p: Product) => p.id !== id);
        localStorage.setItem(STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(filtered));
      }
    } catch {}

    try {
      const supabase = createClient();
      await supabase.from("products").delete().eq("id", id);
    } catch {}

    showToast.info("Ensemble removed from boutique catalog");
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) {
      showToast.error("Please provide title and price");
      return;
    }

    const priceNum = Number(newPrice);
    const origPriceNum = newOriginalPrice ? Number(newOriginalPrice) : undefined;
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const newId = `custom_${Date.now()}`;

    const categoryLabels: Record<string, string> = {
      sarees: "Silk Sarees",
      lehengas: "Bridal Lehengas",
      kurtis: "Designer Kurtis",
      contemporary: "Contemporary",
    };

    const newProduct: Product = {
      id: newId,
      slug,
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || "Silk Sarees",
      collection: "Atelier New Arrivals",
      price: priceNum,
      originalPrice: origPriceNum,
      primaryImage: newImage.trim(),
      galleryImages: [newImage.trim()],
      rating: 5.0,
      reviewCount: 1,
      sizes: ["Free Size"],
      fabric: newFabric,
      weave: newWeave,
      color: "Heritage Gold",
      occasion: "Bridal & Festive",
      silkMarkCertified: true,
      blouseIncluded: true,
      shortDescription: `Handcrafted ${newFabric} ensemble curated for royal celebrations.`,
      description: `Bespoke craftsmanship featuring authentic ${newWeave}. Handloom woven with pure gold and silver zari embellishments in Hyderabad.`,
      details: {
        origin: "Hyderabad Atelier",
        zariType: newWeave,
        sareeLength: "5.5 meters",
        blouseLength: "0.8 meters",
        washCare: "Dry Clean Only",
        dispatchTime: "Ships within 24-48 Hours",
      },
    };

    const updatedList = [newProduct, ...products];
    setProducts(updatedList);

    // Save custom products to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
      const existingCustom = stored ? JSON.parse(stored) : [];
      localStorage.setItem(
        STORAGE_CUSTOM_PRODUCTS_KEY,
        JSON.stringify([newProduct, ...existingCustom])
      );
    } catch {}

    // Save to Supabase if available
    try {
      const supabase = createClient();
      await supabase.from("products").insert([
        {
          id: newProduct.id,
          slug: newProduct.slug,
          title: newProduct.title,
          category: newProduct.category,
          category_label: newProduct.categoryLabel,
          collection: newProduct.collection,
          price: newProduct.price,
          original_price: newProduct.originalPrice,
          primary_image: newProduct.primaryImage,
          gallery_images: newProduct.galleryImages,
          fabric: newProduct.fabric,
          weave: newProduct.weave,
          color: newProduct.color,
          occasion: newProduct.occasion,
          silk_mark_certified: newProduct.silkMarkCertified,
          blouse_included: newProduct.blouseIncluded,
          short_description: newProduct.shortDescription,
          description: newProduct.description,
          details: newProduct.details,
          in_stock: true,
        },
      ]);
    } catch {}

    showToast.success(`New ensemble "${newProduct.title}" added to boutique catalog!`);
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewPrice("");
    setNewOriginalPrice("");
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(search.toLowerCase()) ||
      p.fabric.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;

    const inStock = stockMap[p.id] !== false;
    const matchesStock =
      stockStatusFilter === "all" ||
      (stockStatusFilter === "in_stock" && inStock) ||
      (stockStatusFilter === "out_of_stock" && !inStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalInStock = products.filter((p) => stockMap[p.id] !== false).length;
  const totalOutOfStock = products.length - totalInStock;

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Curated Catalog
          </span>
          <h1 className="text-2xl font-serif text-[#1C1B19]">
            Atelier Inventory &amp; Stock Levels
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage handloom saree availability, couture inventory, and catalog additions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs bg-[#B79B63] hover:bg-[#A88C55] text-[#1C1B19] font-bold gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Ensemble</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setStockStatusFilter("all")}
          className={`bg-white p-4 border rounded-xs shadow-xs cursor-pointer transition-all ${
            stockStatusFilter === "all"
              ? "border-[#B79B63] ring-1 ring-[#B79B63]"
              : "border-[#E8E2D8]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Total Catalog Items
            </span>
            <Package className="w-4 h-4 text-[#B79B63]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1B19] mt-2">{products.length}</p>
          <span className="text-[10px] text-stone-400">Handloom &amp; couture garments</span>
        </div>

        <div
          onClick={() => setStockStatusFilter("in_stock")}
          className={`bg-white p-4 border rounded-xs shadow-xs cursor-pointer transition-all ${
            stockStatusFilter === "in_stock"
              ? "border-emerald-500 ring-1 ring-emerald-500"
              : "border-[#E8E2D8]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Available in Stock
            </span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-semibold text-emerald-700 mt-2">{totalInStock}</p>
          <span className="text-[10px] text-stone-400">Ready for immediate dispatch</span>
        </div>

        <div
          onClick={() => setStockStatusFilter("out_of_stock")}
          className={`bg-white p-4 border rounded-xs shadow-xs cursor-pointer transition-all ${
            stockStatusFilter === "out_of_stock"
              ? "border-rose-500 ring-1 ring-rose-500"
              : "border-[#E8E2D8]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Out of Stock / Reserved
            </span>
            <X className="w-4 h-4 text-rose-500" />
          </div>
          <p className="font-serif text-2xl font-semibold text-rose-600 mt-2">{totalOutOfStock}</p>
          <span className="text-[10px] text-stone-400">Marked unavailable online</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, weave, fabric, ID..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {["all", "sarees", "lehengas", "kurtis", "contemporary"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xs capitalize text-[11px] font-medium transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#1C1B19] text-[#B79B63]"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="p-3.5 pl-5">Piece</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Weave / Fabric</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Stock Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/60">
              {filtered.map((item) => {
                const inStock = stockMap[item.id] !== false;
                const isCustom = item.id.startsWith("custom_");

                return (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-3.5 pl-5 flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
                        <Image
                          src={item.primaryImage}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-serif font-medium text-[#1C1B19]">{item.title}</p>
                        <p className="text-[10px] text-stone-400 font-mono">
                          ID: {item.id}{" "}
                          {isCustom && <span className="text-[#B79B63]">• Custom</span>}
                        </p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-700 rounded-xs text-[10px] uppercase tracking-wider font-medium">
                        {item.categoryLabel}
                      </span>
                    </td>

                    <td className="p-3.5 text-stone-600">
                      <p>{item.fabric}</p>
                      <p className="text-[11px] text-stone-400">{item.weave}</p>
                    </td>

                    <td className="p-3.5 font-semibold text-[#1C1B19]">{formatINR(item.price)}</td>

                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => toggleStock(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors cursor-pointer ${
                          inStock
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {inStock ? (
                          <>
                            <Check className="w-2.5 h-2.5" /> In Stock
                          </>
                        ) : (
                          <>
                            <X className="w-2.5 h-2.5" /> Out of Stock
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/women/${item.category}/${item.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] text-[#B79B63] hover:text-[#1C1B19] font-medium uppercase tracking-wider"
                          title="View on Customer Store"
                        >
                          <span>Store</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>

                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(item.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove Piece"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 border border-[#E8E2D8] shadow-2xl rounded-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79B63] font-bold">
                  Catalog Management
                </span>
                <h3 className="font-serif text-lg text-[#1C1B19]">Add New Boutique Ensemble</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-1">
                  Ensemble Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Hyderabad Kanchipuram Silk Saree"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xs focus:border-[#B79B63] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xs focus:border-[#B79B63] outline-none bg-white"
                  >
                    <option value="sarees">Silk Sarees</option>
                    <option value="lehengas">Bridal Lehengas</option>
                    <option value="kurtis">Designer Kurtis</option>
                    <option value="contemporary">Contemporary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="24500"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xs focus:border-[#B79B63] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-1">
                    Fabric
                  </label>
                  <input
                    type="text"
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
                    placeholder="Pure Kanchipuram Silk"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xs focus:border-[#B79B63] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-1">
                    Weave Technique
                  </label>
                  <input
                    type="text"
                    value={newWeave}
                    onChange={(e) => setNewWeave(e.target.value)}
                    placeholder="Korvai Zari Weave"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xs focus:border-[#B79B63] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-1">
                  Primary Image URL
                </label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xs focus:border-[#B79B63] outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="text-xs bg-[#B79B63] hover:bg-[#A88C55] text-[#1C1B19] font-bold"
                >
                  Save to Catalog
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
