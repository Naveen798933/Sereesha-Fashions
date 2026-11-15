"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Gift, Sparkles, Printer, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import {
  GIFT_CARD_THEMES,
  GIFT_CARD_DENOMINATIONS,
  GiftCardTheme,
  createGiftCardRecord,
} from "@/lib/giftCards";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

export default function GiftCardsPage() {
  const router = useRouter();
  const { addToCart, setIsCartDrawerOpen } = useCartWishlist();

  const [selectedThemeId, setSelectedThemeId] = React.useState<string>(GIFT_CARD_THEMES[0].id);
  const [selectedAmount, setSelectedAmount] = React.useState<number>(10000);
  const [customAmountInput, setCustomAmountInput] = React.useState<string>("");
  const [isCustom, setIsCustom] = React.useState<boolean>(false);

  const [deliveryMethod, setDeliveryMethod] = React.useState<"email_recipient" | "send_to_me">(
    "email_recipient"
  );

  const [formData, setFormData] = React.useState({
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    senderEmail: "",
    message: GIFT_CARD_THEMES[0].defaultMessage,
    deliveryDate: "",
  });

  const [isAdding, setIsAdding] = React.useState<boolean>(false);

  const activeTheme: GiftCardTheme =
    GIFT_CARD_THEMES.find((t) => t.id === selectedThemeId) || GIFT_CARD_THEMES[0];

  // Set default message when theme changes if untouched
  const handleThemeChange = (theme: GiftCardTheme) => {
    setSelectedThemeId(theme.id);
    if (!formData.message || GIFT_CARD_THEMES.some((t) => t.defaultMessage === formData.message)) {
      setFormData((prev) => ({ ...prev, message: theme.defaultMessage }));
    }
  };

  const effectiveAmount = isCustom ? parseInt(customAmountInput, 10) || 5000 : selectedAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGiftCardToBag = (proceedToCheckout = false) => {
    if (!formData.recipientName.trim() || !formData.senderName.trim()) {
      showToast.error("Please enter recipient and sender names.");
      return;
    }

    if (deliveryMethod === "email_recipient" && !formData.recipientEmail.includes("@")) {
      showToast.error("Please provide a valid recipient email address.");
      return;
    }

    if (!formData.senderEmail.includes("@")) {
      showToast.error("Please provide a valid sender email address.");
      return;
    }

    if (effectiveAmount < 2500) {
      showToast.error("Minimum gift card denomination is ₹2,500.");
      return;
    }

    setIsAdding(true);

    const giftCard = createGiftCardRecord({
      amount: effectiveAmount,
      themeId: selectedThemeId,
      recipientName: formData.recipientName,
      recipientEmail:
        deliveryMethod === "email_recipient" ? formData.recipientEmail : formData.senderEmail,
      senderName: formData.senderName,
      senderEmail: formData.senderEmail,
      message: formData.message,
      deliveryDate: formData.deliveryDate,
    });

    // Mock Product representation for cart integration
    const giftCardProduct = {
      id: `SE-GC-${giftCard.id}`,
      slug: `atelier-gift-card-${effectiveAmount}`,
      title: `Sreesha Elegance Digital Gift Card — ${formatINR(effectiveAmount)}`,
      category: "contemporary" as const,
      categoryLabel: "Atelier Gift Voucher",
      price: effectiveAmount,
      originalPrice: effectiveAmount,
      primaryImage:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      galleryImages: [],
      rating: 5,
      reviewCount: 38,
      sizes: [`${formatINR(effectiveAmount)} Voucher`],
      fabric: "Digital Privé Voucher",
      weave: activeTheme.name,
      color: "Champagne Gold",
      occasion: "Gifting & Trousseau",
      silkMarkCertified: false,
      blouseIncluded: false,
      shortDescription: `For ${giftCard.recipientName} from ${giftCard.senderName} (${giftCard.code})`,
      description: giftCard.message,
      details: {
        origin: "Hyderabad Atelier",
        washCare: "1-Year Validity",
        dispatchTime: "Instant Digital Delivery",
        zariType: "Privé Voucher",
      },
    };

    addToCart(
      giftCardProduct,
      `${formatINR(effectiveAmount)} Voucher`,
      `Gift Card Code: ${giftCard.code} (To: ${giftCard.recipientName})`,
      1,
      { silent: true, openDrawer: false }
    );

    showToast.success(`Added ${formatINR(effectiveAmount)} Gift Voucher to your bag!`);

    setTimeout(() => {
      setIsAdding(false);
      if (proceedToCheckout) {
        router.push("/checkout");
      } else {
        setIsCartDrawerOpen(true);
      }
    }, 300);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1B19]">
      {/* Printable styles isolation */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #atelier-printable-giftcard,
          #atelier-printable-giftcard * {
            visibility: visible !important;
          }
          #atelier-printable-giftcard {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 32px !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: 4px double #b79b63 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Hero Header */}
      <section className="relative bg-[#1C1B19] text-[#FAF7F2] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#2E2C28] no-print">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B79B63_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#B79B63]/10 border border-[#B79B63]/30 text-[#B79B63] text-xs uppercase tracking-[0.2em] font-medium">
            <Gift className="h-3.5 w-3.5" />
            <span>Digital Privé Gifting</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
            The Atelier Gift Card
          </h1>

          <p className="text-xs sm:text-base text-[#C7BEAF] max-w-2xl mx-auto leading-relaxed">
            Gift the sublime freedom of choice. Whether blessing a new bride, celebrating Deepavali,
            or honoring a golden anniversary, present a luxury digital voucher redeemable across all
            pure handloom silks and bespoke tailoring.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#E8E2D8]">
            <span className="flex items-center gap-1.5 text-[#B79B63]">
              <Sparkles className="h-4 w-4" />
              <span>Instant Digital Delivery</span>
            </span>
            <span className="text-[#3E3A34]">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#2D6A4F]" />
              <span>1-Year Complete Validity</span>
            </span>
            <span className="text-[#3E3A34]">•</span>
            <span>Online &amp; In-Store Atelier Redemption</span>
          </div>
        </div>
      </section>

      {/* Main Suite */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 6 Cols: Interactive Live Preview Card (Sticky on desktop) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="flex items-center justify-between no-print">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C867D]">
                  Live Digital Card Preview
                </span>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="text-xs text-[#B79B63] hover:underline flex items-center gap-1 font-medium"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>

              {/* THE LIVE DIGITAL GIFT CARD */}
              <div
                id="atelier-printable-giftcard"
                className={`relative aspect-[16/10] w-full rounded-xs p-6 sm:p-8 flex flex-col justify-between text-white shadow-xl overflow-hidden border-2 border-[#B79B63] bg-gradient-to-br ${activeTheme.bgGradient}`}
              >
                {/* Subtle Luxury Watermark Pattern */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                {/* Top Strip */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#B79B63]">
                      Sreesha Elegance • Hyderabad
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-[#FAF7F2]/10 border border-[#B79B63]/40 text-[9px] uppercase tracking-wider text-[#FAF7F2] font-mono">
                      {activeTheme.badgeText}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#A69E92] block">
                      Privé Value
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2] tracking-wide">
                      {formatINR(effectiveAmount)}
                    </span>
                  </div>
                </div>

                {/* Center Calligraphy Message & Recipient */}
                <div className="relative z-10 my-auto py-2 space-y-2">
                  <p className="text-xs text-[#B79B63] font-semibold uppercase tracking-wider">
                    To: {formData.recipientName || "Honored Patron"}
                  </p>
                  <p className="font-serif italic text-xs sm:text-sm text-[#EFE8DD] leading-relaxed line-clamp-3">
                    &quot;{formData.message || activeTheme.defaultMessage}&quot;
                  </p>
                  <p className="text-[11px] text-[#A69E92]">
                    With warm regards from:{" "}
                    <strong className="text-white">{formData.senderName || "A Well-Wisher"}</strong>
                  </p>
                </div>

                {/* Bottom Strip: Card Code & Validity */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-end justify-between text-[10px] text-[#A69E92]">
                  <div>
                    <span className="uppercase tracking-widest text-[9px] block text-[#8C867D]">
                      Voucher Code
                    </span>
                    <span className="font-mono text-xs text-white tracking-widest font-semibold">
                      SE-PRIV-••••-••••
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[9px]">Valid for 365 Days</span>
                    <span className="text-white/80">sreeshaelegance.com</span>
                  </div>
                </div>
              </div>

              {/* Trust Callout */}
              <div className="p-4 bg-white border border-[#E8E2D8] text-xs text-[#5C5549] space-y-1.5 no-print">
                <div className="flex items-center gap-2 text-[#2D6A4F] font-semibold text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>How Redemption Works:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Upon purchase, the recipient receives a personalized email with the
                  high-resolution card, custom message, and unique voucher code. They can enter this
                  code in the promo box during checkout or present it at our Kukatpally atelier.
                </p>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Form Configuration */}
          <div className="lg:col-span-6 space-y-8 no-print">
            {/* STEP 1: DENOMINATION */}
            <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
                <div className="h-6 w-6 rounded-full bg-[#1C1B19] text-[#FAF7F2] flex items-center justify-center text-xs font-semibold">
                  1
                </div>
                <h2 className="font-serif text-lg text-[#1C1B19] font-medium">
                  Select Voucher Denomination
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {GIFT_CARD_DENOMINATIONS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setIsCustom(false);
                    }}
                    className={`py-3 px-2 border text-center font-serif font-bold transition-all ${
                      !isCustom && selectedAmount === amt
                        ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                        : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`py-3 px-2 border text-center font-medium transition-all ${
                    isCustom
                      ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                      : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                  }`}
                >
                  Custom Amount
                </button>
              </div>

              {isCustom && (
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-[#1C1B19] mb-1">
                    Enter Custom Value (Min ₹2,500):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8C867D]">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={2500}
                      step={500}
                      value={customAmountInput}
                      onChange={(e) => setCustomAmountInput(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full pl-7 pr-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs focus:border-[#B79B63] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: OCCASION THEME */}
            <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
                <div className="h-6 w-6 rounded-full bg-[#1C1B19] text-[#FAF7F2] flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <h2 className="font-serif text-lg text-[#1C1B19] font-medium">
                  Choose Occasion Card Theme
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GIFT_CARD_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleThemeChange(theme)}
                      className={`p-3 border text-left transition-all ${
                        isSelected
                          ? "border-[#B79B63] bg-[#FAF7F2] ring-1 ring-[#B79B63]"
                          : "border-[#E8E2D8] bg-white hover:border-[#B79B63]"
                      }`}
                    >
                      <p className="font-serif font-semibold text-xs text-[#1C1B19]">
                        {theme.name}
                      </p>
                      <p className="text-[10px] text-[#8C867D] mt-0.5">{theme.subName}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: PERSONALIZATION & DETAILS */}
            <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
                <div className="h-6 w-6 rounded-full bg-[#1C1B19] text-[#FAF7F2] flex items-center justify-center text-xs font-semibold">
                  3
                </div>
                <h2 className="font-serif text-lg text-[#1C1B19] font-medium">
                  Personalize Your Gift
                </h2>
              </div>

              {/* Delivery Choice */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <label
                  className={`p-3 border cursor-pointer flex items-center gap-2 transition-colors ${
                    deliveryMethod === "email_recipient"
                      ? "border-[#B79B63] bg-[#FAF7F2] font-semibold text-[#1C1B19]"
                      : "border-[#E8E2D8] bg-white text-[#5C5549]"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="email_recipient"
                    checked={deliveryMethod === "email_recipient"}
                    onChange={() => setDeliveryMethod("email_recipient")}
                    className="accent-[#B79B63]"
                  />
                  <span>Email to Recipient</span>
                </label>

                <label
                  className={`p-3 border cursor-pointer flex items-center gap-2 transition-colors ${
                    deliveryMethod === "send_to_me"
                      ? "border-[#B79B63] bg-[#FAF7F2] font-semibold text-[#1C1B19]"
                      : "border-[#E8E2D8] bg-white text-[#5C5549]"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="send_to_me"
                    checked={deliveryMethod === "send_to_me"}
                    onChange={() => setDeliveryMethod("send_to_me")}
                    className="accent-[#B79B63]"
                  />
                  <span>Send to Me (To Print/Hand-Deliver)</span>
                </label>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="block text-[#1C1B19] font-medium mb-1">
                    Recipient&apos;s Name *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    required
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sreeja Varma"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
                  />
                </div>

                {deliveryMethod === "email_recipient" && (
                  <div>
                    <label className="block text-[#1C1B19] font-medium mb-1">
                      Recipient&apos;s Email *
                    </label>
                    <input
                      type="email"
                      name="recipientEmail"
                      required
                      value={formData.recipientEmail}
                      onChange={handleInputChange}
                      placeholder="sreeja@example.com"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[#1C1B19] font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="senderName"
                    required
                    value={formData.senderName}
                    onChange={handleInputChange}
                    placeholder="e.g. Naveen Kota"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#1C1B19] font-medium mb-1">Your Email *</label>
                  <input
                    type="email"
                    name="senderEmail"
                    required
                    value={formData.senderEmail}
                    onChange={handleInputChange}
                    placeholder="naveen@example.com"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[#1C1B19] font-medium">
                      Personal Calligraphy Blessing
                    </label>
                    <span className="text-[10px] text-[#8C867D]">
                      {formData.message.length}/200 characters
                    </span>
                  </div>
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={200}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none resize-none font-serif italic text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="gold"
                  disabled={isAdding}
                  onClick={() => handleAddGiftCardToBag(false)}
                  className="flex-1 py-3 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                >
                  <Gift className="h-4 w-4" />
                  <span>Add Gift Card to Bag ({formatINR(effectiveAmount)})</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isAdding}
                  onClick={() => handleAddGiftCardToBag(true)}
                  className="py-3 px-5 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <p className="text-[11px] text-center text-[#8C867D] pt-1">
                ✦ Delivered instantly upon checkout or printable anytime from order receipt.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
