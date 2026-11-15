"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Award,
  Sparkles,
  Search,
  CheckCircle2,
  Printer,
  Share2,
  ExternalLink,
  Info,
  MapPin,
  Flame,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import {
  AuthenticityCertificate,
  GI_CLUSTERS,
  SILK_TESTING_PROTOCOLS,
  verifyHandloomCertificate,
} from "@/lib/authenticity";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

function AuthenticityContent() {
  const searchParams = useSearchParams();
  const initialQuery =
    searchParams.get("query") ||
    searchParams.get("cert") ||
    searchParams.get("slug") ||
    searchParams.get("id") ||
    "SM-2024-8849";

  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [activeCertificate, setActiveCertificate] = React.useState<AuthenticityCertificate | null>(
    null
  );
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [selectedClusterId, setSelectedClusterId] = React.useState(GI_CLUSTERS[0].id);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"certificate" | "atlas" | "testing">(
    "certificate"
  );

  const runVerification = React.useCallback((queryToRun: string) => {
    if (!queryToRun.trim()) {
      setActiveCertificate(null);
      setErrorMessage("Please enter an 8-digit certificate number or product code.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    // Simulate verification cryptographic validation
    setTimeout(() => {
      const found = verifyHandloomCertificate(queryToRun.trim());
      if (found) {
        setActiveCertificate(found);
        setErrorMessage(null);
      } else {
        setActiveCertificate(null);
        setErrorMessage(
          `No handloom certificate found matching "${queryToRun}". Please check the tag on your saree or try a sample certificate below.`
        );
      }
      setIsVerifying(false);
    }, 250);
  }, []);

  // Run on mount with initial query
  React.useEffect(() => {
    if (initialQuery) {
      runVerification(initialQuery);
    }
  }, [initialQuery, runVerification]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(searchQuery);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (!activeCertificate) return;
    const url = `${window.location.origin}/authenticity?cert=${activeCertificate.certificateNumber}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      showToast.success("Verification link copied to clipboard");
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleWhatsAppShare = () => {
    if (!activeCertificate) return;
    const url = `${window.location.origin}/authenticity?cert=${activeCertificate.certificateNumber}`;
    const text = `Verified Silk Mark Certificate for ${activeCertificate.productTitle} (${activeCertificate.certificateNumber}) at Sreesha Elegance Atelier: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const selectedCluster = GI_CLUSTERS.find((c) => c.id === selectedClusterId) || GI_CLUSTERS[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1B19]">
      {/* Printable styles isolation */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #atelier-official-certificate,
          #atelier-official-certificate * {
            visibility: visible !important;
          }
          #atelier-official-certificate {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            box-shadow: none !important;
            border: 3px double #b79b63 !important;
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B79B63]/10 border border-[#B79B63]/30 text-[#B79B63] text-xs uppercase tracking-[0.2em] font-medium">
            <Award className="h-3.5 w-3.5" />
            <span>Official Silk Mark &amp; GI Tag Registry</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
            Handloom Authenticity &amp; Provenance
          </h1>

          <p className="text-xs sm:text-base text-[#C7BEAF] max-w-2xl mx-auto leading-relaxed">
            Every heirloom silk saree at Sreesha Elegance is certified by the Silk Mark Organization
            of India (SMOI) and woven under protected Geographical Indication (GI) guilds. Verify
            your piece&apos;s master weaver lineage, zari purity, and loom pedigree below.
          </p>

          {/* Verification Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-2 bg-[#262420] p-2 border border-[#3E3A34] focus-within:border-[#B79B63] transition-colors"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-[#8C867D]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Certificate No (e.g. SM-2024-8849) or Saree Slug"
                  className="w-full bg-transparent pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#8C867D] outline-none"
                />
              </div>
              <Button
                type="submit"
                variant="gold"
                disabled={isVerifying}
                className="px-6 py-2.5 text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verify Certificate</span>
                  </>
                )}
              </Button>
            </form>

            {/* Quick Sample Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-[#A69E92]">
              <span className="text-[#8C867D]">Try sample certificates:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("SM-2024-8849");
                  runVerification("SM-2024-8849");
                }}
                className="px-2 py-0.5 bg-[#262420] border border-[#3E3A34] hover:border-[#B79B63] hover:text-[#B79B63] transition-colors"
              >
                SM-2024-8849 (Kanchipuram)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("SM-2024-7123");
                  runVerification("SM-2024-7123");
                }}
                className="px-2 py-0.5 bg-[#262420] border border-[#3E3A34] hover:border-[#B79B63] hover:text-[#B79B63] transition-colors"
              >
                SM-2024-7123 (Banarasi Katan)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("SM-2024-4091");
                  runVerification("SM-2024-4091");
                }}
                className="px-2 py-0.5 bg-[#262420] border border-[#3E3A34] hover:border-[#B79B63] hover:text-[#B79B63] transition-colors"
              >
                SM-2024-4091 (Paithani Royal)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-[#E8E2D8] sticky top-0 z-20 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 text-xs font-medium uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("certificate")}
              className={`py-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "certificate"
                  ? "border-[#B79B63] text-[#1C1B19]"
                  : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-[#B79B63]" />
              <span>Verified Certificate Dossier</span>
            </button>
            <button
              onClick={() => setActiveTab("atlas")}
              className={`py-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "atlas"
                  ? "border-[#B79B63] text-[#1C1B19]"
                  : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
              }`}
            >
              <MapPin className="h-4 w-4 text-[#2D6A4F]" />
              <span>GI Weave Atlas</span>
            </button>
            <button
              onClick={() => setActiveTab("testing")}
              className={`py-4 border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "testing"
                  ? "border-[#B79B63] text-[#1C1B19]"
                  : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
              }`}
            >
              <Flame className="h-4 w-4 text-[#B79B63]" />
              <span>Pure Silk Testing Laboratory</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* TAB 1: CERTIFICATE DOSSIER */}
        {activeTab === "certificate" && (
          <div className="space-y-10">
            {errorMessage && (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 max-w-3xl mx-auto">
                <Info className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Notice</p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {activeCertificate && (
              <div className="space-y-6">
                {/* Action Bar for Certificate */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#E8E2D8] no-print">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2D6A4F]" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-[#2D6A4F]">
                        Status: {activeCertificate.status}
                      </p>
                      <p className="text-[11px] text-[#8C867D]">
                        Issued by Sreesha Elegance Atelier • SMOI Certified
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print / PDF</span>
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleWhatsAppShare}
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </Button>
                    <Link
                      href={`/women/sarees/${activeCertificate.productSlug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1B19] text-[#FAF7F2] text-xs font-medium hover:bg-[#B79B63] transition-colors"
                    >
                      <span>View in Boutique</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                {/* THE OFFICIAL CERTIFICATE (Printable Document) */}
                <div
                  id="atelier-official-certificate"
                  className="bg-white border-8 border-double border-[#B79B63] p-6 sm:p-12 shadow-md relative overflow-hidden"
                >
                  {/* Subtle Ornamental Corner Accents */}
                  <div className="absolute top-2 left-2 text-[#B79B63] text-lg select-none">❖</div>
                  <div className="absolute top-2 right-2 text-[#B79B63] text-lg select-none">❖</div>
                  <div className="absolute bottom-2 left-2 text-[#B79B63] text-lg select-none">
                    ❖
                  </div>
                  <div className="absolute bottom-2 right-2 text-[#B79B63] text-lg select-none">
                    ❖
                  </div>

                  {/* Header Crest & Titles */}
                  <div className="text-center pb-8 border-b border-[#E8E2D8] space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#B79B63] font-semibold">
                      Atelier Sreesha Elegance • Hyderabad
                    </p>
                    <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1B19] font-normal tracking-wide">
                      Certificate of Handloom Authenticity
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8C867D] max-w-xl mx-auto italic font-serif">
                      This official certificate attests that the heirloom textile referenced herein
                      is 100% pure natural silk, handwoven under authenticated Geographical
                      Indication protocols.
                    </p>
                  </div>

                  {/* Badges Bar: Silk Mark & GI Seal */}
                  <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-[#E8E2D8] bg-[#FAF7F2]/60 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full border-2 border-[#2D6A4F] bg-white flex items-center justify-center text-[#2D6A4F]">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1C1B19]">
                          Silk Mark Organization of India
                        </p>
                        <p className="text-[11px] text-[#2D6A4F] font-mono font-medium">
                          TAG: {activeCertificate.silkMarkTagNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full border-2 border-[#B79B63] bg-white flex items-center justify-center text-[#B79B63]">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1C1B19]">
                          Geographical Indication
                        </p>
                        <p className="text-[11px] text-[#B79B63] font-mono font-medium">
                          {activeCertificate.giTagNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                        Certificate No
                      </p>
                      <p className="text-sm sm:text-base font-serif font-bold text-[#1C1B19] tracking-wider">
                        {activeCertificate.certificateNumber}
                      </p>
                    </div>
                  </div>

                  {/* Body Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 border-b border-[#E8E2D8]">
                    {/* Saree Thumbnail */}
                    <div className="space-y-3">
                      <div className="relative aspect-[3/4] w-full bg-[#FAF7F2] border border-[#E8E2D8] overflow-hidden">
                        <Image
                          src={activeCertificate.primaryImage}
                          alt={activeCertificate.productTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-serif text-base text-[#1C1B19] font-medium">
                          {activeCertificate.productTitle}
                        </h3>
                        <p className="text-[11px] text-[#8C867D]">
                          Origin: {activeCertificate.clusterOrigin}
                        </p>
                      </div>
                    </div>

                    {/* Loom & Fiber Specifications Table */}
                    <div className="lg:col-span-2 space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#B79B63]">
                        Technical Weaving Specifications
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8]">
                          <span className="block text-[10px] uppercase text-[#8C867D]">
                            Fabric Purity
                          </span>
                          <span className="font-medium text-[#1C1B19]">
                            {activeCertificate.fabric}
                          </span>
                        </div>

                        <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8]">
                          <span className="block text-[10px] uppercase text-[#8C867D]">
                            Weave Technique
                          </span>
                          <span className="font-medium text-[#1C1B19]">
                            {activeCertificate.weave}
                          </span>
                        </div>

                        <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8]">
                          <span className="block text-[10px] uppercase text-[#8C867D]">
                            Loom Apparatus
                          </span>
                          <span className="font-medium text-[#1C1B19]">
                            {activeCertificate.loomType}
                          </span>
                        </div>

                        <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8]">
                          <span className="block text-[10px] uppercase text-[#8C867D]">
                            Warp &amp; Weft Count
                          </span>
                          <span className="font-medium text-[#1C1B19]">
                            {activeCertificate.warpWeft}
                          </span>
                        </div>

                        <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8] sm:col-span-2">
                          <span className="block text-[10px] uppercase text-[#8C867D]">
                            Zari Purity &amp; Composition
                          </span>
                          <span className="font-medium text-[#1C1B19] block">
                            {activeCertificate.zariComposition}
                          </span>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#B79B63]/10 text-[#B79B63] text-[10px] font-semibold">
                            {activeCertificate.zariType}
                          </span>
                        </div>

                        <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8]">
                          <span className="block text-[10px] uppercase text-[#8C867D]">
                            Master Weaver Guild
                          </span>
                          <span className="font-medium text-[#1C1B19]">
                            {activeCertificate.weaversSociety}
                          </span>
                        </div>

                        <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8]">
                          <span className="block text-[10px] uppercase text-[#8C867D]">
                            Artisan Labor Hours
                          </span>
                          <span className="font-medium text-[#1C1B19]">
                            {activeCertificate.weavingHours} Man-Hours (
                            {Math.round(activeCertificate.weavingHours / 8)} Days)
                          </span>
                        </div>
                      </div>

                      {/* Care Guidelines */}
                      <div className="pt-2">
                        <h4 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#1C1B19] mb-2">
                          Atelier Preservation Protocol
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#5C5549]">
                          {activeCertificate.careProtocols.map((protocol, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                              <span>{protocol}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Signatures & Seal Footer */}
                  <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                        Cryptographic Verification Hash
                      </p>
                      <p className="font-mono text-[11px] text-[#8C867D] bg-[#FAF7F2] px-2 py-1 border border-[#E8E2D8]">
                        {activeCertificate.verificationHash}
                      </p>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="h-10 border-b border-dashed border-[#8C867D] mb-1 flex items-end justify-center font-serif italic text-sm text-[#1C1B19]">
                          Sreesha
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                          Master Curator Sign
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="h-10 w-10 mx-auto rounded-full border-2 border-double border-[#B79B63] flex items-center justify-center text-[#B79B63] text-xs font-serif font-bold">
                          SE
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-[#8C867D] mt-1">
                          Official Seal
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GEOGRAPHICAL INDICATION (GI) WEAVE ATLAS */}
        {activeTab === "atlas" && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#2D6A4F]">
                India Handloom Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B19]">
                Geographical Indication (GI) Weave Atlas
              </h2>
              <p className="text-xs sm:text-sm text-[#8C867D]">
                A Geographical Indication (GI) is a sovereign intellectual property right granted by
                the Government of India certifying that a handloom possesses qualities and
                reputation originating exclusively from its traditional geographic cluster.
              </p>
            </div>

            {/* Cluster Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#E8E2D8] pb-4">
              {GI_CLUSTERS.map((cluster) => (
                <button
                  key={cluster.id}
                  onClick={() => setSelectedClusterId(cluster.id)}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-all ${
                    selectedClusterId === cluster.id
                      ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                      : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                  }`}
                >
                  {cluster.name} ({cluster.state})
                </button>
              ))}
            </div>

            {/* Selected Cluster Deep Dive Card */}
            <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-[#2D6A4F] font-semibold">
                    {selectedCluster.state} • Recognized in {selectedCluster.giYear}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] mt-0.5">
                    {selectedCluster.name}
                  </h3>
                </div>
                <div className="px-3 py-1.5 bg-[#FAF7F2] border border-[#B79B63] text-xs font-mono font-semibold text-[#B79B63]">
                  {selectedCluster.giNumber}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed text-[#5C5549]">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1C1B19] mb-1">
                      Historical Provenance
                    </h4>
                    <p>{selectedCluster.originHistory}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1C1B19] mb-1">
                      Hallmark Weaving Technique
                    </h4>
                    <p>{selectedCluster.hallmarkTechnique}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1C1B19] mb-1">
                      Zari &amp; Metallic Standard
                    </h4>
                    <p>{selectedCluster.zariStandard}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1C1B19] mb-1">
                      Loom Apparatus &amp; Artisan Guild
                    </h4>
                    <p>{selectedCluster.loomTradition}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
                <span className="text-[#8C867D]">
                  Curated by Sreesha Elegance Master Weavers in Hyderabad
                </span>
                <Link
                  href="/women/sarees"
                  className="text-[#B79B63] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore {selectedCluster.name} Sarees</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PURE SILK TESTING LABORATORY */}
        {activeTab === "testing" && (
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#B79B63]">
                Artisan Quality Field Guide
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B19]">
                The 4 Pure Silk Laboratory Tests
              </h2>
              <p className="text-xs sm:text-sm text-[#8C867D]">
                How connoisseurs and master weavers separate genuine natural mulberry silk from
                polyester, art-silk, and viscose blends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SILK_TESTING_PROTOCOLS.map((test) => (
                <div
                  key={test.id}
                  className="bg-white border border-[#E8E2D8] p-6 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <h3 className="font-serif text-lg font-medium text-[#1C1B19]">{test.title}</h3>
                    <p className="text-xs text-[#8C867D]">{test.description}</p>

                    <div className="p-3 bg-[#FAF7F2] border-l-2 border-[#2D6A4F] text-xs">
                      <span className="block font-semibold text-[#2D6A4F] mb-1">
                        ✓ Pure Silk Reaction:
                      </span>
                      <p className="text-[#1C1B19] leading-relaxed">{test.pureSilkResult}</p>
                    </div>

                    <div className="p-3 bg-red-50/50 border-l-2 border-red-300 text-xs">
                      <span className="block font-semibold text-red-800 mb-1">
                        ✗ Synthetic / Art-Silk Reaction:
                      </span>
                      <p className="text-red-900 leading-relaxed">{test.syntheticResult}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D8] text-[11px] text-[#8C867D]">
                    <span className="font-medium text-[#1C1B19]">Scientific Principle: </span>
                    {test.scientificPrinciple}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Heritage Trust Banner */}
        <section className="mt-16 bg-[#1C1B19] text-[#FAF7F2] p-8 sm:p-12 text-center space-y-4 no-print">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#B79B63]/10 text-[#B79B63] mx-auto border border-[#B79B63]/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
            Have a Specific Silk Saree to Verify?
          </h2>
          <p className="text-xs sm:text-sm text-[#A69E92] max-w-xl mx-auto">
            Our atelier curators can inspect your handloom certificate, zari wire purity, and loom
            origin via a dedicated 1-on-1 virtual concierge call.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/appointments"
              className="px-6 py-2.5 bg-[#B79B63] text-[#1C1B19] text-xs uppercase tracking-wider font-semibold hover:bg-[#a68a52] transition-colors"
            >
              Book Atelier Consultation
            </Link>
            <a
              href="https://wa.me/916281344628?text=Hello%20Sreesha%20Elegance,%20I%20would%20like%20to%20verify%20a%20handloom%20saree%20certificate"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 border border-[#3E3A34] text-white text-xs uppercase tracking-wider font-medium hover:border-[#25D366] hover:text-[#25D366] transition-colors"
            >
              WhatsApp Concierge
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AuthenticityPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#8C867D]">
              Loading Handloom Authenticity Registry...
            </p>
          </div>
        </div>
      }
    >
      <AuthenticityContent />
    </React.Suspense>
  );
}
