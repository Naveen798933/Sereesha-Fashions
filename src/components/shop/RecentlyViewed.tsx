"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { formatINR } from "@/lib/utils";

interface RecentlyViewedProps {
  currentProductId?: string;
}

export function trackRecentlyViewed(product: Product) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("sreesha_recently_viewed");
    let list: Product[] = raw ? JSON.parse(raw) : [];
    // Filter out duplicate
    list = list.filter((p) => p.id !== product.id);
    // Unshift to front
    list.unshift(product);
    // Keep max 8
    list = list.slice(0, 8);
    localStorage.setItem("sreesha_recently_viewed", JSON.stringify(list));
  } catch {
    // Ignore storage errors
  }
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [items, setItems] = React.useState<Product[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("sreesha_recently_viewed");
      if (raw) {
        const parsed: Product[] = JSON.parse(raw);
        setItems(parsed.filter((p) => p.id !== currentProductId).slice(0, 4));
      }
    } catch {
      // ignore
    }
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <section className="py-12 border-t border-[#E8E2D8]/60 bg-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#C5A880]" />
            <h2 className="font-serif text-lg sm:text-xl text-charcoal">Recently Viewed Pieces</h2>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-charcoal-muted">
            Atelier Memory
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/women/${item.category}/${item.slug}`}
              className="group bg-white border border-[#E8E2D8]/80 rounded-xs overflow-hidden hover:border-[#C5A880] transition-colors"
            >
              <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                <Image
                  src={item.primaryImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="p-3">
                <p className="text-[10px] uppercase tracking-wider text-[#C5A880] font-medium truncate">
                  {item.categoryLabel}
                </p>
                <h3 className="font-serif text-xs text-charcoal truncate mt-0.5 group-hover:text-[#B79B63] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-charcoal mt-1">{formatINR(item.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
