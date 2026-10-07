import Image from "next/image";
import Link from "next/link";
import { Sparkles, Scissors, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Our Heritage Story — Sreesha Elegance Hyderabad",
  description:
    "Rooted in the royal heritage of Hyderabad, Sreesha Elegance blends timeless handloom weaves with contemporary grace.",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-[#B79B63]">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
            Atelier Heritage
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#1C1B19] font-normal leading-tight">
          Rooted in Nizam Grandeur,
          <br />
          Crafted for Today.
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#5A5650] leading-relaxed">
          Founded in Hyderabad, Sreesha Elegance was born from a singular passion: to preserve the
          unmatched finesse of Indian handloom weaving while sculpting silhouettes that empower the
          modern woman.
        </p>
      </div>

      {/* Flagship Image & Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white border border-[#E8E2D8] p-6 sm:p-10">
        <div className="relative aspect-[4/5] bg-[#EFE8DD] overflow-hidden border border-[#E8E2D8]">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
            alt="Sreesha Elegance Atelier Craftsmanship"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#5A5650] leading-relaxed">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79B63] font-medium block">
            Our Hyderabad Atelier
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] leading-snug">
            Where Master Weavers Meet Bespoke Couturiers
          </h2>
          <p>
            For generations, the city of Hyderabad has been celebrated for its connoisseurship of
            rich textiles — from royal Jamdani and Paithani to regal gold zardozi embroidery.
          </p>
          <p>
            At our Kukatpally flagship atelier, our craftsmen work directly with traditional weaving
            clusters across Kanchipuram, Varanasi, and Maheshwar, cutting out intermediaries so our
            patrons receive verified authentic weaves.
          </p>
          <div className="pt-4 border-t border-[#E8E2D8] flex items-center gap-6 text-center text-xs">
            <div>
              <p className="font-serif text-2xl text-[#1C1B19] font-semibold">100%</p>
              <p className="text-[10px] uppercase text-[#8C867D]">Pure Silk</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-[#1C1B19] font-semibold">320+</p>
              <p className="text-[10px] uppercase text-[#8C867D]">Hours Per Bridal Edit</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-[#1C1B19] font-semibold">2000+</p>
              <p className="text-[10px] uppercase text-[#8C867D]">Happy Brides</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-[#E8E2D8] text-center space-y-3">
          <ShieldCheck className="h-6 w-6 text-[#B79B63] mx-auto" />
          <h3 className="font-serif text-lg text-[#1C1B19]">Certified Silk Mark Tags</h3>
          <p className="text-xs text-[#5A5650] leading-relaxed">
            Every pure silk saree undergoes testing for natural silk filament purity and bears
            authentic Silk Mark certification.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#E8E2D8] text-center space-y-3">
          <Scissors className="h-6 w-6 text-[#B79B63] mx-auto" />
          <h3 className="font-serif text-lg text-[#1C1B19]">In-House Tailoring Masters</h3>
          <p className="text-xs text-[#5A5650] leading-relaxed">
            From precision bustier shaping to hand-pleated saree falls, our master karigars ensure a
            glove-like fit.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#E8E2D8] text-center space-y-3">
          <HeartHandshake className="h-6 w-6 text-[#B79B63] mx-auto" />
          <h3 className="font-serif text-lg text-[#1C1B19]">Patron Concierge</h3>
          <p className="text-xs text-[#5A5650] leading-relaxed">
            Personal video calls, customized bridal swatches, and door-step express delivery across
            India.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Button asChild variant="primary" size="lg">
          <Link href="/collections">
            Explore the Royal Nizam Edit <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
