import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Scissors,
  Star,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRODUCTS } from "@/data/products";

// ─── Category Tiles ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: "Silk Sarees",
    sub: "150+ Styles",
    href: "/women/sarees",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Bridal Lehengas",
    sub: "Bespoke & Ready-to-Wear",
    href: "/women/lehengas",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Kurtis & Sets",
    sub: "Festive to Casual",
    href: "/women/kurtis",
    image:
      "https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Contemporary",
    sub: "Modern Indian Wear",
    href: "/contemporary",
    image:
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=400&q=80",
  },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Priya Reddy",
    city: "Hyderabad",
    text: "The Kanchipuram saree I ordered was absolutely stunning. The quality is exactly what they promise — pure silk, rich zari, and the colors are so vibrant. Will definitely order again!",
    rating: 5,
  },
  {
    name: "Ananya Sharma",
    city: "Bengaluru",
    text: "Got my bridal lehenga stitched through their atelier service. The fit was perfect and the craftsmen were so detailed about every embroidery element. Highly recommend!",
    rating: 5,
  },
  {
    name: "Meena Iyer",
    city: "Chennai",
    text: "Fast delivery, gorgeous packaging, and the kurti set I bought is exactly as described. The concierge service helped me pick the right size over a video call. Lovely experience!",
    rating: 5,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const BADGE_STYLES: Record<string, string> = {
  BESTSELLER: "bg-[#1C1B19] text-[#FAF7F2]",
  NEW: "bg-[#B79B63] text-white",
  SALE: "bg-[#9A3434] text-white",
  LIMITED: "bg-[#3D5A80] text-white",
};

// ══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center bg-[#FAF7F2] overflow-hidden border-b border-[#E8E2D8]">
        {/* Background image with warmer overlay — more visible now */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85"
            alt="Sreesha Elegance Couture Campaign"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/30 via-transparent to-[#FAF7F2]/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#D8C7A5] bg-[#F7F3EB]/90 text-[#B79B63] mb-8 rounded-none">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
              Royal Nizam Autumn / Festive 2026 Edit
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#1C1B19] font-normal tracking-tight leading-[1.08] mb-6">
            Wear Your <span className="italic text-[#B79B63]">Elegance.</span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#5A5650] leading-relaxed mb-10 font-normal">
            Boutique handloom sarees, bespoke bridal lehengas, and contemporary festive ensembles
            crafted in the royal heritage ateliers of Hyderabad.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="primary" size="lg">
              <Link href="/women/sarees">
                Shop Sarees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/collections">Explore Collection</Link>
            </Button>
          </div>

          {/* Social proof mini strip */}
          <div className="mt-12 flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.18em] text-[#8C867D]">
            <span>★ 4.9 Rating</span>
            <span className="h-3 w-px bg-[#D8C7A5]" />
            <span>2,000+ Happy Customers</span>
            <span className="h-3 w-px bg-[#D8C7A5]" />
            <span>Silk Mark Certified</span>
          </div>
        </div>
      </section>

      {/* ── 2. CATEGORY STRIP ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-medium mb-2">
              Shop by Category
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B19] font-normal">
              Discover Our Collections
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative aspect-[3/4] overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8] block"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/80 via-[#1C1B19]/20 to-transparent" />

                {/* Label */}
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="font-serif text-lg sm:text-xl text-white font-normal leading-tight">
                    {cat.label}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#D8C7A5] mt-0.5">
                    {cat.sub}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[#B79B63] text-[10px] uppercase tracking-wider font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Shop Now</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED PRODUCTS ─────────────────────────────────────────────── */}
      <section className="py-16 bg-[#FAF7F2] border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-medium mb-2">
                Handpicked for You
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B19] font-normal">
                Featured Pieces
              </h2>
            </div>
            <Link
              href="/collections"
              className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-[#1C1B19] hover:text-[#B79B63] transition-colors font-medium"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.slice(0, 4).map((product) => {
              const discount =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )
                  : null;
              const productUrl = `/women/${product.category}/${product.slug}`;

              return (
                <div key={product.id} className="group flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8]">
                    <Link href={productUrl} className="block h-full w-full">
                      <Image
                        src={product.primaryImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>

                    {/* Badge */}
                    {product.badge && (
                      <span
                        className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] font-semibold ${BADGE_STYLES[product.badge] ?? ""}`}
                      >
                        {product.badge}
                      </span>
                    )}

                    {/* Quick action on hover */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <Link
                        href={productUrl}
                        className="w-full h-9 bg-[#1C1B19] text-[#FAF7F2] text-[10px] uppercase tracking-[0.14em] font-medium hover:bg-[#B79B63] transition-colors flex items-center justify-center gap-1.5"
                      >
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="pt-3 space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#8C867D] font-medium">
                      {product.categoryLabel}
                    </p>
                    <Link
                      href={productUrl}
                      className="text-sm font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-2 leading-snug"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-sm font-semibold text-[#1C1B19]">
                        {formatINR(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                          <span className="text-xs text-[#8C867D] line-through">
                            {formatINR(product.originalPrice)}
                          </span>
                          <span className="text-[10px] text-[#9A3434] font-medium">
                            -{discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#1C1B19] hover:text-[#B79B63] transition-colors font-medium border border-[#D8C7A5] px-6 py-3"
            >
              View All Products <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. BOUTIQUE PILLARS ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Scissors className="h-6 w-6 stroke-[1.5]" />,
                title: "Bespoke Atelier Fit",
                desc: "Custom blouse tailoring, fall-pico edging, and precise sleeve styling by master Hyderabad craftsmen.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 stroke-[1.5]" />,
                title: "Certified Pure Silk",
                desc: "Every Kanchipuram, Banarasi, and Paithani silk weave comes certified with authentic Silk Mark tags.",
              },
              {
                icon: <HeartHandshake className="h-6 w-6 stroke-[1.5]" />,
                title: "Boutique Concierge",
                desc: "Personalized virtual styling consultations and door-step delivery across India and worldwide.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="p-8 bg-[#FAF7F2] border border-[#E8E2D8] text-center space-y-3 hover:border-[#B79B63] hover:shadow-md transition-all duration-300 group"
              >
                <div className="h-12 w-12 mx-auto border border-[#B79B63] flex items-center justify-center text-[#B79B63] group-hover:bg-[#B79B63] group-hover:text-white transition-all duration-300">
                  {pillar.icon}
                </div>
                <h3 className="font-serif text-xl text-[#1C1B19] font-normal tracking-wide">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#5A5650] leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#1C1B19] border-b border-[#2E2C28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-medium mb-2">
              What Our Clients Say
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Loved Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-[#232220] border border-[#2E2C28] p-6 space-y-4 hover:border-[#B79B63]/40 transition-colors duration-300"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#B79B63] text-[#B79B63]" />
                  ))}
                </div>
                <p className="text-sm text-[#C7BEAF] leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="text-xs font-semibold text-white">{t.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8C867D]">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WHATSAPP / CONCIERGE CTA ──────────────────────────────────────── */}
      <section className="py-14 bg-[#F7F3EB] border-b border-[#E8E2D8]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
          <Sparkles className="h-6 w-6 text-[#B79B63] mx-auto" />
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B19] font-normal">
            Need Help Choosing?
          </h2>
          <p className="text-sm text-[#5A5650] leading-relaxed max-w-xl mx-auto">
            Our boutique concierge team is available 7 days a week to help you find the perfect
            ensemble — be it a bridal trousseau, a festive saree, or a casual kurti set.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/919876543210?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20collections."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#25D366] text-white text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#1ebe5c] transition-colors"
            >
              <Phone className="h-4 w-4" /> Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 border border-[#1C1B19] text-[#1C1B19] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#1C1B19] hover:text-white transition-colors"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
