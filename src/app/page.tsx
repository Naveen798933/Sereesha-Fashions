import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Scissors } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Editorial Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#FAF7F2] overflow-hidden border-b border-[#E8E2D8]">
        {/* Background editorial image with soft overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85"
            alt="Sreesha Elegance Couture Campaign"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-25 filter grayscale contrast-125 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#D8C7A5] bg-[#F7F3EB]/80 text-[#B79B63] mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
              The Royal Nizam Autumn / Festive 2026 Edit
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#1C1B19] font-normal tracking-tight leading-[1.08] mb-6">
            Elegance, Redefined.
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
            <Button asChild variant="outlineGold" size="lg">
              <Link href="/design-system">Atelier UI System</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Boutique Pillars */}
      <section className="py-16 bg-[#FAF7F2] border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-[#E8E2D8] text-center space-y-3">
              <div className="h-12 w-12 mx-auto border border-[#B79B63] flex items-center justify-center text-[#B79B63]">
                <Scissors className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h2 className="font-serif text-xl text-[#1C1B19] font-normal tracking-wide">
                Bespoke Atelier Fit
              </h2>
              <p className="text-xs text-[#5A5650] leading-relaxed">
                Custom blouse tailoring, fall-pico edging, and precise sleeve styling by master
                Hyderabad craftsmen.
              </p>
            </div>

            <div className="p-8 bg-white border border-[#E8E2D8] text-center space-y-3">
              <div className="h-12 w-12 mx-auto border border-[#B79B63] flex items-center justify-center text-[#B79B63]">
                <ShieldCheck className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h2 className="font-serif text-xl text-[#1C1B19] font-normal tracking-wide">
                Certified Pure Silk
              </h2>
              <p className="text-xs text-[#5A5650] leading-relaxed">
                Every Kanchipuram, Banarasi, and Paithani silk weave comes certified with authentic
                Silk Mark tags.
              </p>
            </div>

            <div className="p-8 bg-white border border-[#E8E2D8] text-center space-y-3">
              <div className="h-12 w-12 mx-auto border border-[#B79B63] flex items-center justify-center text-[#B79B63]">
                <HeartHandshake className="h-6 w-6 stroke-[1.5]" />
              </div>
              <h2 className="font-serif text-xl text-[#1C1B19] font-normal tracking-wide">
                Boutique Concierge
              </h2>
              <p className="text-xs text-[#5A5650] leading-relaxed">
                Personalized virtual styling consultations and door-step delivery across India and
                worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
