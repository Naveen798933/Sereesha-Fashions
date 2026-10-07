import { Scissors, Ruler } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Atelier Size & Fitting Guide — Sreesha Elegance",
  description:
    "Comprehensive sizing tables for blouses, kurtis, lehengas, and saree lengths to ensure an authentic tailor-fit drape.",
});

export default function SizeGuidePage() {
  const kurtiSizes = [
    { size: "XS", bust: "32 in (81 cm)", waist: "26 in (66 cm)", hip: "36 in (91 cm)" },
    { size: "S", bust: "34 in (86 cm)", waist: "28 in (71 cm)", hip: "38 in (96 cm)" },
    { size: "M", bust: "36 in (91 cm)", waist: "30 in (76 cm)", hip: "40 in (101 cm)" },
    { size: "L", bust: "38 in (96 cm)", waist: "32 in (81 cm)", hip: "42 in (106 cm)" },
    { size: "XL", bust: "40 in (101 cm)", waist: "34 in (86 cm)", hip: "44 in (111 cm)" },
    { size: "XXL", bust: "42 in (106 cm)", waist: "36 in (91 cm)", hip: "46 in (116 cm)" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-medium">
          Precision Fit
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1C1B19]">Atelier Size Guide</h1>
        <p className="text-xs sm:text-sm text-[#5A5650] max-w-md mx-auto">
          Accurate body measurements to help you pick the perfect fit for your ethnic ensembles.
        </p>
      </div>

      <div className="space-y-10 bg-white border border-[#E8E2D8] p-6 sm:p-10">
        {/* Saree Standards */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-[#1C1B19]">
            <Ruler className="h-4 w-4 text-[#B79B63]" />
            <h2 className="font-serif text-xl font-normal">
              Saree Dimensions &amp; Fabric Allowance
            </h2>
          </div>
          <p className="text-xs text-[#5A5650] leading-relaxed">
            All authentic handloom silk sarees come in standard Indian handloom drape lengths:
          </p>
          <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-1.5 text-xs text-[#5A5650]">
            <p>
              • <strong>Saree Drape:</strong> 5.5 meters (approx 6.0 yards) suitable for all draping
              styles up to 5&apos;10&quot; height.
            </p>
            <p>
              • <strong>Blouse Piece:</strong> 0.8 to 0.85 meters running pure silk fabric attached
              at the inner end of the saree.
            </p>
            <p>
              • <strong>Petticoat / Inskirt:</strong> High-grade pure satin petticoats can be
              requested via our tailoring team.
            </p>
          </div>
        </section>

        {/* Kurtis and Anarkalis Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#1C1B19]">
            <Scissors className="h-4 w-4 text-[#B79B63]" />
            <h2 className="font-serif text-xl font-normal">Kurtis, Anarkalis &amp; Co-ord Sets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#E8E2D8]">
              <thead className="bg-[#FAF7F2] text-[#1C1B19] uppercase tracking-wider font-semibold border-b border-[#E8E2D8]">
                <tr>
                  <th className="p-3 border-r border-[#E8E2D8]">Size</th>
                  <th className="p-3 border-r border-[#E8E2D8]">Bust</th>
                  <th className="p-3 border-r border-[#E8E2D8]">Waist</th>
                  <th className="p-3">Hip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-[#5A5650]">
                {kurtiSizes.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FAF7F2]/50">
                    <td className="p-3 font-semibold text-[#1C1B19] border-r border-[#E8E2D8]">
                      {row.size}
                    </td>
                    <td className="p-3 border-r border-[#E8E2D8]">{row.bust}</td>
                    <td className="p-3 border-r border-[#E8E2D8]">{row.waist}</td>
                    <td className="p-3">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Custom Tailoring Tip */}
        <div className="p-4 bg-[#F7F3EB] border border-[#D8C7A5] text-xs text-[#5A5650] space-y-1">
          <p className="font-semibold text-[#1C1B19]">Need Custom Measurement Assistance?</p>
          <p>
            You can always order with standard sizes and WhatsApp our Banjara Hills atelier at{" "}
            <strong>+91 98765 43210</strong> with your custom blouse chest/shoulder/armhole specs.
            We tailor it free of extra pattern fees for pre-orders.
          </p>
        </div>
      </div>
    </div>
  );
}
