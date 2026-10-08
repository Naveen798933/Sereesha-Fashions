import { Sparkles } from "lucide-react";

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-8 bg-[#C5A880]/30" />
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]/40 animate-pulse" />
            <div className="h-[1px] w-8 bg-[#C5A880]/30" />
          </div>
          <div className="h-8 w-64 bg-stone-200/70 rounded-xs mx-auto animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-stone-200/50 rounded-xs mx-auto animate-pulse" />
        </div>

        {/* Filter bar Skeleton */}
        <div className="h-12 w-full bg-white/80 border border-[#E8E2D8] rounded-xs mb-8 animate-pulse" />

        {/* Product Grid Skeleton (8 luxury cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#E8E2D8]/70 rounded-xs overflow-hidden animate-pulse"
            >
              <div className="aspect-[3/4] bg-stone-200/60 w-full" />
              <div className="p-3.5 space-y-2.5">
                <div className="h-3 w-20 bg-stone-200/80 rounded-xs" />
                <div className="h-4 w-full bg-stone-200/60 rounded-xs" />
                <div className="h-3.5 w-1/2 bg-stone-200/70 rounded-xs pt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
