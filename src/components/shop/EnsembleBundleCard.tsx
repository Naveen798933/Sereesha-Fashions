"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { getEnsembleForProduct, EnsembleBundle } from "@/lib/ensemble";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

interface EnsembleBundleCardProps {
  product: Product;
  selectedMainSize?: string;
}

export const EnsembleBundleCard: React.FC<EnsembleBundleCardProps> = ({
  product,
  selectedMainSize,
}) => {
  const { addToCart, setIsCartDrawerOpen } = useCartWishlist();

  const bundle: EnsembleBundle = React.useMemo(() => {
    return getEnsembleForProduct(product);
  }, [product]);

  // Selected components in the bundle (all 3 selected by default)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([
    bundle.components[0]?.id,
    bundle.components[1]?.id,
    bundle.components[2]?.id,
  ]);

  const [blouseSize, setBlouseSize] = React.useState<string>("38 (M)");
  const [isAdding, setIsAdding] = React.useState<boolean>(false);

  const toggleComponent = (id: string) => {
    // Keep at least the base saree selected
    if (id === bundle.components[0]?.id && selectedIds.includes(id)) {
      showToast.info("The base ensemble is the foundation of this curated look.");
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compute live bundle pricing
  const activeComponents = bundle.components.filter((c) => selectedIds.includes(c.id));
  const rawTotal = activeComponents.reduce((sum, c) => sum + c.price, 0);

  // Apply 10% bundle privilege if 2 or more items are selected
  const hasBundleDiscount = activeComponents.length >= 2;
  const savings = hasBundleDiscount
    ? Math.round((rawTotal * bundle.bundleDiscountPercent) / 100)
    : 0;
  const finalPrice = rawTotal - savings;

  const handleAddBundleToBag = () => {
    setIsAdding(true);

    try {
      // 1. Add base product
      if (selectedIds.includes(bundle.components[0].id)) {
        addToCart(
          product,
          selectedMainSize || product.sizes?.[0] || "Standard",
          hasBundleDiscount ? "Ensemble Look (10% Bundle Privilege Applied)" : undefined,
          1,
          { silent: true, openDrawer: false }
        );
      }

      // 2. Add blouse piece if selected
      const blouse = bundle.components[1];
      if (blouse && selectedIds.includes(blouse.id) && blouse.productRef) {
        addToCart(blouse.productRef, blouseSize, "Curated Ensemble Pairing", 1, {
          silent: true,
          openDrawer: false,
        });
      }

      // 3. Add dupatta/accessory if selected
      const accessory = bundle.components[2];
      if (accessory && selectedIds.includes(accessory.id) && accessory.productRef) {
        addToCart(accessory.productRef, "Free Size", "Curated Ensemble Pairing", 1, {
          silent: true,
          openDrawer: false,
        });
      }

      showToast.success(
        `Added Complete Ensemble (${activeComponents.length} pieces) with ${
          hasBundleDiscount
            ? `10% Privilege Savings of ${formatINR(savings)}!`
            : "Atelier Curation!"
        }`
      );

      setTimeout(() => {
        setIsCartDrawerOpen(true);
        setIsAdding(false);
      }, 300);
    } catch {
      showToast.error("Failed to add bundle to bag. Please try again.");
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white border-2 border-[#B79B63] p-5 sm:p-7 shadow-xs space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E2D8]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#B79B63]/10 text-[#B79B63] flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1C1B19]">
              Complete the Nizam Look
            </h3>
            <p className="text-[11px] text-[#8C867D]">
              Atelier Curated 3-Piece Ensemble • Save 10% when purchased as a set
            </p>
          </div>
        </div>

        {hasBundleDiscount && (
          <span className="self-start sm:self-auto px-2.5 py-1 bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-[#2D6A4F] text-[11px] uppercase tracking-wider font-semibold rounded-2xs">
            Save {formatINR(savings)} (10% Bundle Privilege)
          </span>
        )}
      </div>

      {/* 3 Coordinated Components Row */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
        {/* Component 1: Base Saree */}
        <div
          onClick={() => toggleComponent(bundle.components[0].id)}
          className={`md:col-span-3 p-3 border cursor-pointer transition-all rounded-xs ${
            selectedIds.includes(bundle.components[0].id)
              ? "border-[#B79B63] bg-[#FAF7F2]"
              : "border-[#E8E2D8] bg-white opacity-60"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-18 w-14 shrink-0 bg-[#EFE8DD] border border-[#E8E2D8] overflow-hidden">
              <Image
                src={bundle.components[0].image}
                alt={bundle.components[0].title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#B79B63] block">
                {bundle.components[0].role}
              </span>
              <p className="font-medium text-[#1C1B19] truncate leading-tight mt-0.5">
                {bundle.components[0].title}
              </p>
              <p className="text-xs font-semibold text-[#1C1B19] mt-1">
                {formatINR(bundle.components[0].price)}
              </p>
            </div>
          </div>
        </div>

        {/* Plus Symbol */}
        <div className="md:col-span-1 flex justify-center text-[#B79B63]">
          <Plus className="h-5 w-5" />
        </div>

        {/* Component 2: Coordinated Blouse */}
        <div
          className={`md:col-span-3 p-3 border transition-all rounded-xs ${
            selectedIds.includes(bundle.components[1]?.id)
              ? "border-[#B79B63] bg-[#FAF7F2]"
              : "border-[#E8E2D8] bg-white opacity-60"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              onClick={() => toggleComponent(bundle.components[1]?.id)}
              className="relative h-18 w-14 shrink-0 bg-[#EFE8DD] border border-[#E8E2D8] overflow-hidden cursor-pointer"
            >
              <Image
                src={bundle.components[1]?.image}
                alt={bundle.components[1]?.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 text-xs space-y-1">
              <div
                onClick={() => toggleComponent(bundle.components[1]?.id)}
                className="cursor-pointer"
              >
                <span className="text-[10px] uppercase font-bold text-[#B79B63] block">
                  {bundle.components[1]?.role}
                </span>
                <p className="font-medium text-[#1C1B19] truncate leading-tight mt-0.5">
                  {bundle.components[1]?.title}
                </p>
                <p className="text-xs font-semibold text-[#1C1B19]">
                  {formatINR(bundle.components[1]?.price)}
                </p>
              </div>

              {selectedIds.includes(bundle.components[1]?.id) && (
                <div className="pt-1">
                  <select
                    value={blouseSize}
                    onChange={(e) => setBlouseSize(e.target.value)}
                    className="w-full text-[10px] p-1 bg-white border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
                  >
                    {bundle.components[1]?.availableSizes?.map((sz) => (
                      <option key={sz} value={sz}>
                        Size: {sz}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plus Symbol */}
        <div className="md:col-span-1 flex justify-center text-[#B79B63]">
          <Plus className="h-5 w-5" />
        </div>

        {/* Component 3: Dupatta / Accessory */}
        <div
          onClick={() => toggleComponent(bundle.components[2]?.id)}
          className={`md:col-span-3 p-3 border cursor-pointer transition-all rounded-xs ${
            selectedIds.includes(bundle.components[2]?.id)
              ? "border-[#B79B63] bg-[#FAF7F2]"
              : "border-[#E8E2D8] bg-white opacity-60"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-18 w-14 shrink-0 bg-[#EFE8DD] border border-[#E8E2D8] overflow-hidden">
              <Image
                src={bundle.components[2]?.image}
                alt={bundle.components[2]?.title}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#B79B63] block">
                {bundle.components[2]?.role}
              </span>
              <p className="font-medium text-[#1C1B19] truncate leading-tight mt-0.5">
                {bundle.components[2]?.title}
              </p>
              <p className="text-xs font-semibold text-[#1C1B19] mt-1">
                {formatINR(bundle.components[2]?.price)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary & 1-Click Action Bar */}
      <div className="pt-4 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-baseline gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-wider text-[#8C867D]">
              Ensemble Bundle Total ({activeComponents.length} items):
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#1C1B19]">
                {formatINR(finalPrice)}
              </span>
              {hasBundleDiscount && (
                <span className="text-xs text-[#8C867D] line-through">{formatINR(rawTotal)}</span>
              )}
            </div>
          </div>

          {hasBundleDiscount && (
            <span className="text-xs text-[#2D6A4F] font-semibold">
              You Save {formatINR(savings)}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="gold"
          size="md"
          disabled={isAdding || activeComponents.length === 0}
          onClick={handleAddBundleToBag}
          className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span>Add Complete Look to Bag ({formatINR(finalPrice)})</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
