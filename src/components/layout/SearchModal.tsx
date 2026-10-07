"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";
import { formatINR } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClose = React.useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const results: Product[] = query.trim()
    ? PRODUCTS.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.occasion.toLowerCase().includes(q)
        );
      })
    : [];

  const suggestedQueries = ["Kanchipuram Silk", "Bridal Lehenga", "Banarasi", "Anarkali", "Velvet"];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-24 px-3 sm:px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1B19]/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] border border-[#E8E2D8] shadow-2xl overflow-hidden z-10 rounded-sm"
        style={{ animation: "scaleUp 0.2s ease-out forwards" }}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-6 bg-white border-b border-[#E8E2D8] flex items-center gap-3">
          <Search className="h-5 w-5 text-[#B79B63] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pure silk sarees, bridal lehengas..."
            className="w-full text-base bg-transparent text-[#1C1B19] placeholder:text-[#8C867D] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1.5 text-[#8C867D] hover:text-[#1C1B19] cursor-pointer"
              aria-label="Clear query"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="text-xs uppercase tracking-wider text-[#8C867D] hover:text-[#1C1B19] px-2.5 py-1 border border-[#E8E2D8] cursor-pointer shrink-0"
            aria-label="Close search"
          >
            <span className="sm:hidden">Close</span>
            <span className="hidden sm:inline">ESC</span>
          </button>
        </div>

        {/* Suggestions / Results */}
        <div className="max-h-[75vh] sm:max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          {!query.trim() ? (
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C867D] font-medium flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#B79B63]" /> Popular Boutique Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 bg-white border border-[#E8E2D8] text-xs text-[#1C1B19] hover:border-[#B79B63] hover:text-[#B79B63] transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E8E2D8] space-y-2">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C867D] font-medium">
                  Curated Categories
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/women/sarees"
                    onClick={handleClose}
                    className="p-2.5 bg-white border border-[#E8E2D8] hover:text-[#B79B63] flex items-center justify-between"
                  >
                    <span>Handloom Silk Sarees</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/women/lehengas"
                    onClick={handleClose}
                    className="p-2.5 bg-white border border-[#E8E2D8] hover:text-[#B79B63] flex items-center justify-between"
                  >
                    <span>Bridal &amp; Festive Lehengas</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="font-serif text-xl text-[#1C1B19]">
                No matches for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#5A5650] max-w-sm mx-auto">
                Try searching for &quot;Silk&quot;, &quot;Zari&quot;, &quot;Banarasi&quot;, or
                WhatsApp our atelier concierge directly for custom orders.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C867D] font-medium">
                Found {results.length} Pieces
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/women/${product.category}/${product.slug}`}
                    onClick={handleClose}
                    className="flex gap-3 p-2 bg-white border border-[#E8E2D8] hover:border-[#B79B63] transition-colors group"
                  >
                    <div className="relative h-20 w-16 shrink-0 bg-[#EFE8DD] overflow-hidden">
                      <Image
                        src={product.primaryImage}
                        alt={product.title}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#8C867D]">
                          {product.categoryLabel}
                        </p>
                        <p className="text-xs font-medium text-[#1C1B19] group-hover:text-[#B79B63] line-clamp-1">
                          {product.title}
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-[#1C1B19]">
                        {formatINR(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};
