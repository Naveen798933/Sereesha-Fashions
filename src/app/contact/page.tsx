"use client";

import * as React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "Bridal Consultation",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
      showToast.success("Inquiry received! Our concierge team will reach out shortly.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-medium">
          Client Concierge
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1C1B19]">Get in Touch</h1>
        <p className="text-xs sm:text-sm text-[#5A5650] max-w-lg mx-auto">
          Visit our Banjara Hills flagship atelier or book a virtual one-on-one styling consultation
          from anywhere in India.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Info (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl text-[#1C1B19]">Hyderabad Flagship</h2>

            <div className="space-y-4 text-xs text-[#5A5650]">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#B79B63] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-[#1C1B19]">Atelier &amp; Boutique</p>
                  <p>Road No. 10, Banjara Hills,</p>
                  <p>Hyderabad, Telangana 500034, India</p>
                  <a
                    href="https://maps.app.goo.gl/KPp3kgQXKQoW5urG6?g_st=ac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#B79B63] hover:underline font-medium text-xs pt-0.5"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#B79B63] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1C1B19]">Concierge Phone</p>
                  <a href="tel:+916281344628" className="hover:underline">
                    +91 62813 44628
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#B79B63] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1C1B19]">Email Support</p>
                  <a href="mailto:care@sreeshaelegance.com" className="hover:underline">
                    care@sreeshaelegance.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#B79B63] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1C1B19]">Store Hours</p>
                  <p>Monday – Sunday: 10:30 AM – 8:30 PM IST</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp & Map Callouts */}
            <div className="pt-4 border-t border-[#E8E2D8] space-y-2.5">
              <a
                href="https://wa.me/916281344628?text=Hello%20Sreesha%20Elegance%2C%20I%20would%20like%20to%20connect%20with%20a%20personal%20stylist."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] text-white text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:bg-[#1ebe5c] transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Instant WhatsApp Styling
              </a>
              <a
                href="https://maps.app.goo.gl/KPp3kgQXKQoW5urG6?g_st=ac"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-white border border-[#B79B63] text-[#B79B63] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:bg-[#FAF7F2] transition-colors"
              >
                <MapPin className="h-4 w-4" /> Open Atelier in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Form (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E2D8] p-6 sm:p-8">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="h-14 w-14 bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center rounded-full">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#1C1B19]">Message Received</h3>
              <p className="text-xs text-[#5A5650] max-w-sm leading-relaxed">
                Thank you, {formData.name}. Our atelier manager will get in touch with you at{" "}
                {formData.phone || formData.email} within 2 business hours.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                Send Another Inquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-serif text-2xl text-[#1C1B19]">Send an Inquiry</h2>
              <p className="text-xs text-[#8C867D]">
                Whether you need a bespoke blouse measurement session or custom bridal inquiry, we
                are here to assist.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#1C1B19] font-medium block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-[#E8E2D8] px-3 py-2 text-xs outline-none focus:border-[#B79B63]"
                    placeholder="e.g. Ananya Reddy"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#1C1B19] font-medium block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-[#E8E2D8] px-3 py-2 text-xs outline-none focus:border-[#B79B63]"
                    placeholder="ananya@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#1C1B19] font-medium block">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-[#E8E2D8] px-3 py-2 text-xs outline-none focus:border-[#B79B63]"
                    placeholder="+91 98490 00000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#1C1B19] font-medium block">
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full border border-[#E8E2D8] px-3 py-2 text-xs outline-none focus:border-[#B79B63] bg-white cursor-pointer"
                  >
                    <option value="Bridal Consultation">Bridal Consultation</option>
                    <option value="Custom Blouse Tailoring">Custom Blouse Tailoring</option>
                    <option value="Order Status">Order Status Inquiry</option>
                    <option value="Bulk / Wedding Trousseau">Bulk / Wedding Trousseau</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#1C1B19] font-medium block">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share any specific requirements, event dates, or styling queries..."
                  className="w-full border border-[#E8E2D8] px-3 py-2 text-xs outline-none focus:border-[#B79B63] resize-none"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                <Send className="mr-2 h-4 w-4" /> Send to Concierge Team
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
