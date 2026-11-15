"use client";

import * as React from "react";
import {
  Printer,
  Download,
  Share2,
  X,
  ShieldCheck,
  CheckCircle2,
  Crown,
  FileText,
} from "lucide-react";
import { Order } from "@/lib/orders";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

interface AtelierInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AtelierInvoiceModal: React.FC<AtelierInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const isIntraState =
    (order.customer?.state || "").toLowerCase().includes("telangana") ||
    (order.customer?.city || "").toLowerCase().includes("hyderabad");

  // GST Calculation (5% on Silk Handloom HSN 5007)
  const totalAmount = Number(order.total) || 0;
  const taxableValue = Math.round(totalAmount / 1.05);
  const totalGst = totalAmount - taxableValue;
  const halfGst = Math.round(totalGst / 2);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const el = document.getElementById("atelier-printable-invoice");
    if (!el) return;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Invoice_SE_${order.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1C1B19; margin: 0; padding: 24px; background: #fff; }
            .container { max-width: 800px; margin: 0 auto; border: 1px solid #B79B63; padding: 32px; }
            h1, h2, h3, h4 { font-family: Georgia, serif; margin: 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px; }
            th { background: #FAF7F2; border-bottom: 1px solid #E8E2D8; padding: 8px; text-align: left; text-transform: uppercase; font-size: 10px; }
            td { padding: 8px; border-bottom: 1px solid #E8E2D8; }
            .right { text-align: right; }
            .gold { color: #B79B63; }
          </style>
        </head>
        <body>
          <div class="container">
            ${el.innerHTML}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Sreesha_Elegance_Invoice_${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast.success(`Invoice #${order.id} downloaded`);
  };

  const handleShareWhatsApp = () => {
    const cleanPhone = (order.customer.phone || "").replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const message = encodeURIComponent(
      `Namaste ${order.customer.fullName}! 🙏\n\nHere is your official Sreesha Elegance Atelier Tax Invoice for Order #${order.id}.\nTotal Amount: ${formatINR(order.total)}\nStatus: ${order.status}\n${order.trackingNumber ? `BlueDart Tracking AWB: ${order.trackingNumber}\n` : ""}Silk Mark Verification: 100% Genuine Pure Mulberry Silk Certified.\n\nWarm regards,\nSreesha Elegance Atelier Team`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Global Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #atelier-printable-invoice,
          #atelier-printable-invoice * {
            visibility: visible !important;
          }
          #atelier-printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            box-shadow: none !important;
            border: 1px solid #b79b63 !important;
            background: white !important;
            display: block !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white w-full max-w-3xl border border-[#E8E2D8] shadow-2xl rounded-xs overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Action Bar (Hidden on print) */}
        <div className="p-4 border-b border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#B79B63]" />
            <span className="text-xs font-semibold text-[#1C1B19] uppercase tracking-wider">
              Official Atelier Tax Invoice &amp; Packing Slip
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="text-xs gap-1.5 bg-white text-[#1C1B19] hover:border-[#B79B63] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#B79B63]" />
              <span>Print / Save PDF</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadHtml}
              className="text-xs gap-1.5 bg-white text-stone-700 hover:border-[#B79B63] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>HTML</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleShareWhatsApp}
              className="text-xs gap-1.5 bg-white text-[#2D6A4F] border-[#2D6A4F]/30 hover:bg-[#2D6A4F]/10 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer ml-1"
              title="Close Invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="overflow-y-auto p-6 sm:p-10 text-[#1C1B19] bg-white">
          <div
            id="atelier-printable-invoice"
            className="border-2 border-[#B79B63]/60 p-6 sm:p-8 space-y-6 bg-white relative"
          >
            {/* Corner Decorative Borders */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#B79B63]" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#B79B63]" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#B79B63]" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#B79B63]" />

            {/* Header: Brand & Flagship Atelier Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#E8E2D8] gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#B79B63] font-bold block">
                  Couture &amp; Handloom Silks
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] font-normal tracking-wide mt-0.5">
                  Sreesha Elegance
                </h1>
                <p className="text-[11px] text-[#5A5650] italic mt-0.5">
                  &ldquo;Wear Your Elegance&rdquo; • Hyderabad Atelier
                </p>
                <div className="text-[10px] text-stone-500 space-y-0.5 mt-2">
                  <p>Kukatpally Flagship Atelier, Hyderabad, Telangana — 500072</p>
                  <p>Contact: +91 62813 44628 • concierge@sreeshaelegance.com</p>
                  <p>GSTIN: 36AAECS4462K1ZU • State Code: 36 (Telangana)</p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#FAF7F2] text-[#B79B63] border border-[#B79B63]/50 text-[10px] uppercase font-bold tracking-wider rounded-2xs">
                  <Crown className="w-3 h-3 text-[#B79B63]" /> Tax Invoice
                </span>
                <p className="font-mono text-sm font-bold text-[#1C1B19] mt-1">INV-SE-{order.id}</p>
                <p className="text-[11px] text-stone-500">Date: {order.date}</p>
                <p className="text-[10px] text-emerald-700 font-medium flex items-center justify-start sm:justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Silk Mark Authorized #SM-TEL-8921
                </p>
              </div>
            </div>

            {/* Bill To & Dispatch Logistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#FAF7F2] p-4 border border-[#E8E2D8] rounded-xs space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#B79B63] block mb-1">
                  Billed &amp; Shipped To:
                </span>
                <p className="font-semibold text-sm text-[#1C1B19]">{order.customer?.fullName}</p>
                <p className="text-stone-600 leading-relaxed">{order.customer?.address}</p>
                <p className="text-stone-600">
                  {order.customer?.city}, {order.customer?.state} — {order.customer?.pinCode}
                </p>
                <p className="text-stone-600 font-mono pt-1">
                  Phone: +91 {order.customer?.phone?.replace(/\D/g, "")}
                </p>
                {order.customer?.email && (
                  <p className="text-stone-500 text-[11px]">{order.customer.email}</p>
                )}
              </div>

              <div className="bg-[#FAF7F2] p-4 border border-[#E8E2D8] rounded-xs space-y-1 text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#B79B63] block mb-1">
                  Fulfillment &amp; Gateway Details:
                </span>
                <p className="text-stone-600">
                  <span className="font-medium text-[#1C1B19]">Status:</span> {order.status}
                </p>
                <p className="text-stone-600">
                  <span className="font-medium text-[#1C1B19]">Payment Mode:</span>{" "}
                  {order.paymentMethod?.toUpperCase()}
                </p>
                {order.razorpayPaymentId && (
                  <p className="font-mono text-[11px] text-stone-500">
                    Gateway Ref: {order.razorpayPaymentId}
                  </p>
                )}
                <p className="text-stone-600 pt-1">
                  <span className="font-medium text-[#1C1B19]">Carrier:</span>{" "}
                  {order.carrier || "BlueDart Express"}
                </p>
                {order.trackingNumber ? (
                  <p className="font-mono text-[11px] font-bold text-[#2D6A4F]">
                    AWB: {order.trackingNumber}
                  </p>
                ) : (
                  <p className="text-[11px] text-stone-400">Atelier Tagging &amp; Packaging</p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-[#E8E2D8] rounded-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
                  <tr>
                    <th className="p-3 text-center w-10">#</th>
                    <th className="p-3">Item Description &amp; Customization</th>
                    <th className="p-3 text-center">HSN</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8]">
                  {order.items.map((item, idx) => {
                    const lineTotal = (item.price || 0) * (item.quantity || 1);
                    return (
                      <tr key={idx} className="hover:bg-stone-50/50">
                        <td className="p-3 text-center font-mono text-stone-400">{idx + 1}</td>
                        <td className="p-3">
                          <p className="font-semibold text-[#1C1B19]">{item.title}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px] text-stone-500">
                            <span>Category: {item.category || "Handloom Silk"}</span>
                            <span>•</span>
                            <span>Size: {item.size}</span>
                            {item.blouseOption && (
                              <>
                                <span>•</span>
                                <span className="text-[#B79B63] font-medium">
                                  {item.blouseOption}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center font-mono text-stone-500">5007</td>
                        <td className="p-3 text-center font-semibold">{item.quantity || 1}</td>
                        <td className="p-3 text-right font-mono">{formatINR(item.price)}</td>
                        <td className="p-3 text-right font-semibold font-mono">
                          {formatINR(lineTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculations & Tax Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              {/* Quality Seal & Packing Checklist */}
              <div className="border border-[#E8E2D8] p-4 rounded-xs bg-[#FAF7F2]/50 space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#2D6A4F] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  Atelier Quality &amp; Authenticity Guarantee
                </span>
                <ul className="text-[11px] text-stone-600 space-y-1 pl-1">
                  <li>✓ Tested Pure Zari &amp; Mulberry Silk Mark Tagged</li>
                  <li>✓ Masterji Blouse Measurement &amp; Stitching Inspected</li>
                  <li>✓ Handloom Fall &amp; Pico Tasseling Completed</li>
                  <li>✓ Packed in Gold-Stamped Protective Velvet Hardbox</li>
                </ul>
                <div className="pt-2 text-[10px] text-stone-400 italic">
                  Subject to Hyderabad jurisdiction. Handcrafted with pride in India.
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 border border-[#E8E2D8] p-4 rounded-xs bg-white">
                <div className="flex justify-between text-stone-600">
                  <span>Taxable Handloom Value:</span>
                  <span className="font-mono">{formatINR(taxableValue)}</span>
                </div>

                {isIntraState ? (
                  <>
                    <div className="flex justify-between text-stone-500 text-[11px]">
                      <span>CGST (2.5%):</span>
                      <span className="font-mono">+{formatINR(halfGst)}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 text-[11px]">
                      <span>SGST (2.5%):</span>
                      <span className="font-mono">+{formatINR(halfGst)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>IGST (5% Handloom Silk):</span>
                    <span className="font-mono">+{formatINR(totalGst)}</span>
                  </div>
                )}

                {order.discount > 0 && (
                  <div className="flex justify-between text-[#2D6A4F]">
                    <span>Atelier Privilege Savings:</span>
                    <span className="font-mono">-{formatINR(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Insured Express Shipping:</span>
                  <span>
                    {order.shippingFee === 0 ? "Complimentary" : formatINR(order.shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between font-serif text-base font-bold text-[#1C1B19] pt-2 border-t border-[#E8E2D8]">
                  <span>Total Amount Paid:</span>
                  <span className="font-sans font-bold text-[#B79B63]">
                    {formatINR(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature & Seal Footer */}
            <div className="pt-4 border-t border-[#E8E2D8] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs">
              <div>
                <p className="text-[10px] text-stone-400">
                  Computer generated invoice. No signature required.
                </p>
                <p className="text-[10px] text-stone-400">
                  Registered Office: Sreesha Elegance, Kukatpally, Hyderabad, Telangana
                </p>
              </div>

              <div className="text-center sm:text-right">
                <div className="inline-block border-b border-stone-400 w-40 mb-1" />
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#1C1B19]">
                  Authorized Atelier Signatory
                </p>
                <p className="text-[9px] text-[#B79B63] font-mono">SREESHA ELEGANCE HYDERABAD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
