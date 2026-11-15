"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Compass,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Video,
  Info,
  Gem,
} from "lucide-react";
import {
  DRAPE_STYLES,
  DrapeStyle,
  calculatePleats,
  PleatCalculationResult,
} from "@/lib/drapeGuide";

type FabricChoice =
  "heavy_kanchipuram" | "banarasi_katan" | "light_organza" | "fluid_satin" | "paithani_heavy";

export default function DrapeGuidePage() {
  const [selectedStyleId, setSelectedStyleId] = React.useState<string>(DRAPE_STYLES[0].id);

  // Calculator State
  const [calcFabric, setCalcFabric] = React.useState<FabricChoice>("heavy_kanchipuram");
  const [calcHeightInches, setCalcHeightInches] = React.useState<number>(64); // 5'4" default

  const activeStyle: DrapeStyle =
    DRAPE_STYLES.find((s) => s.id === selectedStyleId) || DRAPE_STYLES[0];

  const calcResult: PleatCalculationResult = React.useMemo(() => {
    return calculatePleats(calcFabric, calcHeightInches);
  }, [calcFabric, calcHeightInches]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1B19]">
      {/* Hero Header */}
      <section className="relative bg-[#1C1B19] text-[#FAF7F2] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#2E2C28]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B79B63_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#B79B63]/10 border border-[#B79B63]/30 text-[#B79B63] text-xs uppercase tracking-[0.2em] font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Atelier Masterclass</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
            The Royal Saree Drape Guide
          </h1>

          <p className="text-xs sm:text-base text-[#C7BEAF] max-w-2xl mx-auto leading-relaxed">
            From the sovereign Nivi drape of Hyderabad and Andhra to the noble Bengali Atpoure and
            Peshwai Nauvari, master the art of draping certified handloom silks with
            millimeter-exact pleats, zero zari damage, and regal grace.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#E8E2D8]">
            <span className="flex items-center gap-1.5 text-[#B79B63]">
              <Compass className="h-4 w-4" />
              <span>5 Royal Regional Traditions</span>
            </span>
            <span className="text-[#3E3A34]">•</span>
            <span className="flex items-center gap-1.5">
              <Calculator className="h-4 w-4 text-[#2D6A4F]" />
              <span>Interactive Pleat &amp; Pinning Calculator</span>
            </span>
            <span className="text-[#3E3A34]">•</span>
            <span>Zero Zari-Puncture Protocols</span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* SECTION 1: DRAPE STYLE EXPLORER */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#B79B63]">
              Curated Masterclasses
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1B19]">
              Choose Your Signature Drape
            </h2>
          </div>

          {/* Style Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#E8E2D8] pb-4">
            {DRAPE_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyleId(style.id)}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-all ${
                  selectedStyleId === style.id
                    ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                    : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                }`}
              >
                {style.name.split(" ")[0]} {style.name.split(" ")[1]}
              </button>
            ))}
          </div>

          {/* Active Style Masterclass Dossier */}
          <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 shadow-xs space-y-8">
            {/* Header Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#2D6A4F] font-semibold">
                  {activeStyle.originRegion}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] mt-0.5">
                  {activeStyle.name}
                </h3>
                <p className="text-xs text-[#8C867D] italic mt-0.5">{activeStyle.subName}</p>
              </div>

              {/* Quick Spec Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#B79B63]" />
                  <span>{activeStyle.timeMinutes} Mins</span>
                </span>
                <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] font-medium">
                  Level: {activeStyle.difficulty}
                </span>
                <span className="px-3 py-1 bg-[#FAF7F2] border border-[#E8E2D8] text-[#2D6A4F] font-medium font-mono">
                  {activeStyle.pleatCount}
                </span>
              </div>
            </div>

            {/* Overview & Image Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left 4 Cols: Image & Ideal Saree Types */}
              <div className="lg:col-span-4 space-y-4">
                <div className="relative aspect-[3/4] w-full bg-[#FAF7F2] border border-[#E8E2D8] overflow-hidden">
                  <Image
                    src={activeStyle.image}
                    alt={activeStyle.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs">
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1B19]">
                    Best Suited For Weaves:
                  </h4>
                  <ul className="space-y-1 text-[#5C5549]">
                    {activeStyle.idealSareeTypes.map((weave, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[#B79B63]" />
                        <span>{weave}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Jewellery Pairing */}
                <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs">
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#1C1B19] flex items-center gap-1.5">
                    <Gem className="h-3.5 w-3.5 text-[#B79B63]" />
                    <span>Traditional Jewellery Pairing:</span>
                  </h4>
                  <ul className="space-y-1 text-[#5C5549]">
                    {activeStyle.jewelleryPairing.map((j, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[#2D6A4F]" />
                        <span>{j}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right 8 Cols: Step-by-Step Drape Walkthrough */}
              <div className="lg:col-span-8 space-y-6">
                <p className="text-xs sm:text-sm text-[#5C5549] leading-relaxed">
                  {activeStyle.description}
                </p>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#B79B63]">
                    Step-by-Step Draping Masterclass
                  </h4>

                  <div className="space-y-3">
                    {activeStyle.steps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-[#1C1B19] text-[#FAF7F2] text-[10px] font-bold flex items-center justify-center shrink-0">
                            {st.stepNumber}
                          </span>
                          <h5 className="font-serif font-semibold text-sm text-[#1C1B19]">
                            {st.title}
                          </h5>
                        </div>
                        <p className="text-xs text-[#5C5549] leading-relaxed pl-7">
                          {st.instruction}
                        </p>
                        {st.proTip && (
                          <div className="ml-7 mt-2 p-2 bg-amber-50/70 border-l-2 border-[#B79B63] text-[11px] text-amber-900 flex items-start gap-1.5">
                            <Info className="h-3.5 w-3.5 text-[#B79B63] shrink-0 mt-0.5" />
                            <span>
                              <strong>Master Draper Secret:</strong> {st.proTip}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro Tips Banner */}
                <div className="p-4 bg-[#FAF7F2] border border-[#B79B63]/40 space-y-2 text-xs">
                  <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#B79B63]">
                    Atelier Finishing Touch
                  </h4>
                  <ul className="space-y-1 text-[#5C5549]">
                    {activeStyle.proTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Shoppable Link */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#8C867D]">Ready to style your look?</span>
                  <Link
                    href={activeStyle.recommendedCategoryLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C1B19] text-[#FAF7F2] text-xs font-semibold hover:bg-[#B79B63] transition-colors"
                  >
                    <span>Explore Handloom Sarees for this Drape</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE PLEAT & PINNING CALCULATOR */}
        <section className="bg-white border border-[#E8E2D8] p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs uppercase tracking-wider font-semibold">
              <Calculator className="h-3.5 w-3.5" />
              <span>Smart Drape Calculator</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19]">
              Interactive Pleat &amp; Pinning Calculator
            </h2>
            <p className="text-xs text-[#8C867D]">
              Select your handloom fabric weight and your height to compute the exact pleat width,
              pleat count, and safety pin placements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Input Controls */}
            <div className="space-y-5 p-5 bg-[#FAF7F2] border border-[#E8E2D8]">
              <h3 className="font-serif text-base font-medium text-[#1C1B19]">
                1. Specify Your Parameters
              </h3>

              {/* Fabric Choice */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
                  Saree Fabric / Weight:
                </label>
                <select
                  value={calcFabric}
                  onChange={(e) => setCalcFabric(e.target.value as FabricChoice)}
                  className="w-full p-2.5 bg-white border border-[#E8E2D8] text-xs text-[#1C1B19] focus:border-[#B79B63] outline-none"
                >
                  <option value="heavy_kanchipuram">
                    Kanchipuram 3-Ply Pure Silk (Heavy Zari Korvai)
                  </option>
                  <option value="banarasi_katan">Banarasi Katan Silk (Kadhwa Weave)</option>
                  <option value="paithani_heavy">Yeola Paithani Silk (Solid Zari Pallu)</option>
                  <option value="light_organza">Pure Organza &amp; Metallic Tissue (Sheer)</option>
                  <option value="fluid_satin">Mysore Crepe / Fluid Silk Satin</option>
                </select>
              </div>

              {/* Height Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
                  Your Height (Including Planned Heels):
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { label: "5'0\" (152 cm)", inches: 60 },
                    { label: "5'2\" (157 cm)", inches: 62 },
                    { label: "5'4\" (163 cm)", inches: 64 },
                    { label: "5'6\" (168 cm)", inches: 66 },
                    { label: "5'8\" (173 cm)", inches: 68 },
                    { label: "5'10\"+ (178 cm+)", inches: 70 },
                  ].map((h) => (
                    <button
                      key={h.inches}
                      type="button"
                      onClick={() => setCalcHeightInches(h.inches)}
                      className={`p-2 border text-center transition-all ${
                        calcHeightInches === h.inches
                          ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19] font-semibold"
                          : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Results Card */}
            <div className="space-y-4 p-5 bg-[#FAF7F2] border-2 border-[#B79B63] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                  <h3 className="font-serif text-base font-medium text-[#1C1B19]">
                    2. Recommended Formula
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[#2D6A4F] bg-[#2D6A4F]/10 px-2 py-0.5">
                    Atelier Calibrated
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-4 text-xs">
                  <div className="p-3 bg-white border border-[#E8E2D8]">
                    <span className="block text-[10px] uppercase text-[#8C867D]">
                      Recommended Pleat Count
                    </span>
                    <span className="font-serif text-xl font-bold text-[#1C1B19]">
                      {calcResult.recommendedPleatCount} Pleats
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-[#E8E2D8]">
                    <span className="block text-[10px] uppercase text-[#8C867D]">
                      Optimal Pleat Width
                    </span>
                    <span className="font-serif text-xl font-bold text-[#1C1B19]">
                      {calcResult.pleatWidthInches} Inches
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-[#E8E2D8] col-span-2">
                    <span className="block text-[10px] uppercase text-[#8C867D]">
                      Petticoat / Underskirt Match
                    </span>
                    <span className="font-medium text-[#1C1B19] mt-0.5 block">
                      {calcResult.recommendedPetticoat}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-[#E8E2D8]">
                    <span className="block text-[10px] uppercase text-[#8C867D]">
                      Total Safety Pins Needed
                    </span>
                    <span className="font-semibold text-[#1C1B19]">
                      {calcResult.pinCount} Pins (with beads)
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-[#E8E2D8]">
                    <span className="block text-[10px] uppercase text-[#8C867D]">
                      Floor Hem Clearance
                    </span>
                    <span className="font-semibold text-[#1C1B19]">0.5 Inch Above Ground</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border-l-2 border-[#B79B63] text-xs text-[#5C5549]">
                <strong className="text-[#1C1B19]">Master Draper Note: </strong>
                {calcResult.proAdvice}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE 4 CARDINAL RULES OF ZERO-DAMAGE ZARI PINNING */}
        <section className="bg-[#1C1B19] text-[#FAF7F2] p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B79B63]">
              Atelier Archival Protocol
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              The 4 Rules of Zero-Damage Zari Pinning
            </h2>
            <p className="text-xs text-[#A69E92]">
              How to secure heavy pure silk sarees for hours without tearing yarns or puncturing
              precious silver and gold zari wires.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 bg-[#262420] border border-[#3E3A34] space-y-2">
              <span className="h-6 w-6 rounded-full bg-[#B79B63]/20 text-[#B79B63] text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-semibold text-white text-sm">Pin the Inner Seam Lining</h3>
              <p className="text-[#A69E92] leading-relaxed">
                Never force a safety pin directly through pure zari threads. Always pass the pin
                through the unstitched blouse piece border or inner muslin backing.
              </p>
            </div>

            <div className="p-5 bg-[#262420] border border-[#3E3A34] space-y-2">
              <span className="h-6 w-6 rounded-full bg-[#B79B63]/20 text-[#B79B63] text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-semibold text-white text-sm">Use Pearl Pin Shields</h3>
              <p className="text-[#A69E92] leading-relaxed">
                Slip a small pearl bead or piece of tape onto the pin before closing. This prevents
                fine silk threads from catching in the small coil spring at the base.
              </p>
            </div>

            <div className="p-5 bg-[#262420] border border-[#3E3A34] space-y-2">
              <span className="h-6 w-6 rounded-full bg-[#B79B63]/20 text-[#B79B63] text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-semibold text-white text-sm">2 Inches Behind Shoulder</h3>
              <p className="text-[#A69E92] leading-relaxed">
                Anchor the shoulder pin 2 inches behind the blouse shoulder seam rather than on top.
                This anchors the weight against your back and stops the pallu sliding forward.
              </p>
            </div>

            <div className="p-5 bg-[#262420] border border-[#3E3A34] space-y-2">
              <span className="h-6 w-6 rounded-full bg-[#B79B63]/20 text-[#B79B63] text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="font-semibold text-white text-sm">Vertical Pin Insertion</h3>
              <p className="text-[#A69E92] leading-relaxed">
                Always insert pins vertically (pointing down) rather than horizontally. Vertical
                pins bear the downward pull of gravity without distorting horizontal pleats.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: 1-ON-1 VIRTUAL DRAPE CONSULTATION CTA */}
        <section className="bg-white border-2 border-[#B79B63] p-8 sm:p-12 text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-full bg-[#FAF7F2] border border-[#B79B63] flex items-center justify-center text-[#B79B63]">
            <Video className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19]">
            Want a Live 1-on-1 Drape Walkthrough with Our Master Draper?
          </h2>
          <p className="text-xs sm:text-sm text-[#8C867D] max-w-xl mx-auto">
            Book a complimentary virtual styling appointment. Our master drapers will demonstrate
            how to pleat your chosen saree over video call, tailored to your height and wedding
            occasion.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/video-shopping"
              className="px-6 py-2.5 bg-[#1C1B19] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#B79B63] transition-colors"
            >
              Book Virtual Styling Session
            </Link>
            <Link
              href="/appointments"
              className="px-6 py-2.5 border border-[#1C1B19] text-[#1C1B19] text-xs uppercase tracking-wider font-semibold hover:bg-[#FAF7F2] transition-colors"
            >
              Visit Hyderabad Atelier
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
