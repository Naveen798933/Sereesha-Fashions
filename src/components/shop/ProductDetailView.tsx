"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Scissors,
  RotateCcw,
  Phone,
  ArrowRight,
  Check,
} from "lucide-react";
import { Product, PRODUCTS } from "@/data/products";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setIsCartDrawerOpen } = useCartWishlist();

  const [activeImage, setActiveImage] = React.useState(product.primaryImage);
  const [selectedSize, setSelectedSize] = React.useState(product.sizes[0] || "Standard");
  const [selectedBlouse, setSelectedBlouse] = React.useState(
    "Unstitched Matching Blouse (Included)"
  );
  const [quantity, setQuantity] = React.useState(1);

  const wishlisted = isInWishlist(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const blouseOptions = [
    { label: "Unstitched Matching Blouse", extra: 0, desc: "0.8m pure silk fabric included" },
    {
      label: "Bespoke Custom Tailored",
      extra: 2500,
      desc: "Tailored to your measurements by master craftsmen",
    },
    {
      label: "Readymade Padded Blouse",
      extra: 1800,
      desc: "Pre-stitched with premium cups and inner lining",
    },
  ];

  const handleInstantBuy = () => {
    addToCart(product, selectedSize, selectedBlouse, quantity);
    setIsCartDrawerOpen(true);
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 3);

  const whatsAppInquiryUrl = `https://wa.me/919876543210?text=Hello%20Sreesha%20Elegance%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.title)}%20(SKU%3A%20${product.id}%2C%20${formatINR(product.price)}).%20Can%20you%20help%20me%20with%20customization%20and%20video%20call%20preview%3F`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-6 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32 sm:pb-12">
      {/* Breadcrumb Trail */}
      <div className="mb-4 sm:mb-6">
        <Breadcrumb
          items={[
            { label: "Women", href: "/women/sarees" },
            { label: product.categoryLabel, href: `/women/${product.category}` },
            { label: product.title },
          ]}
        />
      </div>

      {/* Main Grid: Gallery on Left, Purchase Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 bg-white border border-[#E8E2D8] p-4 sm:p-10 shadow-xs">
        {/* Left: Gallery Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8]">
            <Image
              src={activeImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-center transition-all duration-500"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
              {product.badge === "NEW" && <Badge variant="gold">NEW</Badge>}
              {product.badge === "BESTSELLER" && <Badge variant="default">BESTSELLER</Badge>}
              {product.badge === "LIMITED" && <Badge variant="goldSolid">LIMITED</Badge>}
              {discountPercent && <Badge variant="sale">-{discountPercent}%</Badge>}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 h-9 w-9 sm:h-10 sm:w-10 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#1C1B19] hover:text-[#9A3434] transition-colors border border-[#E8E2D8] shadow-xs cursor-pointer"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 transition-colors",
                  wishlisted ? "fill-[#9A3434] text-[#9A3434]" : "text-[#1C1B19]"
                )}
              />
            </button>
          </div>

          {/* Mobile Dot Indicators */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 pt-1">
            {product.galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={cn(
                  "h-1.5 rounded-full transition-all cursor-pointer",
                  activeImage === img ? "w-6 bg-[#B79B63]" : "w-1.5 bg-[#D8C7A5]"
                )}
                aria-label={`View photo ${idx + 1}`}
              />
            ))}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {product.galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={cn(
                  "relative h-16 w-14 sm:h-20 sm:w-16 shrink-0 overflow-hidden border cursor-pointer transition-all",
                  activeImage === img
                    ? "border-[#B79B63] ring-1 ring-[#B79B63]"
                    : "border-[#E8E2D8] opacity-70 hover:opacity-100"
                )}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover object-center" />
              </button>
            ))}
          </div>

          {/* Assurance strip under gallery */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-[#E8E2D8] text-center text-xs text-[#5A5650]">
            <div className="p-2.5 sm:p-3 bg-[#FAF7F2] border border-[#E8E2D8] space-y-1">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#B79B63] mx-auto" />
              <p className="font-medium text-[#1C1B19] text-[11px] sm:text-xs">
                Silk Mark Certified
              </p>
              <p className="text-[9px] sm:text-[10px]">Pure Mulberry Silk</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-[#FAF7F2] border border-[#E8E2D8] space-y-1">
              <Scissors className="h-4 w-4 sm:h-5 sm:w-5 text-[#B79B63] mx-auto" />
              <p className="font-medium text-[#1C1B19] text-[11px] sm:text-xs">
                Bespoke Atelier Fit
              </p>
              <p className="text-[9px] sm:text-[10px]">Master Craftsmen</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-[#FAF7F2] border border-[#E8E2D8] space-y-1">
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-[#B79B63] mx-auto" />
              <p className="font-medium text-[#1C1B19] text-[11px] sm:text-xs">7-Day Exchanges</p>
              <p className="text-[9px] sm:text-[10px]">Doorstep Pickup</p>
            </div>
          </div>
        </div>

        {/* Right: Product Buy Box (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category and Collection tag */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#B79B63] font-medium">
                {product.categoryLabel}
              </span>
              {product.collection && (
                <>
                  <span className="text-[#D8C7A5]">•</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C867D]">
                    {product.collection}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-3xl font-serif text-[#1C1B19] font-normal tracking-wide leading-snug">
              {product.title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3">
              <Rating value={product.rating} count={product.reviewCount} size="md" />
              <span className="text-xs text-[#2D6A4F] font-medium flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> In Stock &amp; Ready to Ship
              </span>
            </div>

            {/* Price Box */}
            <div className="p-3.5 sm:p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-serif text-[#1C1B19] font-semibold">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs sm:text-sm text-[#8C867D] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-[11px] font-semibold text-[#9A3434] bg-[#F7EBEB] px-2 py-0.5">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#8C867D]">
                Price inclusive of all taxes. Free express shipping across India on this ensemble.
              </p>
            </div>

            {/* Short description */}
            <p className="text-xs text-[#5A5650] leading-relaxed">{product.shortDescription}</p>

            {/* Size / Option Selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-2 pt-1 sm:pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="uppercase tracking-wider font-medium text-[#1C1B19]">
                    Select Size / Option:
                  </span>
                  <Link href="/size-guide" className="text-[#B79B63] hover:underline text-[11px]">
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={cn(
                        "px-3 py-1.5 text-xs transition-colors cursor-pointer border",
                        selectedSize === sz
                          ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                          : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                      )}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Blouse Stitching Options for Sarees */}
            {product.category === "sarees" && (
              <div className="space-y-2 pt-1 sm:pt-2">
                <span className="block text-xs uppercase tracking-wider font-medium text-[#1C1B19]">
                  Atelier Blouse Customization:
                </span>
                <div className="space-y-2">
                  {blouseOptions.map((opt) => (
                    <label
                      key={opt.label}
                      className={cn(
                        "flex items-start gap-3 p-2.5 sm:p-3 border cursor-pointer transition-colors text-xs",
                        selectedBlouse === opt.label
                          ? "border-[#B79B63] bg-[#F7F3EB]/40"
                          : "border-[#E8E2D8] bg-white hover:border-[#D8C7A5]"
                      )}
                    >
                      <input
                        type="radio"
                        name="blouse"
                        value={opt.label}
                        checked={selectedBlouse === opt.label}
                        onChange={() => setSelectedBlouse(opt.label)}
                        className="mt-0.5 accent-[#B79B63]"
                      />
                      <div className="flex-1 flex justify-between">
                        <div>
                          <p className="font-medium text-[#1C1B19]">{opt.label}</p>
                          <p className="text-[10px] text-[#8C867D]">{opt.desc}</p>
                        </div>
                        <span className="font-semibold text-[#1C1B19]">
                          {opt.extra === 0 ? "FREE" : `+${formatINR(opt.extra)}`}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Buttons (Desktop & Tablet) */}
            <div className="pt-2 sm:pt-4 space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider text-[#8C867D]">Quantity:</span>
                <QuantityStepper
                  value={quantity}
                  min={1}
                  max={5}
                  onChange={setQuantity}
                  size="md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => addToCart(product, selectedSize, selectedBlouse, quantity)}
                  className="w-full"
                >
                  <ShoppingBag className="mr-2 h-4 w-4 text-[#B79B63]" />
                  Add to Bag
                </Button>
                <Button variant="gold" size="lg" onClick={handleInstantBuy} className="w-full">
                  Instant Buy <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* WhatsApp direct consultation button */}
              <a
                href={whatsAppInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" /> Book Video Call Preview on WhatsApp
              </a>
            </div>
          </div>

          {/* Accordion Specifications */}
          <div className="pt-6 border-t border-[#E8E2D8]">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="fabric-craft">
                <AccordionTrigger className="text-xs uppercase tracking-wider font-medium text-[#1C1B19]">
                  Fabric, Weave &amp; Origin
                </AccordionTrigger>
                <AccordionContent className="text-xs text-[#5A5650] space-y-2">
                  <p>
                    <strong className="text-[#1C1B19]">Fabric Composition:</strong> {product.fabric}
                  </p>
                  <p>
                    <strong className="text-[#1C1B19]">Weaving Technique:</strong> {product.weave}
                  </p>
                  <p>
                    <strong className="text-[#1C1B19]">Zari Purity:</strong>{" "}
                    {product.details.zariType}
                  </p>
                  <p>
                    <strong className="text-[#1C1B19]">Geographic Origin:</strong>{" "}
                    {product.details.origin}
                  </p>
                  {product.details.sareeLength && (
                    <p>
                      <strong className="text-[#1C1B19]">Dimensions:</strong>{" "}
                      {product.details.sareeLength} saree + {product.details.blouseLength}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="care">
                <AccordionTrigger className="text-xs uppercase tracking-wider font-medium text-[#1C1B19]">
                  Care Instructions
                </AccordionTrigger>
                <AccordionContent className="text-xs text-[#5A5650] space-y-1.5">
                  <p>{product.details.washCare}</p>
                  <p>Never spray perfumes directly on pure zari borders.</p>
                  <p>Change folds every 4-6 months to preserve handloom crease integrity.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="dispatch">
                <AccordionTrigger className="text-xs uppercase tracking-wider font-medium text-[#1C1B19]">
                  Dispatch &amp; Delivery Timeline
                </AccordionTrigger>
                <AccordionContent className="text-xs text-[#5A5650] space-y-1.5">
                  <p>{product.details.dispatchTime}</p>
                  <p>Complimentary insurance covers transit until signature at doorstep.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related Pieces */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-medium mb-1">
              Complete Your Trousseau
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] font-normal">
              You May Also Admire
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/women/${item.category}/${item.slug}`}
                className="group p-3 sm:p-4 bg-white border border-[#E8E2D8] hover:border-[#B79B63] transition-colors"
              >
                <div className="relative aspect-[4/5] bg-[#EFE8DD] overflow-hidden mb-2.5 sm:mb-3">
                  <Image
                    src={item.primaryImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8C867D]">
                  {item.categoryLabel}
                </p>
                <p className="text-xs font-medium text-[#1C1B19] group-hover:text-[#B79B63] line-clamp-1 mt-0.5">
                  {item.title}
                </p>
                <p className="text-xs font-semibold text-[#1C1B19] mt-1">{formatINR(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Action Bar (Fixed on Mobile Viewports) */}
      <aside
        aria-label="Mobile Product Actions"
        data-testid="pdp-sticky-bar"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E8E2D8] p-3 px-4 shadow-[0_-4px_20px_rgba(28,27,25,0.12)] flex items-center justify-between gap-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
      >
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">Total Price</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-serif font-bold text-[#1C1B19]">
              {formatINR(product.price)}
            </span>
            {discountPercent && (
              <span className="text-[9px] font-semibold text-[#9A3434] bg-[#F7EBEB] px-1.5 py-0.2">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick WhatsApp Concierge Button */}
          <a
            href={whatsAppInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 flex items-center justify-center bg-[#25D366]/15 text-[#128C7E] border border-[#25D366]/30 active:scale-95 transition-transform shrink-0"
            aria-label="Ask Stylist on WhatsApp"
          >
            <Phone className="h-4 w-4" />
          </a>

          {/* Add to Bag Button */}
          <Button
            variant="primary"
            size="md"
            onClick={() => addToCart(product, selectedSize, selectedBlouse, quantity)}
            className="h-10 px-4 text-xs tracking-wider"
          >
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5 text-[#B79B63]" />
            Add to Bag
          </Button>
        </div>
      </aside>
    </div>
  );
};
