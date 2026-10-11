"use client";

import * as React from "react";
import { Star, Search, CheckCircle, EyeOff, Trash2, ShieldCheck } from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import {
  AdminReviewItem,
  getAdminReviews,
  updateReviewStatus,
  deleteReviewItem,
} from "@/lib/catalog";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<AdminReviewItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "approved" | "pending" | "hidden" | "spam"
  >("all");
  const [ratingFilter, setRatingFilter] = React.useState<number | "all">("all");

  React.useEffect(() => {
    setReviews(getAdminReviews());
  }, []);

  const handleStatusChange = async (
    reviewId: string,
    newStatus: "approved" | "pending" | "hidden" | "spam"
  ) => {
    await updateReviewStatus(reviewId, newStatus);
    setReviews(getAdminReviews());
    showToast.success(`Review status updated to: ${newStatus.toUpperCase()}`);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to permanently delete this patron review?")) return;
    await deleteReviewItem(reviewId);
    setReviews(getAdminReviews());
    showToast.info("Patron review removed");
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesRating = ratingFilter === "all" || r.rating === ratingFilter;

    return matchesSearch && matchesStatus && matchesRating;
  });

  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const hiddenCount = reviews.filter((r) => r.status === "hidden" || r.status === "spam").length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Voice of Patrons
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-[#1C1B19] mt-0.5">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Audit testimonials, verify purchases, and ensure authenticity across the boutique
            catalog.
          </p>
        </div>

        {/* Rating Summary Pill */}
        <div className="flex items-center gap-2 bg-white border border-[#E8E2D8] px-4 py-2.5 rounded-xs shadow-xs self-start sm:self-auto">
          <Star className="w-5 h-5 fill-[#B79B63] text-[#B79B63]" />
          <div>
            <span className="text-xs font-bold text-[#1C1B19] block">{avgRating} / 5.0</span>
            <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
              {totalReviews} Total Submissions
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
            Approved Reviews
          </span>
          <p className="text-xl font-serif font-bold text-emerald-700 mt-1">{approvedCount}</p>
          <span className="text-[10px] text-stone-400">Live on storefront PDPs</span>
        </div>

        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
            Pending Audit
          </span>
          <p className="text-xl font-serif font-bold text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-[10px] text-stone-400">Requires moderation</span>
        </div>

        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
            Hidden / Spam
          </span>
          <p className="text-xl font-serif font-bold text-rose-600 mt-1">{hiddenCount}</p>
          <span className="text-[10px] text-stone-400">Filtered from customer view</span>
        </div>

        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
            Verified Patrons
          </span>
          <p className="text-xl font-serif font-bold text-[#1C1B19] mt-1">
            {reviews.filter((r) => r.verified).length}
          </p>
          <span className="text-[10px] text-stone-400">Order history confirmed</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron, title, product, comment..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none rounded-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | "approved" | "pending" | "hidden" | "spam")
            }
            className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 rounded-xs outline-none focus:border-[#B79B63] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved ({approvedCount})</option>
            <option value="pending">Pending ({pendingCount})</option>
            <option value="hidden">Hidden</option>
            <option value="spam">Spam</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) =>
              setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 rounded-xs outline-none focus:border-[#B79B63] cursor-pointer"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="p-3.5 pl-5">Patron</th>
                <th className="p-3.5">Ensemble / Product</th>
                <th className="p-3.5">Rating &amp; Fit</th>
                <th className="p-3.5">Headline &amp; Testimonial</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/60">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-stone-400">
                    No reviews match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#B79B63]/40 flex items-center justify-center font-serif text-xs font-semibold text-[#B79B63] shrink-0">
                          {rev.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1C1B19]">{rev.author}</p>
                          <p className="text-[10px] text-stone-400">{rev.city}</p>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-700 font-medium">
                              <ShieldCheck className="w-3 h-3" /> Verified Patron
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <p className="font-medium text-[#1C1B19] max-w-xs truncate">
                        {rev.productTitle}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono">ID: #{rev.productId}</p>
                    </td>

                    <td className="p-3.5">
                      <div className="flex text-[#B79B63] mb-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="px-1.5 py-0.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[9px] text-stone-600 rounded-2xs">
                        {rev.fit}
                      </span>
                    </td>

                    <td className="p-3.5 max-w-md">
                      <p className="font-semibold text-xs text-[#1C1B19]">{rev.title}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1">{rev.date}</p>
                    </td>

                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          rev.status === "approved"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : rev.status === "pending"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                      >
                        {rev.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== "approved" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(rev.id, "approved")}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-2xs transition-colors cursor-pointer"
                            title="Approve Review"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {rev.status !== "hidden" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(rev.id, "hidden")}
                            className="p-1.5 text-stone-500 hover:bg-stone-100 rounded-2xs transition-colors cursor-pointer"
                            title="Hide Review"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(rev.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xs transition-colors cursor-pointer"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
}
