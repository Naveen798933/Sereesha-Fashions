export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-pulse">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[3/4] bg-stone-200/60 rounded-xs w-full" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-stone-200/50 rounded-xs" />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="h-3.5 w-32 bg-stone-200/80 rounded-xs" />
              <div className="h-7 w-5/6 bg-stone-200/70 rounded-xs" />
              <div className="h-6 w-36 bg-stone-200/90 rounded-xs pt-1" />
            </div>

            <div className="h-[1px] bg-[#E8E2D8]" />

            <div className="space-y-3">
              <div className="h-4 w-28 bg-stone-200/70 rounded-xs" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-14 bg-stone-200/60 rounded-xs" />
                ))}
              </div>
            </div>

            <div className="h-12 w-full bg-stone-200/80 rounded-xs" />
            <div className="h-28 w-full bg-stone-200/40 rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
