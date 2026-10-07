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
  Truck,
  MapPin,
  Share2,
  ZoomIn,
  Sparkles,
  Info,
  Star,
  ThumbsUp,
  X,
  Ruler,
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
import { showToast } from "@/components/ui/Toast";

interface UserReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  fit: string;
  verified: boolean;
}

const INITIAL_REVIEWS: UserReview[] = [
  {
    id: "rev-1",
    author: "Lakshmi Prasanna",
    city: "Banjara Hills, Hyderabad",
    rating: 5,
    date: "02 October 2026",
    title: "Mesmerizing Zari Luster & Pure Silk Authenticity",
    comment:
      "Wore this to my sister's wedding in Hyderabad. The drape is so rich and the gold zari border has that authentic heavy sheen that looks breathtaking under chandeliers. Received non-stop compliments!",
    fit: "Bespoke Master Fit",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Gayatri Krishnan",
    city: "Indiranagar, Bengaluru",
    rating: 5,
    date: "28 September 2026",
    title: "Silk Mark tag verified, flawless fall & pico finish",
    comment:
      "Arrived in 2 days to Bengaluru in the gold-stamped luxury hardbox. Checked the Silk Mark QR code immediately—100% genuine mulberry silk. The masterji custom blouse fits like a dream.",
    fit: "True to Size",
    verified: true,
  },
  {
    id: "rev-3",
    author: "Swathi Rao",
    city: "Colaba, Mumbai",
    rating: 5,
    date: "14 September 2026",
    title: "Heirloom grade bridal quality",
    comment:
      "I was skeptical about buying bridal silk online, but the WhatsApp video preview session gave me complete confidence. The actual saree is even more opulent in hand than photos depict.",
    fit: "Bespoke Master Fit",
    verified: true,
  },
];

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

  // In-Page Size Guide Modal State
  const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState(false);

  // Customer Reviews State
  const [reviews, setReviews] = React.useState<UserReview[]>(INITIAL_REVIEWS);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = React.useState(false);
  const [newReview, setNewReview] = React.useState({
    author: "",
    city: "",
    rating: 5,
    title: "",
    comment: "",
    fit: "Bespoke Master Fit",
  });

  // Zari Texture Zoom State
  const [isZooming, setIsZooming] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 50, y: 50 });

  // Indian PIN Code Estimator State
  const [pincode, setPincode] = React.useState("");
  const [pincodeStatus, setPincodeStatus] = React.useState<{
    type: "success" | "error";
    message: string;
    badge?: string;
  } | null>(null);

  // Bespoke Blouse Styling Visualizer State
  const [neckline, setNeckline] = React.useState("Regal Sweetheart");
  const [sleeveStyle, setSleeveStyle] = React.useState("Elbow-Length with Zari Border");
  const [backStyle, setBackStyle] = React.useState("Dori with Handmade Silk Latkans");

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pincode.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      setPincodeStatus({
        type: "error",
        message: "Please enter a valid 6-digit Indian postal code.",
      });
      return;
    }

    const prefix3 = cleaned.slice(0, 3);
    const prefix2 = cleaned.slice(0, 2);

    if (prefix3 === "500" || prefix3 === "501" || prefix3 === "502") {
      setPincodeStatus({
        type: "success",
        badge: "Hyderabad Atelier Express",
        message: "Delivers Tomorrow (Same-Day / Next-Day Dispatch from Kukatpally Atelier)",
      });
    } else if (["560", "600", "682", "530"].includes(prefix3)) {
      setPincodeStatus({
        type: "success",
        badge: "South Metro Express",
        message: "Delivers in 2 Days via BlueDart Air • Free Insured Delivery",
      });
    } else if (
      ["110", "400", "700", "380", "411"].includes(prefix3) ||
      ["11", "40"].includes(prefix2)
    ) {
      setPincodeStatus({
        type: "success",
        badge: "Tier-1 Metro Air",
        message: "Delivers in 2-3 Days via BlueDart Air • Free Insured Delivery",
      });
    } else {
      setPincodeStatus({
        type: "success",
        badge: "Pan-India Priority",
        message: "Delivers in 3-5 Business Days across India • Free Insured Delivery",
      });
    }
  };

  const handleShareWithFamily = async () => {
    const shareText = `Admiring this exquisite handloom ensemble from Sreesha Elegance:\n\n${product.title} - ${formatINR(product.price)}\n\nWhat do you think?`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled share dialog
      }
    }

    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author.trim() || !newReview.comment.trim()) {
      showToast.error("Please provide your name and review thoughts");
      return;
    }

    const reviewToAdd: UserReview = {
      id: `rev-${Date.now()}`,
      author: newReview.author.trim(),
      city: newReview.city.trim() || "Hyderabad",
      rating: newReview.rating,
      date: "Today",
      title: newReview.title.trim() || "Exquisite Handloom Craftsmanship",
      comment: newReview.comment.trim(),
      fit: newReview.fit,
      verified: true,
    };

    setReviews([reviewToAdd, ...reviews]);
    setIsWriteReviewOpen(false);
    setNewReview({
      author: "",
      city: "",
      rating: 5,
      title: "",
      comment: "",
      fit: "Bespoke Master Fit",
    });
    showToast.success("Thank you! Your verified patron review has been recorded.");
  };

  const handleInstantBuy = () => {
    const customSummary =
      selectedBlouse === "Bespoke Custom Tailored"
        ? `${selectedBlouse} (${neckline}, ${sleeveStyle}, ${backStyle})`
        : selectedBlouse;
    addToCart(product, selectedSize, customSummary, quantity);
    setIsCartDrawerOpen(true);
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 3);

  const whatsAppInquiryUrl = `https://wa.me/916281344628?text=Hello%20Sreesha%20Elegance%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.title)}%20(SKU%3A%20${product.id}%2C%20${formatINR(product.price)}).%20Can%20you%20help%20me%20with%20customization%20and%20video%20call%20preview%3F`;

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
          {/* Main Large Image with Zari Magnifier */}
          <div
            className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8] select-none group"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <div
              className="relative w-full h-full transition-transform duration-200 ease-out"
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZooming ? "scale(2.2)" : "scale(1)",
              }}
            >
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center pointer-events-none"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
              {product.badge === "NEW" && <Badge variant="gold">NEW</Badge>}
              {product.badge === "BESTSELLER" && <Badge variant="default">BESTSELLER</Badge>}
              {product.badge === "LIMITED" && <Badge variant="goldSolid">LIMITED</Badge>}
              {discountPercent && <Badge variant="sale">-{discountPercent}%</Badge>}
            </div>

            {/* Quick Actions (Share & Wishlist) */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareWithFamily}
                className="h-9 w-9 sm:h-10 sm:w-10 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#1C1B19] hover:text-[#25D366] transition-colors border border-[#E8E2D8] shadow-xs cursor-pointer"
                title="Share ensemble with family on WhatsApp"
                aria-label="Share ensemble with family"
              >
                <Share2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="h-9 w-9 sm:h-10 sm:w-10 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#1C1B19] hover:text-[#9A3434] transition-colors border border-[#E8E2D8] shadow-xs cursor-pointer"
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

            {/* Zari Zoom Guide Indicator */}
            <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-white/95 backdrop-blur-xs px-2.5 py-1 border border-[#E8E2D8] flex items-center gap-1.5 text-[10px] text-[#5A5650] uppercase tracking-wider font-medium shadow-2xs">
              <ZoomIn className="h-3 w-3 text-[#B79B63]" />
              <span>
                {isZooming ? "Magnifying 2.2x Zari Weave" : "Hover to Inspect Zari Weave"}
              </span>
            </div>
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
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[#B79B63] hover:underline text-[11px] cursor-pointer flex items-center gap-1"
                  >
                    <Ruler className="h-3 w-3" /> Size Guide
                  </button>
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
              <div className="space-y-3 pt-1 sm:pt-2">
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

                {/* Bespoke Blouse Visual Customizer Box */}
                {selectedBlouse === "Bespoke Custom Tailored" && (
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#B79B63]/40 rounded-xs space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#B79B63] font-semibold uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Bespoke Master Tailoring Options</span>
                    </div>

                    {/* Neckline Choice */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-[#1C1B19]">
                        Neckline Pattern:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          "Regal Sweetheart",
                          "Classic Round",
                          "Royal Boat Neck",
                          "Deep V with Zari",
                        ].map((neck) => (
                          <button
                            key={neck}
                            type="button"
                            onClick={() => setNeckline(neck)}
                            className={cn(
                              "px-2.5 py-1.5 text-[11px] border text-left transition-colors cursor-pointer",
                              neckline === neck
                                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                                : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                            )}
                          >
                            {neck}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sleeve Style */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-[#1C1B19]">Sleeve Cut:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          "Elbow-Length with Zari Border",
                          "Cap Sleeves",
                          "Full Sleeves (Bridal)",
                          "Sleeveless",
                        ].map((slv) => (
                          <button
                            key={slv}
                            type="button"
                            onClick={() => setSleeveStyle(slv)}
                            className={cn(
                              "px-2.5 py-1.5 text-[11px] border text-left transition-colors cursor-pointer",
                              sleeveStyle === slv
                                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                                : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                            )}
                          >
                            {slv}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Back Silhouette */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-[#1C1B19]">
                        Back Silhouette:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          "Dori with Handmade Silk Latkans",
                          "Keyhole Back Cut",
                          "Hook & Eye Classic",
                          "Backless with Dual Tie",
                        ].map((bk) => (
                          <button
                            key={bk}
                            type="button"
                            onClick={() => setBackStyle(bk)}
                            className={cn(
                              "px-2.5 py-1.5 text-[11px] border text-left transition-colors cursor-pointer",
                              backStyle === bk
                                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                                : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                            )}
                          >
                            {bk}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] text-[#8C867D] italic flex items-center gap-1 pt-1 border-t border-[#E8E2D8]">
                      <Info className="h-3 w-3 text-[#B79B63] shrink-0" />
                      Our Masterji will contact you on WhatsApp within 2 hrs of order to finalize
                      exact bust &amp; waist measurements.
                    </p>
                  </div>
                )}
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
                  onClick={() => {
                    const customSummary =
                      selectedBlouse === "Bespoke Custom Tailored"
                        ? `${selectedBlouse} (${neckline}, ${sleeveStyle}, ${backStyle})`
                        : selectedBlouse;
                    addToCart(product, selectedSize, customSummary, quantity);
                  }}
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

            {/* Indian PIN Code Delivery Estimator Widget */}
            <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1B19] uppercase tracking-wider">
                  <Truck className="h-4 w-4 text-[#B79B63]" />
                  <span>Delivery &amp; Atelier Dispatch</span>
                </div>
                <span className="text-[10px] text-[#2D6A4F] font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" /> Free Express Delivery
                </span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8C867D]" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code (e.g. 500034)"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ""));
                      if (pincodeStatus) setPincodeStatus(null);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8E2D8] text-xs text-[#1C1B19] placeholder:text-[#8C867D] focus:border-[#B79B63] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C1B19] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#B79B63] transition-colors cursor-pointer shrink-0"
                >
                  Check
                </button>
              </form>

              {/* Quick City Pills */}
              <div className="flex items-center gap-1.5 text-[10px] text-[#8C867D] overflow-x-auto no-scrollbar">
                <span className="shrink-0">Quick check:</span>
                {[
                  { city: "Hyderabad", pin: "500034" },
                  { city: "Bengaluru", pin: "560001" },
                  { city: "Mumbai", pin: "400001" },
                  { city: "Delhi", pin: "110001" },
                ].map((c) => (
                  <button
                    key={c.pin}
                    type="button"
                    onClick={() => {
                      setPincode(c.pin);
                      setTimeout(() => {
                        const form = document.querySelector("form");
                        if (form) form.requestSubmit();
                      }, 50);
                    }}
                    className="px-2 py-0.5 bg-white border border-[#E8E2D8] hover:border-[#B79B63] hover:text-[#1C1B19] transition-colors shrink-0 cursor-pointer"
                  >
                    {c.city}
                  </button>
                ))}
              </div>

              {/* Status Output */}
              {pincodeStatus && (
                <div
                  className={cn(
                    "p-2.5 text-xs border rounded-xs transition-all",
                    pincodeStatus.type === "success"
                      ? "bg-[#F3F8F5] border-[#B7D8C4] text-[#1B4332]"
                      : "bg-[#FDF2F2] border-[#F8B4B4] text-[#9A3434]"
                  )}
                >
                  {pincodeStatus.badge && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#B79B63] bg-white border border-[#E8E2D8] px-2 py-0.5 mb-1 mr-2">
                      {pincodeStatus.badge}
                    </span>
                  )}
                  <p className="font-medium text-[11px] leading-relaxed">{pincodeStatus.message}</p>
                </div>
              )}

              {/* Trust Assurance checklist */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8E2D8] text-[10px] text-[#5A5650]">
                <div className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-[#B79B63] shrink-0" />
                  <span>Transit Insured to Doorstep</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-[#B79B63] shrink-0" />
                  <span>Bespoke Fall &amp; Pico Included</span>
                </div>
              </div>
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

      {/* Patron Reviews & Verified Testimonials Section */}
      <section className="mt-12 sm:mt-16 bg-white border border-[#E8E2D8] p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#E8E2D8]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-medium">
                Authentic Experiences
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#B79B63]" />
              <span className="text-[11px] text-[#8C867D]">Bespoke Patronage</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] font-normal">
              Patron Reviews &amp; Testimonials
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-[#B79B63]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#1C1B19]">4.9 / 5.0</span>
              <span className="text-xs text-[#8C867D]">
                ({reviews.length} Verified Patron{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          </div>

          <div>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsWriteReviewOpen(!isWriteReviewOpen)}
              className="text-xs uppercase tracking-wider cursor-pointer"
            >
              {isWriteReviewOpen ? "Cancel Review" : "Write a Patron Review"}
            </Button>
          </div>
        </div>

        {/* Collapsible Review Submission Form */}
        {isWriteReviewOpen && (
          <form
            onSubmit={handleReviewSubmit}
            className="my-8 p-6 bg-[#FAF7F2] border border-[#B79B63]/30 rounded-xs space-y-5 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#1C1B19] font-medium">
                Record Your Atelier Experience
              </h3>
              <span className="text-[11px] text-[#8C867D]">Verified purchase publication</span>
            </div>

            {/* Rating Stars Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1C1B19] font-medium mb-1.5">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: starVal })}
                    className="p-1 text-[#B79B63] hover:scale-110 transition-transform cursor-pointer"
                    aria-label={`${starVal} star`}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        starVal <= newReview.rating
                          ? "fill-[#B79B63] text-[#B79B63]"
                          : "text-[#D8C7A5]"
                      )}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-semibold text-[#1C1B19]">
                  {newReview.rating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1C1B19] font-medium mb-1">
                  Full Name / Patron Name *
                </label>
                <input
                  type="text"
                  required
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  placeholder="e.g. Radhika Rao"
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E8E2D8] focus:border-[#B79B63] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1C1B19] font-medium mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={newReview.city}
                  onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                  placeholder="e.g. Hyderabad, Banjara Hills"
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E8E2D8] focus:border-[#B79B63] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1C1B19] font-medium mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="e.g. Heirloom quality pure zari drape"
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E8E2D8] focus:border-[#B79B63] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#1C1B19] font-medium mb-1">
                  Fit &amp; Fall Experience
                </label>
                <select
                  value={newReview.fit}
                  onChange={(e) => setNewReview({ ...newReview, fit: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#E8E2D8] focus:border-[#B79B63] focus:outline-hidden"
                >
                  <option value="Bespoke Master Fit">Bespoke Master Fit</option>
                  <option value="True to Atelier Measure">True to Atelier Measure</option>
                  <option value="Flawless Bridal Fall">Flawless Bridal Fall</option>
                  <option value="Luxuriously Roomy">Luxuriously Roomy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#1C1B19] font-medium mb-1">
                Your Thoughts on Handloom Quality &amp; Finish *
              </label>
              <textarea
                required
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience regarding the silk sheen, zari embroidery, drape weight, and packaging..."
                className="w-full p-3 text-xs bg-white border border-[#E8E2D8] focus:border-[#B79B63] focus:outline-hidden resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsWriteReviewOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="text-xs uppercase tracking-wider"
              >
                Submit Patron Review
              </Button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="mt-8 divide-y divide-[#E8E2D8]">
          {reviews.map((rev) => (
            <article key={rev.id} className="py-6 first:pt-0 last:pb-0 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#FAF7F2] border border-[#B79B63]/40 flex items-center justify-center font-serif text-sm font-semibold text-[#B79B63]">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#1C1B19]">{rev.author}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#128C7E] bg-[#E8F8F5] px-1.5 py-0.5 border border-[#128C7E]/20">
                          <Check className="h-2.5 w-2.5" /> Verified Patron
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#8C867D]">
                      {rev.city} • {rev.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-[#B79B63]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-medium text-[#8C867D] bg-[#FAF7F2] px-2 py-0.5 border border-[#E8E2D8]">
                    {rev.fit}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-semibold text-[#1C1B19]">{rev.title}</h4>
              <p className="text-xs text-[#5C564E] leading-relaxed">{rev.comment}</p>

              <div className="pt-1 flex items-center gap-2 text-[11px] text-[#8C867D]">
                <button
                  type="button"
                  onClick={() => showToast.success("Thank you for your feedback!")}
                  className="inline-flex items-center gap-1 hover:text-[#B79B63] transition-colors cursor-pointer"
                >
                  <ThumbsUp className="h-3 w-3" /> Helpful
                </button>
                <span>•</span>
                <span>Inspected by Atelier Quality Council</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* In-Page Size Guide Modal */}
      {isSizeGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
          className="fixed inset-0 z-50 bg-[#1C1B19]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div className="relative w-full max-w-2xl bg-white border border-[#B79B63]/40 shadow-2xl p-5 sm:p-8 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D8]">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#B79B63] font-semibold mb-1">
                  <Ruler className="h-3.5 w-3.5" /> Atelier Measurements
                </div>
                <h3 id="size-guide-title" className="font-serif text-xl sm:text-2xl text-[#1C1B19]">
                  Fit &amp; Dimension Handbook
                </h3>
                <p className="text-xs text-[#8C867D] mt-0.5">
                  Handcrafted according to classical Indian proportions and bespoke comfort.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1.5 text-[#8C867D] hover:text-[#1C1B19] transition-colors cursor-pointer"
                aria-label="Close size guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-5 space-y-6">
              {/* Saree & Drape Standards */}
              <div className="bg-[#FAF7F2] p-4 border border-[#E8E2D8]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#B79B63]" /> Authentic Saree Dimensions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#5C564E]">
                  <div className="bg-white p-3 border border-[#E8E2D8]">
                    <span className="block font-medium text-[#1C1B19]">Saree Length</span>
                    <span className="text-[11px] text-[#8C867D]">5.50 Metres (Full Drape)</span>
                  </div>
                  <div className="bg-white p-3 border border-[#E8E2D8]">
                    <span className="block font-medium text-[#1C1B19]">Saree Width</span>
                    <span className="text-[11px] text-[#8C867D]">44 – 46 Inches (Standard)</span>
                  </div>
                  <div className="bg-white p-3 border border-[#E8E2D8]">
                    <span className="block font-medium text-[#1C1B19]">Blouse Piece</span>
                    <span className="text-[11px] text-[#8C867D]">0.80 to 1.0 Metre Unstitched</span>
                  </div>
                </div>
              </div>

              {/* Ready-to-wear / Blouse Sizing Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-2.5">
                  Apparel &amp; Blouse Measurements (Inches)
                </h4>
                <div className="overflow-x-auto border border-[#E8E2D8]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8E2D8] text-[10px] uppercase tracking-wider text-[#1C1B19]">
                      <tr>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Bust</th>
                        <th className="py-2.5 px-3">Waist</th>
                        <th className="py-2.5 px-3">Hip</th>
                        <th className="py-2.5 px-3">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D8] text-[#5C564E]">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#1C1B19]">XS (34)</td>
                        <td className="py-2 px-3">32″</td>
                        <td className="py-2 px-3">26″</td>
                        <td className="py-2 px-3">36″</td>
                        <td className="py-2 px-3">13.5″</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#1C1B19]">S (36)</td>
                        <td className="py-2 px-3">34″</td>
                        <td className="py-2 px-3">28″</td>
                        <td className="py-2 px-3">38″</td>
                        <td className="py-2 px-3">14.0″</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#1C1B19]">M (38)</td>
                        <td className="py-2 px-3">36″</td>
                        <td className="py-2 px-3">30″</td>
                        <td className="py-2 px-3">40″</td>
                        <td className="py-2 px-3">14.5″</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#1C1B19]">L (40)</td>
                        <td className="py-2 px-3">38″</td>
                        <td className="py-2 px-3">32″</td>
                        <td className="py-2 px-3">42″</td>
                        <td className="py-2 px-3">15.0″</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#1C1B19]">XL (42)</td>
                        <td className="py-2 px-3">40″</td>
                        <td className="py-2 px-3">34″</td>
                        <td className="py-2 px-3">44″</td>
                        <td className="py-2 px-3">15.5″</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-[#1C1B19]">XXL (44)</td>
                        <td className="py-2 px-3">42″</td>
                        <td className="py-2 px-3">36″</td>
                        <td className="py-2 px-3">46″</td>
                        <td className="py-2 px-3">16.0″</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bespoke Custom Sizing Concierge */}
              <div className="p-4 border border-[#B79B63]/40 bg-[#F7F3EB]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-semibold text-[#1C1B19]">
                    Need Bespoke Bridal Measurements?
                  </h5>
                  <p className="text-[11px] text-[#8C867D] mt-0.5">
                    Our master artisans in Kukatpally provide bespoke tape tailoring for flawless
                    drape fitting.
                  </p>
                </div>
                <a
                  href={whatsAppInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#128C7E] text-white text-xs font-medium shrink-0 hover:bg-[#0f7266] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  WhatsApp Tailor
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#E8E2D8] flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-xs uppercase tracking-wider"
              >
                Close Guide
              </Button>
            </div>
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
            onClick={() => {
              const customSummary =
                selectedBlouse === "Bespoke Custom Tailored"
                  ? `${selectedBlouse} (${neckline}, ${sleeveStyle}, ${backStyle})`
                  : selectedBlouse;
              addToCart(product, selectedSize, customSummary, quantity);
            }}
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
