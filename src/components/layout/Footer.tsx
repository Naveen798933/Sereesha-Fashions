"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Lock, Award, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" fill="currentColor" stroke="none" />
  </svg>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#1C1B19] text-[#FAF7F2] border-t border-[#2E2C28] pt-16 pb-28 lg:pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Badges (Luxury assurances) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-14 border-b border-[#2E2C28] text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="h-10 w-10 border border-[#B79B63] flex items-center justify-center text-[#B79B63] shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-medium text-white">
                Authentic Craftsmanship
              </h4>
              <p className="text-[11px] text-[#A69E92] mt-0.5">
                Handpicked pure weaves & certified silk marks
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="h-10 w-10 border border-[#B79B63] flex items-center justify-center text-[#B79B63] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-medium text-white">
                Boutique Fitting Guarantee
              </h4>
              <p className="text-[11px] text-[#A69E92] mt-0.5">
                Custom tailoring & hassle-free 7-day exchanges
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="h-10 w-10 border border-[#B79B63] flex items-center justify-center text-[#B79B63] shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.16em] font-medium text-white">
                Secure Indian Checkouts
              </h4>
              <p className="text-[11px] text-[#A69E92] mt-0.5">
                Encrypted UPI, Cards, NetBanking via Razorpay
              </p>
            </div>
          </div>
        </div>

        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-[#2E2C28]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Sreesha Elegance"
                width={140}
                height={56}
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-[#A69E92] leading-relaxed max-w-sm">
              Rooted in the royal heritage of Hyderabad, Sreesha Elegance blends timeless Indian
              weaves with contemporary grace. Each ensemble is crafted for the modern woman who
              embraces elegance with confidence.
            </p>

            <div className="pt-2 text-xs text-[#C7BEAF] space-y-1">
              <p className="font-medium text-white">Hyderabad Flagship Atelier:</p>
              <p>Road No. 10, Banjara Hills, Hyderabad, Telangana 500034</p>
              <p>Concierge: +91 98765 43210 • care@sreeshaelegance.com</p>
            </div>
          </div>

          {/* Col 1: Shop */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-[#B79B63]">
              The Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A69E92]">
              <li>
                <Link href="/women/sarees" className="hover:text-white transition-colors">
                  Kanchipuram & Silk Sarees
                </Link>
              </li>
              <li>
                <Link href="/women/lehengas" className="hover:text-white transition-colors">
                  Bridal & Festive Lehengas
                </Link>
              </li>
              <li>
                <Link href="/women/kurtis" className="hover:text-white transition-colors">
                  Designer Kurtis & Anarkalis
                </Link>
              </li>
              <li>
                <Link href="/contemporary" className="hover:text-white transition-colors">
                  Contemporary Silhouettes
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  The Royal Nizam Edit
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Customer Care */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-[#B79B63]">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A69E92]">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Atelier Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Boutique
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter / Connect */}
          <div className="space-y-4 text-left">
            <h4 className="text-xs uppercase tracking-[0.18em] font-medium text-[#B79B63]">
              The Atelier Journal
            </h4>
            <p className="text-xs text-[#A69E92] leading-relaxed">
              Receive private invitations to preview new bridal edits, festive launches, and
              boutique trunk shows.
            </p>

            {subscribed ? (
              <p className="text-xs text-[#B79B63] font-medium py-2">
                Thank you. You have been added to our private guestlist.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex border border-[#3E3A34] focus-within:border-[#B79B63] transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-[#8C867D] outline-none"
                    aria-label="Email address for newsletter"
                  />
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    className="h-auto px-3 text-[10px]"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-[10px] text-[#8C867D]">
                  By signing up, you agree to our privacy policy in accordance with DPDP Act.
                </p>
              </form>
            )}

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8C867D] mb-3">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/sreeshaelegance"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-8 w-8 border border-[#3E3A34] flex items-center justify-center text-[#A69E92] hover:border-[#B79B63] hover:text-[#B79B63] transition-colors"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="h-8 w-8 border border-[#3E3A34] flex items-center justify-center text-[#A69E92] hover:border-[#25D366] hover:text-[#25D366] transition-colors"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href="https://www.youtube.com/@sreeshaelegance"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="h-8 w-8 border border-[#3E3A34] flex items-center justify-center text-[#A69E92] hover:border-[#FF0000] hover:text-[#FF0000] transition-colors"
                >
                  <YoutubeIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal, GSTIN, Payments */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-[#8C867D]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span>© 2026 Sreesha Elegance. All rights reserved.</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>

          {/* Payment & Security Indicators */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider text-[#A69E92]">
              Secure Payments:
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 border border-[#3E3A34] text-[10px] text-[#C7BEAF]">
                UPI
              </span>
              <span className="px-2 py-0.5 border border-[#3E3A34] text-[10px] text-[#C7BEAF]">
                VISA
              </span>
              <span className="px-2 py-0.5 border border-[#3E3A34] text-[10px] text-[#C7BEAF]">
                Mastercard
              </span>
              <span className="px-2 py-0.5 border border-[#3E3A34] text-[10px] text-[#C7BEAF]">
                RuPay
              </span>
              <span className="px-2 py-0.5 border border-[#3E3A34] text-[10px] text-[#B79B63]">
                Razorpay
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
