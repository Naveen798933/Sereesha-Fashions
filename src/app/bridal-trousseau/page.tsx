"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Share2,
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
  Gift,
  Palette,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import {
  WEDDING_CEREMONIES,
  WeddingCeremony,
  calculateTrousseauPrivilege,
  getAvailableProductsForCeremony,
  getProductForCeremony,
} from "@/lib/trousseau";
import { Product } from "@/data/products";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

export default function BridalTrousseauPage() {
  const { addToCart, setIsCartDrawerOpen } = useCartWishlist();

  // Bride & Wedding details
  const [brideName, setBrideName] = React.useState<string>("Sreeja Reddy");
  const [weddingDate, setWeddingDate] = React.useState<string>("");
  const [weddingCity, setWeddingCity] = React.useState<string>("Hyderabad");

  // Selected products per ceremony: Map<ceremonyId, productId>
  const [selectedProductMap, setSelectedProductMap] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    WEDDING_CEREMONIES.forEach((c) => {
      initial[c.id] = c.suggestedProductIds[0];
    });
    return initial;
  });

  // Custom notes per ceremony: Map<ceremonyId, string>
  const [customNotesMap, setCustomNotesMap] = React.useState<Record<string, string>>({});

  // Active Ceremony Tab
  const [activeCeremonyId, setActiveCeremonyId] = React.useState<string>(WEDDING_CEREMONIES[0].id);

  // Modal for swapping ceremony saree/ensemble
  const [isSwapModalOpen, setIsSwapModalOpen] = React.useState<boolean>(false);
  const [modalCeremony, setModalCeremony] = React.useState<WeddingCeremony | null>(null);

  // Initialize date safely in useEffect for SSR/prerender compatibility
  React.useEffect(() => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 90);
    setWeddingDate(futureDate.toISOString().split("T")[0]);
  }, []);

  const activeCeremony: WeddingCeremony =
    WEDDING_CEREMONIES.find((c) => c.id === activeCeremonyId) || WEDDING_CEREMONIES[0];

  // Resolve currently selected products
  const selectedProductList: Product[] = React.useMemo(() => {
    const list: Product[] = [];
    Object.values(selectedProductMap).forEach((pid) => {
      const p = getProductForCeremony(pid);
      if (p) list.push(p);
    });
    return list;
  }, [selectedProductMap]);

  // Calculate privilege tier & total savings
  const privilege = React.useMemo(() => {
    return calculateTrousseauPrivilege(selectedProductList);
  }, [selectedProductList]);

  // Open Swap Modal
  const openSwapForCeremony = (ceremony: WeddingCeremony) => {
    setModalCeremony(ceremony);
    setIsSwapModalOpen(true);
  };

  // Select an item in swap modal
  const handleSelectProductForCeremony = (ceremonyId: string, productId: string) => {
    setSelectedProductMap((prev) => ({
      ...prev,
      [ceremonyId]: productId,
    }));
    setIsSwapModalOpen(false);
    showToast.success("Ceremony ensemble updated in your trousseau!");
  };

  // Handle Note Edit
  const handleNoteChange = (ceremonyId: string, text: string) => {
    setCustomNotesMap((prev) => ({
      ...prev,
      [ceremonyId]: text,
    }));
  };

  // Add all selected trousseau items to bag with privilege code
  const handleAddAllToBag = () => {
    if (selectedProductList.length === 0) return;

    selectedProductList.forEach((prod) => {
      addToCart(prod, prod.sizes[0] || "Free Size", "Atelier Bridal Trousseau", 1, {
        silent: true,
        openDrawer: false,
      });
    });

    setIsCartDrawerOpen(true);
    showToast.success(
      `Added ${selectedProductList.length} Bridal Trousseau ensembles to your shopping bag!`,
      privilege.couponCode
        ? `Use coupon ${privilege.couponCode} at checkout for ${privilege.discountPercentage}% privilege.`
        : undefined
    );
  };

  // Share moodboard with groom / bridal party on WhatsApp
  const handleShareWhatsApp = () => {
    const ceremonySummaries = WEDDING_CEREMONIES.map((c) => {
      const prodId = selectedProductMap[c.id];
      const prod = getProductForCeremony(prodId);
      const note = customNotesMap[c.id];
      return `✨ *${c.name}* (${c.timeOfDay})\n   • *Ensemble:* ${prod?.title || "Handloom Silk"}\n   • *Price:* ${prod ? formatINR(prod.price) : ""}${note ? `\n   • *Notes:* ${note}` : ""}`;
    }).join("\n\n");

    const message = encodeURIComponent(
      `👰 *${brideName}'s Royal Bridal Trousseau Moodboard*\n` +
        `📅 *Wedding Date:* ${weddingDate || "Upcoming"} | 📍 *City:* ${weddingCity}\n\n` +
        `Here is our curated ceremony palette & wardrobe from Sreesha Elegance Atelier:\n\n` +
        `${ceremonySummaries}\n\n` +
        `💎 *Trousseau Privilege:* ${privilege.privilegeTier} (${formatINR(privilege.finalTotal)} after ${formatINR(privilege.discountAmount)} saving)\n\n` +
        `Curated at Sreesha Elegance Kukatpally Flagship: https://sreeshaelegance.com/bridal-trousseau`
    );

    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1B19] pb-24 pt-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-[#B79B63]/20 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] py-16">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#B79B63_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B79B63]/10 border border-[#B79B63]/30 text-xs font-semibold tracking-wider text-[#B79B63] uppercase mb-4">
            <Sparkles className="w-4 h-4 text-[#B79B63]" />
            Atelier Bridal Trousseau Studio
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1B19] tracking-tight leading-tight max-w-3xl mx-auto">
            The Royal Wedding Wardrobe &amp; Ceremony Palette Curator
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#1C1B19]/70 max-w-2xl mx-auto leading-relaxed">
            Indian weddings are a sacred symphony of multiple celebrations. Design a harmonious,
            ceremony-by-ceremony wardrobe progression from morning Haldi to twilight Reception.
            Unlock up to 15% Grand Trousseau Privilege and personal atelier drape styling.
          </p>

          {/* Wedding & Bride Profile Customizer */}
          <div className="mt-8 bg-white p-4 sm:p-5 rounded-2xl border border-[#B79B63]/20 shadow-sm max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1B19]/60 mb-1">
                Bride&apos;s Name / Couple
              </label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="e.g. Sreeja & Harsha"
                className="w-full px-3 py-1.5 rounded-lg border border-[#B79B63]/30 bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B79B63]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1B19]/60 mb-1">
                Auspicious Wedding Date
              </label>
              <input
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[#B79B63]/30 bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B79B63]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1B19]/60 mb-1">
                Celebration City / Venue
              </label>
              <input
                type="text"
                value={weddingCity}
                onChange={(e) => setWeddingCity(e.target.value)}
                placeholder="e.g. Hyderabad / Taj Falaknuma"
                className="w-full px-3 py-1.5 rounded-lg border border-[#B79B63]/30 bg-[#FAF7F2] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#B79B63]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Studio Workstation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 space-y-12">
        {/* Ceremonial Progression Nav Tabs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest text-[#B79B63] font-bold">
              The Five Sacred Celebrations
            </span>
            <span className="text-xs text-[#1C1B19]/60">
              {selectedProductList.length} of 5 Ensembles Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {WEDDING_CEREMONIES.map((c) => {
              const isSelected = c.id === activeCeremonyId;
              const prodId = selectedProductMap[c.id];
              const prod = getProductForCeremony(prodId);

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCeremonyId(c.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? "bg-[#1C1B19] text-white border-[#1C1B19] shadow-lg shadow-black/10 scale-[1.02]"
                      : "bg-white text-[#1C1B19] border-[#B79B63]/20 hover:border-[#B79B63]/60 hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-[#B79B63] text-white" : "bg-[#B79B63]/10 text-[#B79B63]"
                      }`}
                    >
                      Ritual 0{c.order}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-wider ${
                        isSelected ? "text-white/60" : "text-[#1C1B19]/50"
                      }`}
                    >
                      {c.timeOfDay.split("/")[0]}
                    </span>
                  </div>

                  <h3 className="font-serif text-xs sm:text-sm font-semibold line-clamp-1 mt-1">
                    {c.name.split("&")[0]}
                  </h3>
                  <p
                    className={`text-[10px] mt-0.5 font-telugu line-clamp-1 ${
                      isSelected ? "text-[#FAF7F2]/80" : "text-[#B79B63]"
                    }`}
                  >
                    {c.teluguName}
                  </p>

                  {/* Micro image thumb preview */}
                  {prod && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className="truncate max-w-[85px] font-medium text-xs">
                        {formatINR(prod.price)}
                      </span>
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-[#B79B63]" : "text-[#2D6A4F]"
                        }`}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Active Ceremony Spotlight & Customizer */}
        <section className="bg-white rounded-2xl border border-[#B79B63]/30 shadow-md p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#FAF7F2] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#B79B63] font-bold">
                  Ritual 0{activeCeremony.order} &bull; {activeCeremony.timeOfDay}
                </span>
                <span className="text-xs text-[#1C1B19]/50">&bull;</span>
                <span className="text-xs font-telugu font-semibold text-[#1C1B19]/70">
                  {activeCeremony.teluguName}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] mt-1">
                {activeCeremony.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#1C1B19]/70 mt-1 max-w-2xl leading-relaxed">
                {activeCeremony.significance}
              </p>
            </div>

            {/* Change Saree Button */}
            <Button
              onClick={() => openSwapForCeremony(activeCeremony)}
              variant="outline"
              className="border-[#B79B63] text-[#B79B63] hover:bg-[#B79B63] hover:text-white shrink-0 self-start md:self-auto gap-1.5 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Swap Ceremony Ensemble
            </Button>
          </div>

          {/* Color Palette Swatches for this ritual */}
          <div className="py-5 border-b border-[#FAF7F2]">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-[#B79B63]" />
              <span className="text-xs uppercase font-bold tracking-wider text-[#1C1B19]/80">
                Auspicious Vedic Palette Harmony
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeCeremony.palette.map((swatch, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#B79B63]/20"
                >
                  <span
                    className="w-7 h-7 rounded-lg shadow-xs shrink-0 border border-black/10"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-[#1C1B19] block truncate">
                      {swatch.name}
                    </span>
                    <span className="text-[10px] text-[#1C1B19]/60 block truncate">
                      {swatch.meaning}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Ensemble Details Grid */}
          {(() => {
            const currentProd = getProductForCeremony(selectedProductMap[activeCeremony.id]);
            if (!currentProd) return null;

            return (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
                {/* Product Image Column */}
                <div className="md:col-span-4">
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#EFE8DD] border border-[#B79B63]/20 shadow-xs">
                    <Image
                      src={currentProd.primaryImage}
                      alt={currentProd.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                    <div className="absolute top-3 left-3 bg-[#1C1B19]/90 text-[#FAF7F2] text-[10px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider border border-white/20">
                      Ritual 0{activeCeremony.order} Choice
                    </div>
                  </div>
                </div>

                {/* Details & Styling Advice Column */}
                <div className="md:col-span-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#B79B63]">
                        {currentProd.categoryLabel} &bull; {currentProd.weave}
                      </span>
                      {currentProd.silkMarkCertified && (
                        <span className="text-[9px] bg-[#2D6A4F]/10 text-[#2D6A4F] px-1.5 py-0.5 rounded font-semibold uppercase">
                          Silk Mark Certified
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-[#1C1B19] font-semibold leading-snug">
                      {currentProd.title}
                    </h3>

                    <div className="flex items-baseline gap-3 mt-2">
                      <span className="font-serif text-2xl font-bold text-[#1C1B19]">
                        {formatINR(currentProd.price)}
                      </span>
                      {currentProd.originalPrice && (
                        <span className="text-xs text-[#1C1B19]/40 line-through">
                          {formatINR(currentProd.originalPrice)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#1C1B19]/70 mt-3 leading-relaxed">
                      {currentProd.shortDescription}
                    </p>

                    {/* Master Stylist Drape Recommendation */}
                    <div className="mt-5 p-4 rounded-xl bg-[#FAF7F2] border border-[#B79B63]/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B79B63] block mb-1">
                        Sreesha Master Stylist Drape Protocol
                      </span>
                      <p className="text-xs text-[#1C1B19]/80 leading-relaxed">
                        {activeCeremony.drapeStyle}
                      </p>
                    </div>

                    {/* Custom Stylist Notes */}
                    <div className="mt-4">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1B19]/70 mb-1.5">
                        Bride&apos;s Styling &amp; Jewelry Notes for this Ceremony
                      </label>
                      <input
                        type="text"
                        value={customNotesMap[activeCeremony.id] || ""}
                        onChange={(e) => handleNoteChange(activeCeremony.id, e.target.value)}
                        placeholder="e.g. Pair with heirloom diamond guttapusalu necklace & fresh jasmine floral veni..."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#B79B63]/30 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#B79B63]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#FAF7F2]">
                    <Link
                      href={`/women/${currentProd.category}/${currentProd.slug}`}
                      target="_blank"
                      className="text-xs font-semibold text-[#B79B63] hover:text-[#1C1B19] underline inline-flex items-center gap-1"
                    >
                      <span>View Full Atelier Saree Specifications</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* 5-Look Harmonious Moodboard Preview Canvas */}
        <section className="bg-white rounded-2xl border border-[#B79B63]/30 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#FAF7F2] gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B79B63] font-bold">
                Bridal Party Preview
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] mt-1">
                The {brideName} Royal Trousseau Moodboard
              </h2>
              <p className="text-xs text-[#1C1B19]/60 mt-1">
                A visual journey across colors, weaves, and auspicious ceremonies.
              </p>
            </div>

            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              className="border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 gap-1.5 text-xs self-start sm:self-auto"
            >
              <Share2 className="w-3.5 h-3.5 text-[#25D366]" />
              Share Moodboard via WhatsApp
            </Button>
          </div>

          {/* 5 Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            {WEDDING_CEREMONIES.map((c) => {
              const prod = getProductForCeremony(selectedProductMap[c.id]);
              if (!prod) return null;

              return (
                <div
                  key={c.id}
                  onClick={() => setActiveCeremonyId(c.id)}
                  className="group bg-[#FAF7F2] rounded-xl border border-[#B79B63]/20 overflow-hidden cursor-pointer hover:border-[#B79B63] transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] w-full bg-[#EFE8DD] overflow-hidden">
                    <Image
                      src={prod.primaryImage}
                      alt={prod.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 50vw, 20vw"
                    />
                    <div className="absolute top-2 left-2 bg-[#1C1B19]/80 text-[#FAF7F2] text-[9px] font-bold px-1.5 py-0.5 rounded">
                      0{c.order}. {c.name.split("&")[0]}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] uppercase tracking-wider text-[#B79B63] font-semibold">
                      {prod.weave}
                    </p>
                    <p className="font-serif text-xs font-semibold text-[#1C1B19] line-clamp-1 mt-0.5">
                      {prod.title}
                    </p>
                    <p className="text-xs font-bold text-[#1C1B19] mt-1">{formatINR(prod.price)}</p>
                    {customNotesMap[c.id] && (
                      <p className="text-[10px] text-[#1C1B19]/70 italic mt-1 line-clamp-1 border-t border-[#B79B63]/10 pt-1">
                        &ldquo;{customNotesMap[c.id]}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trousseau Privilege & Order Summary Checkout Bar */}
        <section className="bg-[#1C1B19] text-[#FAF7F2] rounded-2xl p-6 sm:p-10 shadow-xl border border-[#B79B63]/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Privilege Tier & Perks */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B79B63]/20 border border-[#B79B63]/40 text-xs font-semibold tracking-wider text-[#B79B63] uppercase">
                <Gift className="w-3.5 h-3.5" />
                {privilege.privilegeTier}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-white">
                Complete Your Royal Wedding Trousseau
              </h2>

              <p className="text-xs sm:text-sm text-[#FAF7F2]/70 leading-relaxed max-w-xl">
                By curating your wedding journey together at Sreesha Elegance, unlock exclusive
                trousseau privileges, bespoke blouse master-tailoring, and bridal day support.
              </p>

              {/* Perks List */}
              <div className="pt-2 space-y-2">
                {privilege.complimentaryGifts.map((gift, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#FAF7F2]/90">
                    <CheckCircle2 className="w-4 h-4 text-[#B79B63] shrink-0" />
                    <span>{gift}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Pricing & Action */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-[#FAF7F2]/70">
                  <span>Curated Pieces ({privilege.ceremoniesCount} Ensembles)</span>
                  <span className="font-medium text-white">{formatINR(privilege.subtotal)}</span>
                </div>

                {privilege.discountPercentage > 0 && (
                  <div className="flex justify-between text-xs text-[#2D6A4F] font-semibold">
                    <span>
                      Trousseau Privilege ({privilege.discountPercentage}% &bull;{" "}
                      {privilege.couponCode})
                    </span>
                    <span>-{formatINR(privilege.discountAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-white/60 block">
                      Trousseau Investment
                    </span>
                    <span className="text-[10px] text-[#B79B63]">
                      Inclusive of all taxes &amp; insurance
                    </span>
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {formatINR(privilege.finalTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Button
                  onClick={handleAddAllToBag}
                  className="w-full bg-[#B79B63] hover:bg-white hover:text-[#1C1B19] text-[#1C1B19] font-medium py-3 text-xs tracking-wider uppercase rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add All {privilege.ceremoniesCount} Looks to Bag
                </Button>

                <div className="flex gap-2">
                  <Link href="/appointments" className="w-1/2">
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 text-[11px] py-2 rounded-xl"
                    >
                      Book Flagship Trial
                    </Button>
                  </Link>
                  <Button
                    onClick={handleShareWhatsApp}
                    variant="outline"
                    className="w-1/2 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-[11px] py-2 rounded-xl"
                  >
                    Share with Family
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Ensemble Swap Modal */}
      {isSwapModalOpen && modalCeremony && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-[#B79B63]/30">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#FAF7F2] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#B79B63]">
                  Select Ensemble for Ritual 0{modalCeremony.order}
                </span>
                <h3 className="font-serif text-lg sm:text-xl text-[#1C1B19]">
                  {modalCeremony.name}
                </h3>
              </div>
              <button
                onClick={() => setIsSwapModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF7F2] text-[#1C1B19]/60 hover:text-[#1C1B19]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Product Grid */}
            <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
              {getAvailableProductsForCeremony(modalCeremony).map((prod) => {
                const isCurrent = selectedProductMap[modalCeremony.id] === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProductForCeremony(modalCeremony.id, prod.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isCurrent
                        ? "border-[#B79B63] bg-[#FAF7F2] ring-2 ring-[#B79B63]"
                        : "border-[#B79B63]/20 hover:border-[#B79B63] bg-white"
                    }`}
                  >
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#EFE8DD] mb-2.5">
                      <Image
                        src={prod.primaryImage}
                        alt={prod.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 200px"
                      />
                      {isCurrent && (
                        <div className="absolute top-2 right-2 bg-[#2D6A4F] text-white p-1 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#B79B63] block">
                      {prod.weave}
                    </span>
                    <h4 className="font-serif text-xs font-semibold text-[#1C1B19] line-clamp-1 mt-0.5">
                      {prod.title}
                    </h4>
                    <span className="font-serif text-xs font-bold text-[#1C1B19] mt-1 block">
                      {formatINR(prod.price)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#FAF7F2] bg-[#FAF7F2] flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsSwapModalOpen(false)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
