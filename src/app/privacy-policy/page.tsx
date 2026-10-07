import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Privacy Policy — Sreesha Elegance (DPDP Act Aligned)",
  description:
    "Privacy and data protection policy in accordance with the Digital Personal Data Protection Act (DPDP Act, India).",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-[#E8E2D8] pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-medium">
          Legal &amp; Governance
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19] mt-1">Privacy Policy</h1>
        <p className="text-xs text-[#8C867D] mt-1">
          Last Updated: October 2026 • DPDP Act (India) Aligned
        </p>
      </div>

      <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-[#5A5650] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1C1B19]">1. Commitment to Data Protection</h2>
          <p>
            Sreesha Elegance (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operating its
            boutique atelier at Opp, JNTU Rd, HMT Hills, Kukatpally, Hyderabad, Telangana 500085,
            respects your digital privacy. This policy outlines how we collect, store, and process
            personal data in accordance with the Digital Personal Data Protection (DPDP) Act, 2023
            of India.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1C1B19]">2. Information We Collect</h2>
          <p>
            When you browse or purchase from our website, we collect only necessary commercial
            information:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Contact Identifiers:</strong> Name, delivery address, phone number, and email
              address.
            </li>
            <li>
              <strong>Order History:</strong> Ensembles purchased, custom blouse sizing preferences,
              and shipment records.
            </li>
            <li>
              <strong>Payment Information:</strong> We do NOT store debit/credit card numbers or UPI
              PINs on our servers. All financial transactions are encrypted and processed directly
              by RBI-licensed payment aggregators (Razorpay).
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1C1B19]">3. Purpose of Processing</h2>
          <p>Your data is processed strictly for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Tailoring, packaging, and dispatching your couture orders via courier partners.</li>
            <li>Providing order notifications, OTP verifications, and delivery updates.</li>
            <li>Offering customized boutique concierge support and styling recommendations.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-[#1C1B19]">4. Your Rights Under the DPDP Act</h2>
          <p>
            You hold the right to access a summary of personal data held with us, request
            corrections or updates to your delivery addresses, and request deletion of your client
            account by writing to our Data Protection Officer at{" "}
            <strong>care@sreeshaelegance.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
