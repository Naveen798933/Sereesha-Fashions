import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Terms & Conditions — Sreesha Elegance Hyderabad",
  description:
    "Terms of service, handloom craftsmanship authenticity disclosures, and governing jurisdiction for Sreesha Elegance.",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-[#E8E2D8] pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-medium">
          Legal &amp; Terms
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19] mt-1">
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-[#8C867D] mt-1">
          Last Updated: October 2026 • Jurisdiction: Hyderabad, India
        </p>
      </div>

      <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-[#5A5650] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1C1B19]">1. Agreement to Terms</h2>
          <p>
            By visiting or purchasing through Sreesha Elegance (&quot;sreeshaelegance.com&quot;),
            you agree to be bound by these Terms and Conditions. Please review them carefully before
            placing an order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1C1B19]">
            2. Handloom Authenticity &amp; Natural Variations
          </h2>
          <p>
            Our sarees and textiles are woven on manual handlooms by traditional artisans. Slight
            irregularities in weaving knots, slubs, or minor color variations between digital
            screens and natural fabrics are authentic hallmarks of genuine handwoven craftsmanship,
            not manufacturing flaws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1C1B19]">3. Pricing &amp; Currency</h2>
          <p>
            All prices listed on the storefront are denominated in Indian Rupees (INR) and are
            inclusive of Goods and Services Tax (GST) unless explicitly indicated otherwise.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1C1B19]">4. Intellectual Property</h2>
          <p>
            All trademarks, logos, boutique crests, campaign imagery, editorial lookbooks, and
            textile descriptions are the exclusive intellectual property of Sreesha Elegance.
            Unauthorized reproduction is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1C1B19]">5. Governing Jurisdiction</h2>
          <p>
            Any disputes arising from or connected with orders placed through Sreesha Elegance shall
            be subject to the exclusive jurisdiction of the competent courts in{" "}
            <strong>Hyderabad, Telangana, India</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
