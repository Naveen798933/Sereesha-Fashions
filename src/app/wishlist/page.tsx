"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Share2,
  Sparkles,
  CheckCircle2,
  Crown,
  Copy,
  Check,
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { PRODUCTS, Product } from "@/data/products";
import { getCustomerProducts } from "@/lib/catalog";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { getPatronTier } from "@/lib/loyalty";
import { useAuth } from "@/context/AuthContext";

type TrousseauOccasion =
  "all" | "muhurtham" | "engagement" | "haldi_mehendi" | "reception" | "puja";

interface OccasionDef {
  id: TrousseauOccasion;
  label: string;
  emoji: string;
  ceremony: string;
}

const TROUSSEAU_OCCASIONS: OccasionDef[] = [
  { id: "all", label: "All Curated Pieces", emoji: "✨", ceremony: "Full Bridal Registry" },
  { id: "muhurtham", label: "Muhurtham", emoji: "💍", ceremony: "Main Wedding Silk" },
  { id: "engagement", label: "Engagement", emoji: "🪔", ceremony: "Nischithartham" },
  { id: "haldi_mehendi", label: "Haldi & Mehendi", emoji: "🌿", ceremony: "Vibrant Weave" },
  { id: "reception", label: "Reception Gala", emoji: "👑", ceremony: "Evening Splendor" },
  { id: "puja", label: "Puja & Voni", emoji: "🥻", ceremony: "Sacred Traditions" },
];

function WishlistContent() {
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const { wishlist, toggleWishlist, addToCart, setIsCartDrawerOpen, isHydrated } =
    useCartWishlist();

  // Read URL params for shared bridal registry
  const isSharedParam = searchParams.get("shared") === "1" || searchParams.get("shared") === "true";
  const sharedItemsParam = searchParams.get("items") || "";
  const sharedOwnerParam = searchParams.get("name") || "";
  const sharedOccasionsParam = searchParams.get("occasions") || "";

  const [catalogProducts, setCatalogProducts] = React.useState<Product[]>(() =>
    getCustomerProducts()
  );

  React.useEffect(() => {
    setCatalogProducts(getCustomerProducts());
  }, []);

  // Occasions map: productId -> TrousseauOccasion
  const [occasionsMap, setOccasionsMap] = React.useState<Record<string, TrousseauOccasion>>(() => {
    if (typeof window === "undefined") return {};
    try {
      if (sharedOccasionsParam) {
        const parsed = JSON.parse(decodeURIComponent(sharedOccasionsParam));
        if (typeof parsed === "object" && parsed !== null) return parsed;
      }
      const stored = localStorage.getItem("sreesha_wishlist_occasions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === "object" && parsed !== null) return parsed;
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [activeOccasionFilter, setActiveOccasionFilter] = React.useState<TrousseauOccasion>("all");
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Parse shared item IDs if present
  const sharedItemIds = React.useMemo(() => {
    if (!sharedItemsParam) return [];
    return sharedItemsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [sharedItemsParam]);

  // Determine active item IDs: if viewing a shared link, show shared items; otherwise show user's wishlist
  const activeProductIds = React.useMemo(() => {
    if (isSharedParam && sharedItemIds.length > 0) {
      return sharedItemIds;
    }
    return wishlist;
  }, [isSharedParam, sharedItemIds, wishlist]);

  const displayedProducts = React.useMemo(() => {
    return catalogProducts.filter((p) => activeProductIds.includes(p.id));
  }, [catalogProducts, activeProductIds]);

  // Filtered by selected occasion tab
  const filteredProducts = React.useMemo(() => {
    if (activeOccasionFilter === "all") return displayedProducts;
    return displayedProducts.filter((p) => occasionsMap[p.id] === activeOccasionFilter);
  }, [displayedProducts, activeOccasionFilter, occasionsMap]);

  // Trousseau valuation & unlocked privilege tier
  const trousseauTotal = React.useMemo(() => {
    return displayedProducts.reduce((acc, p) => acc + (p.price || 0), 0);
  }, [displayedProducts]);

  const unlockedTier = React.useMemo(() => {
    return getPatronTier(trousseauTotal);
  }, [trousseauTotal]);

  // Occasions count coverage
  const plannedOccasionsCount = React.useMemo(() => {
    const assigned = new Set(
      Object.entries(occasionsMap)
        .filter(([id, occ]) => displayedProducts.some((p) => p.id === id) && occ !== "all")
        .map(([, occ]) => occ)
    );
    return assigned.size;
  }, [occasionsMap, displayedProducts]);

  const handleSetOccasion = (productId: string, occ: TrousseauOccasion) => {
    const updated = { ...occasionsMap, [productId]: occ };
    setOccasionsMap(updated);
    try {
      localStorage.setItem("sreesha_wishlist_occasions", JSON.stringify(updated));
    } catch {}
    const occDef = TROUSSEAU_OCCASIONS.find((o) => o.id === occ);
    showToast.success(`Assigned to ${occDef?.emoji} ${occDef?.label}`);
  };

  const handleMoveAllToBag = () => {
    if (displayedProducts.length === 0) return;
    displayedProducts.forEach((product) => {
      addToCart(product, product.sizes?.[0] || "Standard", undefined, 1, {
        silent: true,
        openDrawer: false,
      });
    });
    showToast.success(`Moved ${displayedProducts.length} heirloom pieces to your shopping bag!`);
    setIsCartDrawerOpen(true);
  };

  const handleImportSharedToMyWishlist = () => {
    displayedProducts.forEach((p) => {
      if (!wishlist.includes(p.id)) {
        toggleWishlist(p.id);
      }
    });
    showToast.success(
      `Saved ${displayedProducts.length} bridal ensembles to your personal atelier wishlist!`
    );
  };

  const brideName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user ? "Atelier Patron" : "Sreesha Bride");

  const buildShareUrl = () => {
    if (typeof window === "undefined") return "";
    const ids = displayedProducts.map((p) => p.id).join(",");
    const occasionsParam = encodeURIComponent(JSON.stringify(occasionsMap));
    return `${window.location.origin}/wishlist?shared=1&name=${encodeURIComponent(
      brideName
    )}&items=${ids}&occasions=${occasionsParam}`;
  };

  const handleCopyRegistryLink = () => {
    const url = buildShareUrl();
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast.success("Bridal registry link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareOnWhatsApp = () => {
    if (typeof window === "undefined") return;

    // Group items by ceremony
    const groupedLines = displayedProducts.map((p) => {
      const occId = occasionsMap[p.id] || "all";
      const occDef = TROUSSEAU_OCCASIONS.find((o) => o.id === occId);
      const tag = occDef && occDef.id !== "all" ? `${occDef.emoji} ${occDef.label}: ` : "• ";
      return `${tag}${p.title} (${formatINR(p.price)})`;
    });

    const shareUrl = buildShareUrl();
    const message = `Namaste! 🙏\n\nExplore my curated Bridal Trousseau Registry from Sreesha Elegance, Hyderabad:\n\n${groupedLines.join(
      "\n"
    )}\n\n✨ Total Trousseau: ${formatINR(
      trousseauTotal
    )} (${unlockedTier.name} Privileges)\n\nView my interactive wedding lookbook online at:\n${shareUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28 sm:pb-16">
      {/* Shared Registry Alert Banner (when viewing someone else's shared trousseau) */}
      {isSharedParam && (
        <div className="bg-gradient-to-r from-[#1C1B19] via-[#2A2621] to-[#1C1B19] text-[#FAF7F2] border border-[#B79B63] p-5 sm:p-6 mb-8 rounded-xs shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#B79B63]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79B63] font-bold">
                Bridal Trousseau Registry
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-white">
              {sharedOwnerParam
                ? `${sharedOwnerParam}'s Wedding Trousseau Edit`
                : "Curated Bridal Trousseau Registry"}
            </h2>
            <p className="text-xs text-stone-300">
              Browse this bespoke handloom selection curated for Hyderabad wedding celebrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportSharedToMyWishlist}
              className="text-xs tracking-wider bg-transparent text-white border-white/40 hover:bg-white/10 cursor-pointer"
            >
              <Heart className="mr-1.5 h-3.5 w-3.5 text-[#B79B63]" />
              Save to My Wishlist
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleMoveAllToBag}
              className="text-xs uppercase tracking-wider bg-[#B79B63] hover:bg-[#A88C55] text-[#1C1B19] font-bold cursor-pointer"
            >
              <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
              Gift Entire Trousseau
            </Button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="border-b border-[#E8E2D8] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#B79B63] mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
              Bespoke Wedding Registry
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19]">
            {isSharedParam ? "Curated Bridal Registry" : "Your Trousseau & Wishlist"}
          </h1>
          <p className="text-xs text-[#5A5650] mt-1">
            {displayedProducts.length} heirloom piece{displayedProducts.length === 1 ? "" : "s"}{" "}
            curated for your wedding ceremonies and festive celebrations
          </p>
        </div>

        {/* Wishlist Actions */}
        {displayedProducts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyRegistryLink}
              className="text-xs tracking-wider cursor-pointer bg-white"
            >
              {copiedLink ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5 text-[#B79B63]" />
                  Copy Registry Link
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareOnWhatsApp}
              className="text-xs tracking-wider cursor-pointer bg-white text-[#2D6A4F] border-[#2D6A4F]/30 hover:bg-[#2D6A4F]/10"
            >
              <Share2 className="mr-1.5 h-3.5 w-3.5 text-[#2D6A4F]" />
              Share Registry on WhatsApp
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleMoveAllToBag}
              className="text-xs uppercase tracking-wider cursor-pointer bg-[#1C1B19] text-[#FAF7F2]"
            >
              <ShoppingBag className="mr-1.5 h-3.5 w-3.5 text-[#B79B63]" />
              Move All to Bag ({displayedProducts.length})
            </Button>
          </div>
        )}
      </div>

      {!isHydrated ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-3">
          <div className="w-10 h-10 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#8C867D] uppercase tracking-widest font-medium">
            Retrieving your bridal trousseau collection...
          </p>
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-16 text-center max-w-3xl mx-auto space-y-6">
          <div className="relative inline-block">
            <div className="h-20 w-20 border border-[#D8C7A5] bg-[#F7F3EB] flex items-center justify-center text-[#B79B63] mx-auto shadow-xs">
              <Heart className="h-9 w-9 stroke-[1.2]" />
            </div>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#B79B63] rounded-full flex items-center justify-center text-[10px] text-white">
              0
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold">
              Empty Wardrobe
            </span>
            <h2 className="font-serif text-3xl text-[#1C1B19] mt-1">No Items Saved Yet</h2>
          </div>

          <p className="text-sm text-[#5A5650] leading-relaxed max-w-md mx-auto">
            Tap the heart icon on any handloom saree, bridal lehenga, or bespoke kurti to save it
            here while curating your festive trousseau and assigning them to wedding ceremonies.
          </p>

          <div className="pt-2">
            <Button asChild variant="primary" size="lg" className="px-8 shadow-xs">
              <Link href="/women/sarees">
                Explore Handloom Sarees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Curated Recommendations */}
          <div className="mt-16 pt-12 border-t border-[#E8E2D8] text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79B63] font-semibold">
                  Handcrafted In Hyderabad
                </span>
                <h3 className="font-serif text-2xl text-[#1C1B19] mt-0.5">
                  Recommended For Your Trousseau
                </h3>
              </div>
              <Link
                href="/women/sarees"
                className="text-xs text-[#B79B63] hover:text-[#1C1B19] font-medium underline"
              >
                View Full Catalog
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {PRODUCTS.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E8E2D8] p-3 flex flex-col justify-between luxury-card group rounded-xs"
                >
                  <div className="relative aspect-[4/5] bg-[#EFE8DD] overflow-hidden mb-3">
                    <Image
                      src={product.primaryImage}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        toggleWishlist(product.id);
                        showToast.success(`Saved ${product.title} to wishlist`);
                      }}
                      className="absolute top-2 right-2 h-8 w-8 bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1C1B19] hover:text-[#9A3434] transition-colors border border-[#E8E2D8] cursor-pointer"
                      title="Save to Wishlist"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                      {product.categoryLabel}
                    </span>
                    <Link
                      href={`/women/${product.category}/${product.slug}`}
                      className="block text-xs font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-1 mt-0.5"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs font-semibold text-[#1C1B19] mt-1">
                      {formatINR(product.price)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addToCart(product, product.sizes[0]);
                      showToast.success(`Added ${product.title} to bag`);
                      setIsCartDrawerOpen(true);
                    }}
                    className="mt-3 w-full text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    <ShoppingBag className="h-3 w-3 mr-1 text-[#B79B63]" /> Move to Bag
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Trousseau Summary & Privilege Tier Card */}
          <div className="bg-white border border-[#E8E2D8] p-5 sm:p-6 rounded-xs shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#B79B63]" />
                <span className="text-[10px] uppercase tracking-widest text-[#B79B63] font-bold">
                  Trousseau Valuation &amp; Privilege
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl sm:text-3xl text-[#1C1B19] font-bold">
                  {formatINR(trousseauTotal)}
                </span>
                <span className="text-xs text-stone-500">
                  across {displayedProducts.length} ensemble
                  {displayedProducts.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="text-xs text-stone-600 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F7F3EB] text-[#8C6D28] border border-[#B79B63]/40 rounded-2xs font-semibold text-[10px] uppercase">
                  {unlockedTier.badge} Unlocked
                </span>
                <span>• Code {unlockedTier.couponCode} eligible on checkout</span>
              </p>
            </div>

            {/* Occasion Checklist Progress */}
            <div className="w-full lg:w-72 bg-[#FAF7F2] p-3.5 border border-[#E8E2D8] rounded-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-700 font-medium">Ceremonies Tagged:</span>
                <span className="font-bold text-[#1C1B19]">{plannedOccasionsCount} of 5</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B79B63] to-[#2D6A4F] transition-all"
                  style={{ width: `${Math.min(100, (plannedOccasionsCount / 5) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-500 block">
                Assign wedding ceremonies below to organize your trousseau itinerary.
              </span>
            </div>
          </div>

          {/* Occasion Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {TROUSSEAU_OCCASIONS.map((occ) => {
              const isSelected = activeOccasionFilter === occ.id;
              const count =
                occ.id === "all"
                  ? displayedProducts.length
                  : displayedProducts.filter((p) => occasionsMap[p.id] === occ.id).length;

              return (
                <button
                  key={occ.id}
                  type="button"
                  onClick={() => setActiveOccasionFilter(occ.id)}
                  className={`px-3 py-2 text-xs rounded-xs border transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19] shadow-xs"
                      : "bg-white text-stone-700 border-[#E8E2D8] hover:border-[#B79B63]"
                  }`}
                >
                  <span>{occ.emoji}</span>
                  <span className="font-semibold">{occ.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-2xs ${
                      isSelected ? "bg-[#B79B63] text-[#1C1B19]" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const currentOccasion = occasionsMap[product.id] || "all";
              const currentOccDef = TROUSSEAU_OCCASIONS.find((o) => o.id === currentOccasion);

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white border border-[#E8E2D8] luxury-card rounded-xs overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/5] bg-[#EFE8DD] overflow-hidden">
                    <Link
                      href={`/women/${product.category}/${product.slug}`}
                      className="block h-full w-full"
                    >
                      <Image
                        src={product.primaryImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>

                    {/* Occasion Badge if assigned */}
                    {currentOccDef && currentOccDef.id !== "all" && (
                      <span className="absolute top-3 left-3 z-10 bg-[#1C1B19] text-[#FAF7F2] text-[9px] uppercase tracking-wider px-2 py-0.5 font-medium shadow-2xs flex items-center gap-1">
                        <span>{currentOccDef.emoji}</span>
                        <span>{currentOccDef.label}</span>
                      </span>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleWishlist(product.id);
                        showToast.info(`Removed ${product.title} from trousseau`);
                      }}
                      className="absolute top-3 right-3 z-10 h-8 w-8 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#8C867D] hover:text-[#9A3434] hover:bg-white transition-colors border border-[#E8E2D8] cursor-pointer"
                      aria-label="Remove from trousseau"
                      title="Remove from trousseau"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    {/* Authenticity pill */}
                    <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#1C1B19] border border-[#E8E2D8] font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-[#2D6A4F]" />
                      Silk Mark Certified
                    </div>
                  </div>

                  {/* Information & Occasion Selector */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C867D] font-medium">
                        {product.categoryLabel}
                      </span>
                      <Link
                        href={`/women/${product.category}/${product.slug}`}
                        className="mt-1 block text-sm font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-1"
                      >
                        {product.title}
                      </Link>

                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-sm font-serif font-bold text-[#1C1B19]">
                          {formatINR(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-[#8C867D] line-through font-normal">
                            {formatINR(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Occasion Assignment Dropdown */}
                    <div className="space-y-1 pt-1 border-t border-[#E8E2D8]/60">
                      <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block">
                        Wedding Ceremony:
                      </label>
                      <select
                        value={currentOccasion}
                        onChange={(e) =>
                          handleSetOccasion(product.id, e.target.value as TrousseauOccasion)
                        }
                        className="w-full text-xs border border-stone-200 rounded-xs py-1 px-1.5 bg-[#FAF7F2] text-stone-800 focus:border-[#B79B63] outline-none cursor-pointer"
                      >
                        <option value="all">Unassigned Ceremony</option>
                        <option value="muhurtham">💍 Muhurtham (Bridal Silk)</option>
                        <option value="engagement">🪔 Engagement (Nischithartham)</option>
                        <option value="haldi_mehendi">🌿 Haldi &amp; Mehendi</option>
                        <option value="reception">👑 Reception Gala</option>
                        <option value="puja">🥻 Puja &amp; Post-Wedding</option>
                      </select>
                    </div>

                    {/* Move to Bag Action */}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        addToCart(product, product.sizes[0]);
                        showToast.success(`Added ${product.title} to bag`);
                        setIsCartDrawerOpen(true);
                      }}
                      className="w-full text-[10px] tracking-wider uppercase cursor-pointer py-2.5 bg-[#1C1B19] text-[#FAF7F2]"
                    >
                      <ShoppingBag className="mr-1.5 h-3.5 w-3.5 text-[#B79B63]" /> Move to Bag
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 max-w-7xl mx-auto">
      <div className="border-b border-[#E8E2D8] pb-6 mb-8">
        <div className="h-4 w-28 bg-stone-200 animate-pulse rounded mb-2" />
        <div className="h-8 w-64 bg-stone-200 animate-pulse rounded" />
      </div>
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-stone-500 uppercase tracking-wider">
          Loading Bridal Trousseau Registry...
        </p>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <React.Suspense fallback={<WishlistSkeleton />}>
      <WishlistContent />
    </React.Suspense>
  );
}
