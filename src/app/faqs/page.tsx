import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Frequently Asked Questions — Sreesha Elegance",
  description:
    "Everything you need to know about Silk Mark tags, custom blouse tailoring, shipping timelines across India, and exchanges.",
});

export default function FaqsPage() {
  const faqs = [
    {
      q: "Are all your silk sarees Silk Mark certified?",
      a: "Yes. Every Kanchipuram, Banarasi, and Paithani pure silk weave sold at Sreesha Elegance comes attached with an authorized Silk Mark tag issued by the Silk Mark Organisation of India (SMOI), verifying 100% genuine natural silk filament.",
    },
    {
      q: "How does bespoke blouse stitching work?",
      a: "When ordering a saree, you can select 'Bespoke Custom Tailored Blouse'. After placing your order, our master tailoring concierge connects with you over WhatsApp or video call to confirm your exact measurements, neckline preferences, sleeve length, and padding choices.",
    },
    {
      q: "What is your shipping policy and delivery timeline across India?",
      a: "We offer complimentary express shipping across India on all orders above ₹2,999. In-stock pieces are dispatched within 24 to 48 hours via BlueDart or Delhivery Air Cargo, reaching major metros within 2-4 business days. Custom tailored orders require an additional 4-6 business days.",
    },
    {
      q: "What is your return and exchange policy?",
      a: "We offer a 7-day hassle-free exchange policy on unworn, unaltered sarees and readymade ensembles with tags intact. We provide doorstep courier pickup across major Indian PIN codes. Note that custom-stitched blouses and bespoke made-to-measure bridal lehengas are non-returnable once altered.",
    },
    {
      q: "Can I book a video consultation to see the sarees in real-time?",
      a: "Absolutely! We encourage virtual styling appointments. Our Banjara Hills stylists will drape the sarees under true daylight illumination and show pallu detailing, zari lustre, and blouse contrast before you finalize your order.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major Indian payment methods powered securely by Razorpay: UPI (Google Pay, PhonePe, Paytm), RuPay, Visa, Mastercard, NetBanking across all major banks, and EMI options on eligible credit cards.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-medium">
          Assistance &amp; Clarity
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1C1B19]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5650] max-w-md mx-auto">
          Clear answers about authentic handloom fabrics, sizing, delivery timelines, and care.
        </p>
      </div>

      <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-[#E8E2D8] pb-2">
              <AccordionTrigger className="text-sm font-medium text-[#1C1B19] text-left hover:text-[#B79B63]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-[#5A5650] leading-relaxed pt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
