"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import {
  CategoryItem,
  getCategories,
  saveCategory,
  deleteCategory,
  getAdminProducts,
} from "@/lib/catalog";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [products, setProducts] = React.useState(() => getAdminProducts());
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<CategoryItem | null>(null);

  // Form State
  const [formName, setFormName] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formImageUrl, setFormImageUrl] = React.useState("");
  const [formSubcategories, setFormSubcategories] = React.useState("");
  const [formDisplayOrder, setFormDisplayOrder] = React.useState(1);
  const [formIsActive, setFormIsActive] = React.useState(true);

  React.useEffect(() => {
    setCategories(getCategories());
    setProducts(getAdminProducts());
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormImageUrl(
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
    );
    setFormSubcategories("");
    setFormDisplayOrder(categories.length + 1);
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description);
    setFormImageUrl(cat.imageUrl);
    setFormSubcategories(cat.subcategories.join(", "));
    setFormDisplayOrder(cat.displayOrder);
    setFormIsActive(cat.isActive);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormSlug(generated);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formSlug.trim()) {
      showToast.error("Category name and slug are required");
      return;
    }

    const subcats = formSubcategories
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const categoryToSave: CategoryItem = {
      id: editingCategory ? editingCategory.id : `cat-${formSlug.trim()}`,
      slug: formSlug.trim(),
      name: formName.trim(),
      description: formDescription.trim(),
      imageUrl:
        formImageUrl.trim() || "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
      subcategories: subcats,
      displayOrder: Number(formDisplayOrder) || 1,
      isActive: formIsActive,
    };

    await saveCategory(categoryToSave);
    setCategories(getCategories());
    setIsModalOpen(false);
    showToast.success(
      editingCategory
        ? `Category "${categoryToSave.name}" updated successfully`
        : `Category "${categoryToSave.name}" created successfully`
    );
  };

  const handleDelete = async (cat: CategoryItem) => {
    const productsInCat = products.filter((p) => p.category === cat.slug);
    if (productsInCat.length > 0) {
      if (
        !confirm(
          `Warning: ${productsInCat.length} products currently belong to "${cat.name}". Are you sure you want to remove this category?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm(`Are you sure you want to remove category "${cat.name}"?`)) return;
    }

    await deleteCategory(cat.id);
    setCategories(getCategories());
    showToast.info(`Category "${cat.name}" removed`);
  };

  const toggleCategoryStatus = async (cat: CategoryItem) => {
    const updated = { ...cat, isActive: !cat.isActive };
    await saveCategory(updated);
    setCategories(getCategories());
    showToast.success(`Category "${cat.name}" status: ${updated.isActive ? "Active" : "Hidden"}`);
  };

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.subcategories.some((sub) => sub.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && c.isActive) ||
      (statusFilter === "inactive" && !c.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Catalog Hierarchy
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-[#1C1B19] mt-0.5">
            Category Management
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Organize haute couture collections, fabrics, and customer navigation taxonomies.
          </p>
        </div>

        <Button
          type="button"
          onClick={openAddModal}
          className="bg-[#B79B63] hover:bg-[#a3874f] text-[#1C1B19] font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xs shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories or subcategories..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none rounded-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 rounded-xs outline-none focus:border-[#B79B63] cursor-pointer"
          >
            <option value="all">All ({categories.length})</option>
            <option value="active">Active Only</option>
            <option value="inactive">Hidden Only</option>
          </select>
        </div>
      </div>

      {/* Category Table */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="p-3.5 pl-5">Cover</th>
                <th className="p-3.5">Category Name</th>
                <th className="p-3.5">Slug</th>
                <th className="p-3.5">Subcategories</th>
                <th className="p-3.5 text-center">Products</th>
                <th className="p-3.5 text-center">Order</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/60">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-stone-400">
                    No categories found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const productCount = products.filter((p) => p.category === cat.slug).length;
                  return (
                    <tr key={cat.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="relative w-12 h-14 bg-[#EFE8DD] border border-[#E8E2D8] rounded-2xs overflow-hidden">
                          <Image
                            src={cat.imageUrl}
                            alt={cat.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-sm text-[#1C1B19]">{cat.name}</p>
                        <p className="text-[11px] text-stone-400 max-w-xs truncate">
                          {cat.description}
                        </p>
                      </td>
                      <td className="p-3.5 font-mono text-stone-500 text-[11px]">/{cat.slug}</td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cat.subcategories.slice(0, 3).map((sub, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[10px] text-stone-600 rounded-2xs"
                            >
                              {sub}
                            </span>
                          ))}
                          {cat.subcategories.length > 3 && (
                            <span className="text-[10px] text-stone-400 self-center">
                              +{cat.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-medium text-[#1C1B19]">
                        {productCount}
                      </td>
                      <td className="p-3.5 text-center font-mono text-stone-500">
                        #{cat.displayOrder}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCategoryStatus(cat)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-colors cursor-pointer ${
                            cat.isActive
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                          }`}
                        >
                          {cat.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>{cat.isActive ? "Active" : "Hidden"}</span>
                        </button>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 text-stone-500 hover:text-[#B79B63] hover:bg-[#FAF7F2] rounded-2xs transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat)}
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xs transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <h2 className="font-serif text-xl text-[#1C1B19]">
                {editingCategory ? "Edit Category" : "Add New Fashion Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-[#1C1B19] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Silk Sarees"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
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
                  placeholder="e.g. sarees"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] font-mono outline-none focus:border-[#B79B63] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief narrative of the weave and craft..."
                  className="w-full p-3 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                />
                {formImageUrl && (
                  <div className="mt-2 relative w-20 h-24 bg-stone-100 border border-[#E8E2D8] rounded-2xs overflow-hidden">
                    <Image src={formImageUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                  Subcategories (comma separated)
                </label>
                <input
                  type="text"
                  value={formSubcategories}
                  onChange={(e) => setFormSubcategories(e.target.value)}
                  placeholder="e.g. Kanchipuram, Banarasi, Chanderi"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B19] mb-1 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63] rounded-xs"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1C1B19]">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="accent-[#B79B63] cursor-pointer"
                    />
                    <span>Active on Customer Store</span>
                  </label>
                </div>
              </div>

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
                  className="bg-[#B79B63] hover:bg-[#a3874f] text-[#1C1B19] font-bold text-xs uppercase tracking-wider px-5"
                >
                  {editingCategory ? "Update Category" : "Save Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
