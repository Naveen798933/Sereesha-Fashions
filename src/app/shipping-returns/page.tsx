import { Truck, RotateCcw } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Shipping & Returns Policy — Sreesha Elegance",
  description:
    "Complimentary express shipping across India on orders above ₹2,999. 7-day hassle-free exchange policy with doorstep pickup.",
});

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-medium">
          Client Care
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1C1B19]">Shipping &amp; Returns</h1>
        <p className="text-xs sm:text-sm text-[#5A5650] max-w-md mx-auto">
          Transparent dispatch policies, insured express transit, and simple exchange guidelines.
        </p>
      </div>

      <div className="space-y-8 bg-white border border-[#E8E2D8] p-6 sm:p-10 text-xs sm:text-sm text-[#5A5650] leading-relaxed">
        {/* Shipping section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 text-[#1C1B19]">
            <Truck className="h-5 w-5 text-[#B79B63]" />
            <h2 className="font-serif text-2xl font-normal">
              Shipping Policy &amp; Delivery Timelines
            </h2>
          </div>
          <p>
            We take extreme care in packaging your heirloom ensembles. Every order is encased in a
            protective breathable dust bag and boxed in our signature gold-stamped luxury hard-box.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Complimentary Shipping:</strong> Free express courier across India on all
              orders exceeding ₹2,999. Orders below ₹2,999 incur a flat ₹150 nominal shipping fee.
            </li>
            <li>
              <strong>Ready to Ship Pieces:</strong> Dispatched from our Kukatpally atelier within
              24 to 48 hours. Transit takes 2-4 business days for major metros (Hyderabad,
              Bengaluru, Chennai, Mumbai, Delhi) and 4-6 days for rest of India.
            </li>
            <li>
              <strong>Custom Tailoring Orders:</strong> Saree blouse stitching and bespoke
              made-to-measure lehengas require an additional 4 to 8 business days for master
              tailoring.
            </li>
            <li>
              <strong>Full Transit Insurance:</strong> All shipments are fully insured against loss
              or damage until verified delivery signature.
            </li>
          </ul>
        </section>

        <div className="w-full h-px bg-[#E8E2D8]" />

        {/* Returns section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 text-[#1C1B19]">
            <RotateCcw className="h-5 w-5 text-[#B79B63]" />
            <h2 className="font-serif text-2xl font-normal">7-Day Hassle-Free Exchange Policy</h2>
          </div>
          <p>
            We want you to be absolutely delighted with your ensemble. If for any reason you wish to
            exchange an item, we facilitate a swift and seamless process.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Eligibility Window:</strong> You may request an exchange within 7 calendar
              days of receipt.
            </li>
            <li>
              <strong>Condition of Garments:</strong> The piece must be unused, unwashed, unaltered,
              and with all original brand tags and Silk Mark tags intact.
            </li>
            <li>
              <strong>Doorstep Pickup:</strong> We arrange reverse pickup via our logistics partners
              directly from your delivery address.
            </li>
            <li>
              <strong>Custom Alterations Note:</strong> In accordance with luxury atelier standards,
              blouses that have been custom stitched or lehengas altered to custom body measurements
              are non-returnable.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
