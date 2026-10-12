"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  X,
  Plus,
  Trash2,
  Edit2,
  Archive,
  Upload,
  Play,
  Star,
  Video,
  FileVideo,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Product } from "@/data/products";
import { formatINR } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import {
  getAdminProducts,
  saveProduct,
  deleteProduct,
  setProductStock,
  getCategories,
  CategoryItem,
} from "@/lib/catalog";

const ALL_SIZES = ["Free Size", "Standard", "XS", "S", "M", "L", "XL", "XXL", "Unstitched"];

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [stockStatusFilter, setStockStatusFilter] = React.useState<
    "all" | "in_stock" | "out_of_stock"
  >("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "draft" | "archived">(
    "all"
  );
  const [sortBy, setSortBy] = React.useState<"newest" | "price_asc" | "price_desc" | "name">(
    "newest"
  );

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);

  // Form Fields State
  const [formTitle, setFormTitle] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formCategory, setFormCategory] = React.useState<string>("sarees");
  const [formCategoryLabel, setFormCategoryLabel] = React.useState("Kanchipuram Silk");
  const [formCollection, setFormCollection] = React.useState("Royal Nizam Edit");
  const [formBrand, setFormBrand] = React.useState("Sreesha Elegance Atelier");
  const [formSku, setFormSku] = React.useState("");
  const [formPrice, setFormPrice] = React.useState("");
  const [formOriginalPrice, setFormOriginalPrice] = React.useState("");
  const [formSizes, setFormSizes] = React.useState<string[]>(["Free Size"]);
  const [formColors, setFormColors] = React.useState<string>("Emerald Green, Royal Gold");
  const [formStock, setFormStock] = React.useState<number>(15);
  const [formInStock, setFormInStock] = React.useState<boolean>(true);
  const [formTags, setFormTags] = React.useState<string>("Pure Silk, Bridal, Gold Zari");
  const [formStatus, setFormStatus] = React.useState<"active" | "draft" | "archived">("active");
  const [formBadge, setFormBadge] = React.useState<
    "NEW" | "BESTSELLER" | "SALE" | "LIMITED" | "NONE"
  >("NONE");

  // Media Gallery State
  const [galleryImages, setGalleryImages] = React.useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = React.useState<number>(0);
  const [imageUrlInput, setImageUrlInput] = React.useState("");
  const [formVideoUrl, setFormVideoUrl] = React.useState("");
  const [isVideoUploading, setIsVideoUploading] = React.useState(false);
  const [uploadedVideoName, setUploadedVideoName] = React.useState<string | null>(null);
  const videoFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Fashion Attributes State
  const [formFabric, setFormFabric] = React.useState("100% Pure Mulberry Silk");
  const [formWeave, setFormWeave] = React.useState("Korvai Handloom Weave with Contrast Pallu");
  const [formZariType, setFormZariType] = React.useState("Pure Gold & Silver Zari");
  const [formWashCare, setFormWashCare] = React.useState("Dry Clean Only (Protect Zari Weave)");
  const [formDispatchTime, setFormDispatchTime] = React.useState("Ships within 24-48 Hours");
  const [formShortDescription, setFormShortDescription] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");

  const refreshCatalog = () => {
    setProducts(getAdminProducts());
    setCategories(getCategories());
  };

  React.useEffect(() => {
    refreshCatalog();
  }, []);

  // Compute calculated discount percentage
  const calculatedDiscount = React.useMemo(() => {
    const p = Number(formPrice);
    const orig = Number(formOriginalPrice);
    if (orig && p && orig > p) {
      return Math.round(((orig - p) / orig) * 100);
    }
    return 0;
  }, [formPrice, formOriginalPrice]);

  const openAddModal = () => {
    setEditingProductId(null);
    setFormTitle("");
    setFormSlug("");
    setFormCategory("sarees");
    setFormCategoryLabel("Kanchipuram Silk");
    setFormCollection("Royal Nizam Edit");
    setFormBrand("Sreesha Elegance Atelier");
    setFormSku(`SE-${Date.now().toString().slice(-4)}`);
    setFormPrice("");
    setFormOriginalPrice("");
    setFormSizes(["Free Size"]);
    setFormColors("Emerald Green, Royal Gold");
    setFormStock(15);
    setFormInStock(true);
    setFormTags("Pure Silk, Bridal, Gold Zari");
    setFormStatus("active");
    setFormBadge("NEW");
    setGalleryImages([
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85",
    ]);
    setPrimaryImageIndex(0);
    setImageUrlInput("");
    setFormVideoUrl("");
    setUploadedVideoName(null);
    setIsVideoUploading(false);
    if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    setFormFabric("100% Pure Mulberry Silk");
    setFormWeave("Korvai Handloom Weave with Contrast Pallu");
    setFormZariType("Pure Gold & Silver Zari");
    setFormWashCare("Dry Clean Only");
    setFormDispatchTime("Ships within 24-48 Hours");
    setFormShortDescription("Master handloom weave curated for weddings and festive celebrations.");
    setFormDescription(
      "Heirloom grade pure silk saree handwoven with authentic gold zari. Sourced directly from Hyderabad master artisans."
    );
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormCategory(p.category);
    setFormCategoryLabel(p.categoryLabel);
    setFormCollection(p.collection || "Atelier Edit");
    setFormBrand(p.brand || "Sreesha Elegance Atelier");
    setFormSku(p.sku || p.id.toUpperCase());
    setFormPrice(String(p.price));
    setFormOriginalPrice(p.originalPrice ? String(p.originalPrice) : "");
    setFormSizes(p.sizes || ["Free Size"]);
    setFormColors(p.colors ? p.colors.join(", ") : p.color);
    setFormStock(p.stock !== undefined ? p.stock : 15);
    setFormInStock(p.inStock !== false);
    setFormTags(p.tags ? p.tags.join(", ") : "Handloom, Pure Silk");
    setFormStatus(p.status || "active");
    setFormBadge(p.badge || "NONE");

    const images =
      p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : [p.primaryImage];
    setGalleryImages(images);
    const primIdx = images.indexOf(p.primaryImage);
    setPrimaryImageIndex(primIdx >= 0 ? primIdx : 0);

    setImageUrlInput("");
    setFormVideoUrl(p.videoUrl || "");
    setUploadedVideoName(null);
    setIsVideoUploading(false);
    if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    setFormFabric(p.fabric);
    setFormWeave(p.weave);
    setFormZariType(p.details?.zariType || "Gold Zari");
    setFormWashCare(p.details?.washCare || "Dry Clean Only");
    setFormDispatchTime(p.details?.dispatchTime || "Ships within 24-48 Hours");
    setFormShortDescription(p.shortDescription);
    setFormDescription(p.description);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingProductId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormSlug(generated);
    }
  };

  const toggleSize = (size: string) => {
    setFormSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setGalleryImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput("");
    showToast.success("Image added to gallery");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast.error(`File ${file.name} exceeds 5MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setGalleryImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    showToast.success("Images uploaded to gallery preview");
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    setGalleryImages((prev) => {
      const copy = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleRemoveImage = (index: number) => {
    if (galleryImages.length <= 1) {
      showToast.error("Product must have at least one image");
      return;
    }
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 100;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast.error(`Video file "${file.name}" exceeds ${MAX_SIZE_MB}MB size limit.`);
      return;
    }

    setIsVideoUploading(true);
    setUploadedVideoName(file.name);
    showToast.info(`Reading and preparing video "${file.name}"...`);

    try {
      // 1. Try uploading to Supabase Storage if bucket is reachable
      let cloudUrl: string | null = null;
      try {
        const supabase = createClient();
        const ext = file.name.split(".").pop() || "mp4";
        const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filePath = `product-videos/${cleanName}`;

        const { data, error } = await supabase.storage
          .from("product-videos")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (!error && data?.path) {
          const { data: pubData } = supabase.storage.from("product-videos").getPublicUrl(data.path);
          if (pubData?.publicUrl) {
            cloudUrl = pubData.publicUrl;
          }
        }
      } catch {
        // Fallback to local Data URL
      }

      if (cloudUrl) {
        setFormVideoUrl(cloudUrl);
        showToast.success(`Video "${file.name}" uploaded to cloud storage successfully!`);
        setIsVideoUploading(false);
        return;
      }

      // 2. Fallback: FileReader readAsDataURL for local / offline support
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormVideoUrl(event.target.result as string);
          showToast.success(`Video "${file.name}" uploaded from device!`);
        }
        setIsVideoUploading(false);
      };
      reader.onerror = () => {
        showToast.error("Failed to read video file from device.");
        setIsVideoUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading video";
      showToast.error(msg);
      setIsVideoUploading(false);
    }
  };

  const handleRemoveVideo = () => {
    setFormVideoUrl("");
    setUploadedVideoName(null);
    if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    showToast.info("Product demonstration video removed");
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formPrice) {
      showToast.error("Title and selling price are required");
      return;
    }

    if (galleryImages.length === 0) {
      showToast.error("Please add at least one product image");
      return;
    }

    const priceNum = Number(formPrice);
    const origPriceNum = formOriginalPrice ? Number(formOriginalPrice) : undefined;
    const primaryImg = galleryImages[primaryImageIndex] || galleryImages[0];

    const colorsList = formColors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const tagsList = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const productToSave: Product = {
      id: editingProductId || `prod_${Date.now()}`,
      slug: formSlug.trim() || `prod-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory as Product["category"],
      categoryLabel: formCategoryLabel.trim(),
      collection: formCollection.trim(),
      brand: formBrand.trim(),
      sku: formSku.trim(),
      price: priceNum,
      originalPrice: origPriceNum,
      primaryImage: primaryImg,
      galleryImages: galleryImages,
      videoUrl: formVideoUrl.trim() || undefined,
      badge: formBadge === "NONE" ? undefined : formBadge,
      rating: 5.0,
      reviewCount: 1,
      sizes: formSizes.length > 0 ? formSizes : ["Free Size"],
      colors: colorsList,
      color: colorsList[0] || "Gold",
      tags: tagsList,
      stock: Number(formStock) || 0,
      inStock: formInStock,
      status: formStatus,
      fabric: formFabric.trim(),
      weave: formWeave.trim(),
      occasion: "Bridal & Celebrations",
      silkMarkCertified: true,
      blouseIncluded: true,
      shortDescription: formShortDescription.trim(),
      description: formDescription.trim(),
      details: {
        origin: "Hyderabad Atelier",
        zariType: formZariType.trim(),
        sareeLength: "5.5 meters",
        blouseLength: "0.8 meters",
        washCare: formWashCare.trim(),
        dispatchTime: formDispatchTime.trim(),
      },
      updatedAt: new Date().toISOString(),
    };

    await saveProduct(productToSave);
    refreshCatalog();
    setIsModalOpen(false);
    showToast.success(
      editingProductId
        ? `Ensemble "${productToSave.title}" updated successfully`
        : `Ensemble "${productToSave.title}" added to boutique catalog`
    );
  };

  const handleToggleStock = async (p: Product) => {
    const nextStatus = !p.inStock;
    await setProductStock(p.id, nextStatus);
    refreshCatalog();
    showToast.success(`Item "${p.title}" marked as ${nextStatus ? "In Stock" : "Out of Stock"}`);
  };

  const handleToggleArchive = async (p: Product) => {
    const nextStatus: "active" | "archived" = p.status === "archived" ? "active" : "archived";
    const updated: Product = { ...p, status: nextStatus };
    await saveProduct(updated);
    refreshCatalog();
    showToast.info(`Ensemble status set to: ${nextStatus.toUpperCase()}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this ensemble from the catalog?"))
      return;
    await deleteProduct(id);
    refreshCatalog();
    showToast.info("Ensemble permanently removed");
  };

  // Bulk actions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)));
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Archive ${selectedIds.length} selected products?`)) return;

    for (const id of selectedIds) {
      const p = products.find((item) => item.id === id);
      if (p) await saveProduct({ ...p, status: "archived" });
    }
    setSelectedIds([]);
    refreshCatalog();
    showToast.success("Selected products archived");
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Warning: Permanently delete ${selectedIds.length} selected products?`)) return;

    for (const id of selectedIds) {
      await deleteProduct(id);
    }
    setSelectedIds([]);
    refreshCatalog();
    showToast.info("Selected products removed");
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesStock =
        stockStatusFilter === "all" ||
        (stockStatusFilter === "in_stock" && p.inStock) ||
        (stockStatusFilter === "out_of_stock" && !p.inStock);
      const matchesStatus = statusFilter === "all" || (p.status || "active") === statusFilter;

      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0; // default newest
    });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Haute Couture Inventory
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-[#1C1B19] mt-0.5">
            Product Management &amp; Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Complete control over handloom catalog, multi-image galleries, video spotlights, and
            stock.
          </p>
        </div>

        <Button
          type="button"
          onClick={openAddModal}
          className="bg-[#B79B63] hover:bg-[#a3874f] text-[#1C1B19] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xs shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Ensemble</span>
        </Button>
      </div>

      {/* Filter, Search & Bulk Bar */}
      <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, SKU, weave..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none rounded-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 rounded-xs outline-none focus:border-[#B79B63] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={stockStatusFilter}
              onChange={(e) =>
                setStockStatusFilter(e.target.value as "all" | "in_stock" | "out_of_stock")
              }
              className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 rounded-xs outline-none focus:border-[#B79B63] cursor-pointer"
            >
              <option value="all">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "draft" | "archived")
              }
              className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 rounded-xs outline-none focus:border-[#B79B63] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="draft">Drafts Only</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "price_asc" | "price_desc" | "name")
              }
              className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 rounded-xs outline-none focus:border-[#B79B63] cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between text-xs bg-[#FAF7F2] p-2 rounded-xs">
            <span className="font-semibold text-[#1C1B19]">
              {selectedIds.length} ensembles selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBulkArchive}
                className="text-xs h-8"
              >
                <Archive className="w-3.5 h-3.5 mr-1" /> Bulk Archive
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBulkDelete}
                className="text-xs h-8 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Bulk Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="p-3.5 pl-4 w-8">
                  <input
                    type="checkbox"
                    checked={
                      filteredProducts.length > 0 && selectedIds.length === filteredProducts.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="accent-[#B79B63] cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Cover</th>
                <th className="p-3.5">Product Title &amp; SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price &amp; MRP</th>
                <th className="p-3.5 text-center">Stock</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Rating</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-xs text-stone-400">
                    No products found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3.5 pl-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={(e) => handleSelectOne(p.id, e.target.checked)}
                        className="accent-[#B79B63] cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="relative w-12 h-14 bg-[#EFE8DD] border border-[#E8E2D8] rounded-2xs overflow-hidden">
                        <Image
                          src={p.primaryImage}
                          alt={p.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        {p.videoUrl && (
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white p-0.5 rounded-full">
                            <Play className="w-2 h-2 fill-current" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-xs text-[#1C1B19] max-w-xs truncate">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-stone-400">
                          SKU: {p.sku || p.id}
                        </span>
                        {p.badge && (
                          <span className="px-1 py-0.2 bg-[#FAF7F2] border border-[#B79B63]/40 text-[9px] text-[#B79B63] font-bold rounded-2xs">
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize text-stone-600">{p.category}</span>
                      <p className="text-[10px] text-stone-400">{p.categoryLabel}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-xs text-[#1C1B19]">{formatINR(p.price)}</p>
                      {p.originalPrice && (
                        <p className="text-[10px] text-stone-400 line-through">
                          {formatINR(p.originalPrice)}
                        </p>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStock(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer ${
                          p.inStock
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Sold Out"}
                      </button>
                      <p className="text-[9px] text-stone-400 mt-0.5 font-mono">
                        {p.stock !== undefined ? `${p.stock} units` : "15 units"}
                      </p>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          p.status === "active" || !p.status
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : p.status === "draft"
                              ? "bg-stone-100 text-stone-600 border-stone-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {(p.status || "active").toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-0.5 text-[#B79B63]">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-semibold">{p.rating}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">({p.reviewCount})</span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/women/${p.category}/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-[#B79B63] hover:bg-[#FAF7F2] rounded-2xs transition-colors"
                          title="Preview in Store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-stone-500 hover:text-[#B79B63] hover:bg-[#FAF7F2] rounded-2xs transition-colors cursor-pointer"
                          title="Edit Ensemble"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleArchive(p)}
                          className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-2xs transition-colors cursor-pointer"
                          title={p.status === "archived" ? "Unarchive" : "Archive"}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xs transition-colors cursor-pointer"
                          title="Delete Ensemble"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Comprehensive Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-2xl w-full max-w-3xl p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79B63] font-bold">
                  {editingProductId ? "Catalog Editor" : "New Haute Couture Creation"}
                </span>
                <h2 className="font-serif text-2xl text-[#1C1B19]">
                  {editingProductId ? "Edit Ensemble" : "Add New Fashion Ensemble"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-[#1C1B19] p-1.5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Section 1: Basic Identifiers */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C1B19] border-b pb-1">
                  1. Ensemble Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Kanchipuram Pure Silk Saree — Crimson & Gold Zari"
                      className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-[#1C1B19] font-medium outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="kanchipuram-pure-silk-saree-crimson"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-mono text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      placeholder="e.g. SE-KAN-889"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-mono text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Subcategory Label
                    </label>
                    <input
                      type="text"
                      value={formCategoryLabel}
                      onChange={(e) => setFormCategoryLabel(e.target.value)}
                      placeholder="e.g. Kanchipuram Silk"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Collection Edit
                    </label>
                    <input
                      type="text"
                      value={formCollection}
                      onChange={(e) => setFormCollection(e.target.value)}
                      placeholder="e.g. Royal Nizam Edit"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing, Stock & Status */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C1B19] border-b pb-1">
                  2. Pricing, Inventory &amp; Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="18500"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-sm font-semibold text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      MRP / Original Price (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      placeholder="24000"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                    />
                    {calculatedDiscount > 0 && (
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                        {calculatedDiscount}% Discount
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Publication Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) =>
                        setFormStatus(e.target.value as "active" | "draft" | "archived")
                      }
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs cursor-pointer"
                    >
                      <option value="active">Active (Live in Store)</option>
                      <option value="draft">Draft (Private)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Badge Highlight
                    </label>
                    <select
                      value={formBadge}
                      onChange={(e) =>
                        setFormBadge(
                          e.target.value as "NEW" | "BESTSELLER" | "SALE" | "LIMITED" | "NONE"
                        )
                      }
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs cursor-pointer"
                    >
                      <option value="NONE">No Badge</option>
                      <option value="NEW">NEW ARRIVAL</option>
                      <option value="BESTSELLER">BESTSELLER</option>
                      <option value="SALE">SALE</option>
                      <option value="LIMITED">LIMITED EDITION</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1C1B19]">
                      <input
                        type="checkbox"
                        checked={formInStock}
                        onChange={(e) => setFormInStock(e.target.checked)}
                        className="accent-[#B79B63] cursor-pointer"
                      />
                      <span>In Stock (Patrons can purchase immediately)</span>
                    </label>
                  </div>
                </div>

                {/* Sizes Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                    Available Sizes (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ALL_SIZES.map((sz) => {
                      const isSelected = formSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => toggleSize(sz)}
                          className={`px-3 py-1.5 border text-xs rounded-2xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19] font-semibold"
                              : "bg-[#FAF7F2] text-stone-600 border-[#E8E2D8] hover:border-[#B79B63]"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: Multi-Image Gallery & Video Upload */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C1B19] border-b pb-1">
                  3. Multiple Image Gallery &amp; Video Spotlight
                </h3>

                {/* Add Image Inputs */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Add Image URL (https://...)"
                      className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs outline-none focus:border-[#B79B63] rounded-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddImageUrl}
                      className="text-xs h-9"
                    >
                      Add URL
                    </Button>
                  </div>

                  <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE8DD] border border-[#E8E2D8] text-xs font-semibold text-[#1C1B19] cursor-pointer rounded-xs transition-colors">
                    <Upload className="w-4 h-4 text-[#B79B63]" />
                    <span>Upload From Device</span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Gallery Preview & Reorder List */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {galleryImages.map((img, idx) => {
                    const isCover = primaryImageIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`relative p-2 bg-[#FAF7F2] border rounded-xs space-y-1.5 transition-all ${
                          isCover ? "border-[#B79B63] ring-1 ring-[#B79B63]" : "border-[#E8E2D8]"
                        }`}
                      >
                        <div className="relative aspect-[3/4] w-full bg-stone-200 overflow-hidden rounded-2xs">
                          <Image
                            src={img}
                            alt={`Gallery image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          {isCover && (
                            <span className="absolute top-1 left-1 bg-[#B79B63] text-[#1C1B19] text-[9px] font-bold px-1.5 py-0.5 rounded-2xs uppercase tracking-wider">
                              Cover Image
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <button
                            type="button"
                            onClick={() => setPrimaryImageIndex(idx)}
                            className={`text-[10px] uppercase font-bold cursor-pointer ${
                              isCover ? "text-[#B79B63]" : "text-stone-400 hover:text-[#1C1B19]"
                            }`}
                          >
                            {isCover ? "★ Main Cover" : "Set as Cover"}
                          </button>

                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, "up")}
                              className="p-1 text-stone-400 hover:text-[#1C1B19] disabled:opacity-30 cursor-pointer"
                              title="Move Earlier"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === galleryImages.length - 1}
                              onClick={() => handleMoveImage(idx, "down")}
                              className="p-1 text-stone-400 hover:text-[#1C1B19] disabled:opacity-30 cursor-pointer"
                              title="Move Later"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                              title="Remove Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Product Video Field */}
                <div className="pt-3 border-t border-[#E8E2D8]/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-semibold text-[#1C1B19] uppercase tracking-wider">
                        Product Demonstration Video
                      </label>
                      <p className="text-[11px] text-stone-500">
                        Upload MP4 / WebM / MOV videos directly from your device or paste an
                        external hosted URL.
                      </p>
                    </div>
                    {formVideoUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium cursor-pointer"
                        title="Remove current video"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Video
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {/* Option 1: Upload from Device */}
                    <label
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2 border text-xs font-semibold rounded-xs transition-colors cursor-pointer select-none ${
                        isVideoUploading
                          ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                          : "bg-[#FAF7F2] hover:bg-[#EFE8DD] border-[#E8E2D8] text-[#1C1B19]"
                      }`}
                    >
                      {isVideoUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#B79B63]" />
                          <span>Processing Video...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-[#B79B63]" />
                          <span>Upload Video From Device</span>
                        </>
                      )}
                      <input
                        ref={videoFileInputRef}
                        type="file"
                        disabled={isVideoUploading}
                        accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.mov"
                        onChange={handleVideoFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Option 2: Paste Hosted URL */}
                    <div className="flex-1 relative">
                      <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="url"
                        value={formVideoUrl.startsWith("data:") ? "" : formVideoUrl}
                        onChange={(e) => {
                          setFormVideoUrl(e.target.value);
                          setUploadedVideoName(null);
                        }}
                        placeholder={
                          formVideoUrl.startsWith("data:")
                            ? `✓ Uploaded from device (${uploadedVideoName || "Local video"})`
                            : "Or enter Video URL (https://.../video.mp4)"
                        }
                        className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs outline-none focus:border-[#B79B63] rounded-xs"
                      />
                    </div>
                  </div>

                  {/* Video Preview Player */}
                  {formVideoUrl && (
                    <div className="mt-2.5 p-3 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1C1B19] flex items-center gap-1.5">
                          <FileVideo className="w-4 h-4 text-[#B79B63]" />
                          {uploadedVideoName ? uploadedVideoName : "Demonstration Video Preview"}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-2xs border border-emerald-200">
                          Ready for Spotlight
                        </span>
                      </div>
                      <div className="aspect-video w-full max-w-md bg-black rounded-xs overflow-hidden shadow-xs">
                        <video
                          key={formVideoUrl.slice(0, 50)}
                          src={formVideoUrl}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Fashion Attributes & Narrative */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1C1B19] border-b pb-1">
                  4. Fabric, Craftsmanship &amp; Storytelling
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Fabric Material
                    </label>
                    <input
                      type="text"
                      value={formFabric}
                      onChange={(e) => setFormFabric(e.target.value)}
                      placeholder="e.g. Pure Mulberry Silk"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Weave / Craft
                    </label>
                    <input
                      type="text"
                      value={formWeave}
                      onChange={(e) => setFormWeave(e.target.value)}
                      placeholder="e.g. Korvai Handloom with Contrast Pallu"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Color Shades
                    </label>
                    <input
                      type="text"
                      value={formColors}
                      onChange={(e) => setFormColors(e.target.value)}
                      placeholder="Emerald Green, Royal Gold"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                      Zari &amp; Embellishment Type
                    </label>
                    <input
                      type="text"
                      value={formZariType}
                      onChange={(e) => setFormZariType(e.target.value)}
                      placeholder="Pure Gold & Silver Zari"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs outline-none focus:border-[#B79B63] rounded-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                    Short Description (Product Card &amp; Sharing)
                  </label>
                  <input
                    type="text"
                    value={formShortDescription}
                    onChange={(e) => setFormShortDescription(e.target.value)}
                    placeholder="Brief 1-line luxury summary"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs outline-none focus:border-[#B79B63] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                    Full Atelier Narrative &amp; Craft Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Detailed narrative describing the heritage weave, motifs, drape weight, and artisan legacy..."
                    className="w-full p-3 bg-[#FAF7F2] border border-[#E8E2D8] text-xs outline-none focus:border-[#B79B63] rounded-xs resize-none"
                  />
                </div>
              </div>

              {/* Modal Action Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D8]">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#B79B63] hover:bg-[#a3874f] text-[#1C1B19] font-bold text-xs uppercase tracking-wider px-6"
                >
                  {editingProductId ? "Update Product" : "Publish Ensemble"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
