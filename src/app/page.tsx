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
  Crown,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FeaturedCollectionTabs } from "@/components/shop/FeaturedCollectionTabs";
import { VipPrivilegeBanner } from "@/components/shop/VipPrivilegeBanner";

// ─── Category Tiles ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    label: "Silk Sarees",
    sub: "Kanchipuram, Banarasi & Paithani",
    href: "/women/sarees",
    badge: "150+ Styles",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Bridal Lehengas",
    sub: "Hand-Embroidered Zardozi & Velvet",
    href: "/women/lehengas",
    badge: "Bespoke Fit",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Kurtis & Sets",
    sub: "Pure Silk Anarkalis & Festive Sets",
    href: "/women/kurtis",
    badge: "Festive Ready",
    image:
      "https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Contemporary",
    sub: "Pre-Draped Sarees & Capes",
    href: "/contemporary",
    badge: "Modern Edit",
    image:
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=600&q=80",
  },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Priya Reddy",
    city: "Jubilee Hills, Hyderabad",
    text: "The Kanchipuram saree I ordered for my sister's reception was mesmerising. The heavy gold zari luster, pure mulberry silk texture, and fall-pico finish were immaculate. Received compliments all evening!",
    rating: 5,
    tag: "Verified Bridal Patron",
  },
  {
    name: "Ananya Sharma",
    city: "Indiranagar, Bengaluru",
    text: "Got my bespoke wedding lehenga customized with their Hyderabad masterji over WhatsApp video. The fit was flawless to the exact millimeter, and delivery arrived 3 days ahead of schedule in gold-stamped luxury boxes.",
    rating: 5,
    tag: "Bespoke Couture",
  },
  {
    name: "Meena Iyer",
    city: "Boat Club Road, Chennai",
    text: "Checked the Silk Mark QR code upon arrival—100% genuine pure silk. The concierge team helped me match jewelry over chat. Sreesha Elegance has become my go-to luxury atelier for every milestone event.",
    rating: 5,
    tag: "Silk Mark Verified",
  },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── 1. LUXURY HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#FAF7F2] overflow-hidden border-b border-[#E8E2D8]">
        {/* Editorial Background Image with Ambient Warmth */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85"
            alt="Sreesha Elegance Royal Nizam Campaign"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/40 via-transparent to-[#FAF7F2]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 sm:py-28">
          {/* Royal Crest Monogram Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 border border-[#D8C7A5] bg-[#F7F3EB]/95 text-[#B79B63] mb-8 shadow-xs">
            <Crown className="h-3.5 w-3.5" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-semibold">
              Hyderabad Flagship Atelier • Royal Nizam Festive 2026 Edit
            </span>
          </div>

          {/* High-Contrast Luxury Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#1C1B19] font-normal tracking-tight leading-[1.05] mb-6">
            Wear Your <span className="italic font-normal gold-gradient-text">Elegance.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#5A5650] leading-relaxed mb-10 font-normal">
            Heirloom pure handloom sarees, bespoke bridal lehengas, and contemporary festive
            silhouettes handcrafted by master artisans in the royal heritage ateliers of Hyderabad.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="primary" size="lg" className="w-full sm:w-auto px-8 shadow-sm">
              <Link href="/women/sarees">
                Explore Pure Silk Sarees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto px-8">
              <Link href="/women/lehengas">Bespoke Bridal Lehengas</Link>
            </Button>
          </div>

          {/* Royal Guarantees Mini Strip */}
          <div className="mt-14 pt-8 border-t border-[#E8E2D8]/80 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] uppercase tracking-[0.2em] text-[#8C867D]">
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[#B79B63]" />
              Silk Mark Certified
            </span>
            <span className="hidden sm:inline h-3 w-px bg-[#D8C7A5]" />
            <span className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-[#B79B63]" />
              Complimentary Blouse Stitching
            </span>
            <span className="hidden sm:inline h-3 w-px bg-[#D8C7A5]" />
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#B79B63]" />
              Jubilee Hills, Hyderabad
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. CURATED CATEGORY TILES ────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold mb-2">
              Atelier Collections
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1C1B19] font-normal">
              Curated by Silhouette
            </h2>
            <div className="w-12 h-0.5 bg-[#B79B63] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative aspect-[3/4] overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8] hover:border-[#B79B63] transition-all duration-500 shadow-2xs hover:shadow-lg block"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/90 via-[#1C1B19]/25 to-transparent transition-opacity duration-300" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] font-semibold bg-white/90 text-[#1C1B19] backdrop-blur-xs">
                    {cat.badge}
                  </span>
                </div>

                {/* Label Bottom */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                  <p className="font-serif text-xl sm:text-2xl text-white font-normal leading-tight">
                    {cat.label}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#D8C7A5] mt-1 line-clamp-1">
                    {cat.sub}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[#B79B63] text-[10px] uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <span>Explore Gallery</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE FEATURED CURATION (TABS) ─────────────────────────── */}
      <section className="py-20 bg-[#FAF7F2] border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold mb-2">
                Handpicked Masterpieces
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1C1B19] font-normal">
                Featured At the Atelier
              </h2>
            </div>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1C1B19] hover:text-[#B79B63] transition-colors font-medium border-b border-[#1C1B19] pb-0.5 self-start sm:self-end"
            >
              Browse Complete Catalog <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Interactive Client Component for Dynamic Category Filtering */}
          <FeaturedCollectionTabs />
        </div>
      </section>

      {/* ── 4. ARTISAN HERITAGE & THE NIZAM WEAVE ────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E8E2D8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8] shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1200&q=85"
                alt="Master Artisan Handloom Weaving in Hyderabad"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white p-4 bg-[#1C1B19]/80 backdrop-blur-sm border border-white/10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#D8C7A5]">
                  Authentic Handloom Legacy
                </p>
                <p className="font-serif text-lg text-white mt-0.5">
                  &ldquo;A single Kanchipuram pure silk saree embodies 400+ hours of rhythmic
                  shuttle work.&rdquo;
                </p>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#D8C7A5] bg-[#FAF7F2] text-[#B79B63]">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
                  Heritage Craftsmanship
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl text-[#1C1B19] font-normal leading-tight">
                The Royal Nizam Weave — Pure Silver Zari &amp; Mulberry Silk
              </h2>

              <p className="text-sm text-[#5A5650] leading-relaxed">
                Founded in Hyderabad, Sreesha Elegance preserves the timeless artistry of Telangana
                and South Indian royal courts. Every silk thread is sourced from certified mulberry
                farms, inspected for weight and resilience, and hand-woven on heritage wooden
                pit-looms.
              </p>

              {/* Craftsmanship Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E8E2D8]">
                <div className="space-y-1">
                  <p className="font-serif text-2xl sm:text-3xl text-[#1C1B19]">100%</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                    Silk Mark Certified
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-2xl sm:text-3xl text-[#1C1B19]">400+</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                    Artisan Hours / Saree
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-2xl sm:text-3xl text-[#1C1B19]">50+</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                    Master Weavers
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button asChild variant="primary" size="md">
                  <Link href="/about">Read Atelier Heritage</Link>
                </Button>
                <Button asChild variant="outline" size="md">
                  <Link href="/size-guide">Atelier Fitting Guide</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. VIP PRIVÉ PRIVILEGE BANNER ───────────────────────────────────── */}
      <section className="py-12 bg-[#FAF7F2] border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VipPrivilegeBanner />
        </div>
      </section>

      {/* ── 6. BOUTIQUE PILLARS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold mb-2">
              The Sreesha Standard
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B19] font-normal">
              Why Discerning Patrons Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Scissors className="h-6 w-6 stroke-[1.5]" />,
                title: "Bespoke Atelier Fit",
                desc: "Complimentary custom blouse tailoring, fall-pico edging, and precise sleeve styling by master Hyderabad craftsmen.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 stroke-[1.5]" />,
                title: "Certified Pure Mulberry Silk",
                desc: "Every Kanchipuram, Banarasi, and Paithani silk weave comes certified with authentic Silk Mark security labels.",
              },
              {
                icon: <HeartHandshake className="h-6 w-6 stroke-[1.5]" />,
                title: "Private Virtual Concierge",
                desc: "Personalized WhatsApp video-call consultations and guaranteed insured express doorstep delivery across India and worldwide.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="luxury-card p-8 bg-[#FAF7F2] text-center space-y-3.5 group"
              >
                <div className="h-14 w-14 mx-auto border border-[#B79B63] flex items-center justify-center text-[#B79B63] group-hover:bg-[#B79B63] group-hover:text-white transition-all duration-300">
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

      {/* ── 7. PATRON TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="py-20 bg-[#1C1B19] border-b border-[#2E2C28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold mb-2">
              Patron Diaries
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal">
              Loved Across India
            </h2>
            <div className="w-12 h-0.5 bg-[#B79B63] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-[#232220] border border-[#2E2C28] p-7 space-y-4 hover:border-[#B79B63]/60 transition-all duration-300 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[#B79B63] text-[#B79B63]" />
                      ))}
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-[#B79B63] px-2 py-0.5 bg-[#B79B63]/10 border border-[#B79B63]/20">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#C7BEAF] leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#333]/50">
                  <p className="text-xs font-semibold text-white tracking-wide">{t.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#8C867D]">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. WHATSAPP & CONCIERGE CALLOUT ──────────────────────────────────── */}
      <section className="py-16 bg-[#F7F3EB] border-b border-[#E8E2D8]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
          <Sparkles className="h-6 w-6 text-[#B79B63] mx-auto" />
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B19] font-normal">
            Bespoke Styling Concierge
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5650] leading-relaxed max-w-xl mx-auto">
            Need guidance selecting the right silk zari weight, blouse necklines, or bridal dupatta
            colors? Our Hyderabad flagship stylists are available 7 days a week for private video
            consultations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/916281344628?text=Hello%2C%20I%20would%20like%20to%20consult%20with%20your%20master%20stylist."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#25D366] text-white text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#1ebe5c] transition-colors shadow-sm"
            >
              <Phone className="h-4 w-4" /> WhatsApp Video Consultation
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#1C1B19] text-[#1C1B19] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#1C1B19] hover:text-white transition-colors"
            >
              Visit Jubilee Hills Atelier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
