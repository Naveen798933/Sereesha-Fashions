"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  ShoppingBag,
  MapPin,
  Tag,
  Gift,
  AlertCircle,
  RefreshCw,
  Phone,
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { saveOrder, Order } from "@/lib/orders";

type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, isHydrated } = useCartWishlist();
  const { user, profile } = useAuth();

  // Promo code state
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = React.useState(false);

  // Royal Gift Packaging Option (synced from cart)
  const [includeGiftPackaging, setIncludeGiftPackaging] = React.useState(false);
  const [giftMessage, setGiftMessage] = React.useState("");

  // Load preferences and coupon from cart session storage
  React.useEffect(() => {
    try {
      const storedPref = sessionStorage.getItem("sreesha_cart_preferences");
      if (storedPref) {
        const pref = JSON.parse(storedPref);
        if (pref.includeGiftPackaging) {
          setIncludeGiftPackaging(true);
        }
        if (pref.giftMessage) {
          setGiftMessage(pref.giftMessage);
        }
      }

      if (cartTotal === 0) {
        setAppliedCoupon(null);
        setCouponCode("");
        sessionStorage.removeItem("sreesha_applied_coupon");
        return;
      }

      const storedCoupon = sessionStorage.getItem("sreesha_applied_coupon");
      if (storedCoupon) {
        const c = JSON.parse(storedCoupon);
        if (c.code) {
          if (c.code === "ROYAL20" && cartTotal < 40000) {
            setAppliedCoupon(null);
            setCouponCode("");
            sessionStorage.removeItem("sreesha_applied_coupon");
            return;
          }
          if (c.code === "ROYAL15" && cartTotal < 15000) {
            setAppliedCoupon(null);
            setCouponCode("");
            sessionStorage.removeItem("sreesha_applied_coupon");
            return;
          }
          if (c.code === "FESTIVE2500" && cartTotal < 25000) {
            setAppliedCoupon(null);
            setCouponCode("");
            sessionStorage.removeItem("sreesha_applied_coupon");
            return;
          }

          const disc =
            c.discountType === "percentage"
              ? Math.round((cartTotal * (c.discountValue || 10)) / 100)
              : Math.min(cartTotal, c.discount || 0);
          setAppliedCoupon({ code: c.code, discount: disc });
          setCouponCode(c.code);
        }
      }
    } catch {}
  }, [cartTotal]);

  // Form State
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Telangana",
    pinCode: "",
    notes: "",
  });

  // Load saved address on client mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("sreesha_saved_addresses");
      if (stored) {
        interface StoredAddress {
          name?: string;
          phone?: string;
          street?: string;
          city?: string;
          state?: string;
          pinCode?: string;
          isDefault?: boolean;
        }
        const parsed = JSON.parse(stored) as StoredAddress[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultAddr = parsed.find((a) => a.isDefault) || parsed[0];
          if (defaultAddr) {
            setFormData((prev) => ({
              ...prev,
              fullName: defaultAddr.name || prev.fullName,
              phone: defaultAddr.phone?.replace(/[^0-9]/g, "") || prev.phone,
              address: defaultAddr.street || prev.address,
              city: defaultAddr.city || prev.city,
              state: defaultAddr.state || prev.state,
              pinCode: defaultAddr.pinCode || prev.pinCode,
            }));
          }
        }
      }
    } catch {}
  }, []);

  // Autofill if logged-in user profile is available
  React.useEffect(() => {
    if (profile || user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || profile?.full_name || user?.user_metadata?.full_name || "",
        email: prev.email || user?.email || "",
        phone: prev.phone || profile?.phone || user?.user_metadata?.phone || "",
      }));
    }
  }, [profile, user]);

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = React.useState("client@okhdfcbank");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [orderCompleted, setOrderCompleted] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");

  // Payment Failure & Recovery State
  const [paymentError, setPaymentError] = React.useState<{
    title: string;
    message: string;
    code?: string;
    orderId?: string;
    recoveryAction?: boolean;
  } | null>(null);

  // Atelier Simulation Gateway Modal State
  const [simulationModal, setSimulationModal] = React.useState<{
    orderId: string;
    amount: number;
    paymentMethod: PaymentMethod;
  } | null>(null);

  const giftPackagingFee = includeGiftPackaging ? 250 : 0;
  const shippingFee = cartTotal >= 2999 ? 0 : 150;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, cartTotal + shippingFee + giftPackagingFee - discountAmount);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cartTotal }),
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon({ code: data.code, discount: data.discountAmount });
        showToast.success(
          data.message || `Privilege code applied! Saved ${formatINR(data.discountAmount)}`
        );
      } else {
        showToast.error(data.error || "Invalid or expired coupon code");
      }
    } catch {
      // Client-side fallback coupons
      let localMatched = false;
      try {
        const stored = localStorage.getItem("sreesha_admin_coupons");
        if (stored) {
          interface StoredCoupon {
            code: string;
            discount_type: "percentage" | "fixed";
            discount_value: number;
            min_order: number;
            active: boolean;
          }
          const parsed = JSON.parse(stored) as StoredCoupon[];
          const found = parsed.find((c) => c.code === code && c.active);
          if (found) {
            if (cartTotal < (found.min_order || 0)) {
              showToast.error(`Requires minimum order of ${formatINR(found.min_order)}`);
              return;
            }
            const disc =
              found.discount_type === "percentage"
                ? Math.round((cartTotal * found.discount_value) / 100)
                : Math.min(cartTotal, found.discount_value);
            setAppliedCoupon({ code, discount: disc });
            showToast.success(`Coupon ${code} applied! Saved ${formatINR(disc)}`);
            localMatched = true;
          }
        }
      } catch {}

      if (!localMatched) {
        if (code === "WELCOME10") {
          const disc = Math.round(cartTotal * 0.1);
          setAppliedCoupon({ code, discount: disc });
          showToast.success(`Welcome coupon applied! Saved ${formatINR(disc)}`);
        } else if (code === "ROYAL15" && cartTotal >= 10000) {
          const disc = Math.round(cartTotal * 0.15);
          setAppliedCoupon({ code, discount: disc });
          showToast.success(`Royal tier coupon applied! Saved ${formatINR(disc)}`);
        } else {
          showToast.error("Invalid coupon code");
        }
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const finalizeOrder = async (
    trackingId?: string,
    verifiedPaymentId?: string,
    razorpayOrderId?: string
  ) => {
    // Collision-proof timestamped order ID
    const timestampPart = Date.now().toString().slice(-6);
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const generatedId = `SE-${timestampPart}-${randomPart}`;
    setOrderId(generatedId);

    const newOrder: Order = {
      id: generatedId,
      date: new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      createdAt: new Date().toISOString(),
      status: "Order Placed & Verified",
      carrier: "BlueDart Air Express",
      trackingNumber: trackingId || `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      estimatedDelivery: "In 2 - 4 Business Days",
      subtotal: cartTotal,
      shippingFee,
      discount: discountAmount,
      total: finalTotal,
      paymentMethod,
      razorpayOrderId: razorpayOrderId || undefined,
      razorpayPaymentId: verifiedPaymentId || undefined,
      paymentStatus: paymentMethod === "cod" ? "pending" : verifiedPaymentId ? "paid" : "pending",
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        notes: [
          formData.notes,
          includeGiftPackaging ? `[Royal Gift Box (+₹250)] Calligraphy Note: "${giftMessage}"` : "",
        ]
          .filter(Boolean)
          .join(" | "),
      },
      items: cart.map((item) => ({
        id: item.id,
        title: item.product.title,
        category: item.product.category,
        primaryImage: item.product.primaryImage,
        price: item.product.price,
        size: item.size,
        blouseOption: item.blouseOption,
        quantity: item.quantity,
      })),
    };

    await saveOrder(newOrder, user?.id);

    // Dispatch luxury atelier confirmation email if customer email provided
    if (formData.email && formData.email.includes("@")) {
      fetch("/api/order/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "order_confirmation",
          orderId: generatedId,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          paymentMethod,
          total: finalTotal,
          items: newOrder.items.map((it) => ({
            title: it.title,
            size: it.size,
            quantity: it.quantity,
            price: it.price,
            image: it.primaryImage,
          })),
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
          },
          trackingNumber: newOrder.trackingNumber,
        }),
      }).catch((err) => console.warn("Email dispatch notice:", err));

      // If verified online payment, dispatch verified payment receipt
      if (verifiedPaymentId) {
        fetch("/api/order/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "payment_receipt",
            orderId: generatedId,
            customerName: formData.fullName,
            customerEmail: formData.email,
            paymentId: verifiedPaymentId,
            paymentMethod,
            total: finalTotal,
          }),
        }).catch((err) => console.warn("Payment receipt notice:", err));
      }
    }

    setIsProcessing(false);
    setOrderCompleted(true);
    try {
      sessionStorage.removeItem("sreesha_applied_coupon");
      sessionStorage.removeItem("sreesha_cart_preferences");
    } catch {}
    clearCart();
    showToast.success("Payment verified! Order placed & synced successfully.");
    router.push(`/order-confirmation?orderId=${generatedId}`);
  };

  const handleSimulationSuccess = async () => {
    if (!simulationModal) return;
    setIsProcessing(true);
    try {
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: simulationModal.orderId,
          razorpay_payment_id: `pay_sim_${Date.now()}`,
          razorpay_signature: "simulated_atelier_signature",
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.verified) {
        const simOrderId = simulationModal.orderId;
        const simPaymentId = verifyData.paymentId || `pay_sim_${Date.now()}`;
        setSimulationModal(null);
        await finalizeOrder(undefined, simPaymentId, simOrderId);
      } else {
        throw new Error(verifyData.error || "Simulation verification failed");
      }
    } catch (err) {
      console.error("Simulation error:", err);
      showToast.error("Simulation verification error. Please retry.");
      setIsProcessing(false);
    }
  };

  const handleSimulationFailure = () => {
    const failedOrderId = simulationModal?.orderId;
    setSimulationModal(null);
    setIsProcessing(false);
    const failureMsg =
      "Payment authorization declined by issuing bank (Transaction Limit Exceeded / Bank Timeout).";
    setPaymentError({
      title: "Payment Authorization Failed",
      message: failureMsg,
      code: "BAD_REQUEST_PAYMENT_DECLINED",
      orderId: failedOrderId,
      recoveryAction: true,
    });
    showToast.error(failureMsg);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast.error("Please fill in all mandatory delivery address fields");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      showToast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    if (formData.pinCode.replace(/\D/g, "").length !== 6) {
      showToast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    setPaymentError(null);
    setIsProcessing(true);

    // If COD, skip gateway
    if (paymentMethod === "cod") {
      setTimeout(() => {
        finalizeOrder();
      }, 1200);
      return;
    }

    try {
      // 1. Create Razorpay order on server with authoritative items and pricing
      const createRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            productId: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
          })),
          couponCode: appliedCoupon?.code,
          giftPackaging: includeGiftPackaging,
          customer: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
          amount: finalTotal,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customerName: formData.fullName,
            customerPhone: formData.phone,
          },
        }),
      });

      const orderData = await createRes.json();

      if (!createRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || "Failed to initialize payment gateway");
      }

      // If server returned simulated order (keys pending or demo mode)
      if (orderData.isSimulated) {
        setSimulationModal({
          orderId: orderData.orderId,
          amount: Number(orderData.amount) / 100,
          paymentMethod,
        });
        setIsProcessing(false);
        return;
      }

      // 2. Load Razorpay script dynamically
      const loadScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
          if (typeof window === "undefined") return resolve(false);
          const w = window as unknown as { Razorpay?: unknown };
          if (w.Razorpay) return resolve(true);

          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadScript();

      if (
        !scriptLoaded ||
        typeof window === "undefined" ||
        !(
          window as unknown as {
            Razorpay?: new (opts: unknown) => {
              open: () => void;
              on: (event: string, callback: (resp: unknown) => void) => void;
            };
          }
        ).Razorpay
      ) {
        setIsProcessing(false);
        showToast.error(
          "Unable to load secure payment gateway. Please check your internet connection or disable ad blockers and try again."
        );
        return;
      }

      // 3. Launch Razorpay payment modal
      const RazorpayConstructor = (
        window as unknown as {
          Razorpay: new (opts: {
            key: string;
            amount: number;
            currency: string;
            name: string;
            description: string;
            order_id: string;
            handler: (response: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => Promise<void>;
            prefill: {
              name: string;
              email: string;
              contact: string;
            };
            theme: {
              color: string;
            };
            modal: {
              ondismiss: () => void;
            };
          }) => {
            open: () => void;
            on: (event: string, callback: (response: unknown) => void) => void;
          };
        }
      ).Razorpay;

      let paymentHandled = false;

      const rzp = new RazorpayConstructor({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Sreesha Elegance Atelier",
        description: "Bespoke Couture & Pure Silk Handloom Order",
        order_id: orderData.orderId,
        handler: async (response) => {
          paymentHandled = true;
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              await finalizeOrder(
                undefined,
                response.razorpay_payment_id,
                response.razorpay_order_id
              );
            } else {
              setPaymentError({
                title: "Signature Verification Failed",
                message:
                  verifyData.error ||
                  "Payment signature could not be verified. If funds were debited, please contact concierge with your payment reference.",
                code: "VERIFICATION_FAILED",
                orderId: response.razorpay_order_id,
                recoveryAction: true,
              });
              showToast.error("Payment signature verification failed.");
              setIsProcessing(false);
            }
          } catch (err) {
            console.error("Verification network error:", err);
            setPaymentError({
              title: "Network Interruption During Verification",
              message:
                "We were unable to confirm payment verification due to a network disruption. Please contact concierge with your payment reference.",
              code: "NETWORK_ERROR",
              orderId: response.razorpay_order_id,
              recoveryAction: true,
            });
            showToast.error("Payment verification network interruption.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone.replace(/[^\d]/g, "").slice(-10),
        },
        theme: {
          color: "#1C1B19",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            if (!paymentHandled) {
              showToast.info("Payment window closed. Your bag items remain preserved.");
            }
          },
        },
      });

      rzp.on("payment.failed", (response: unknown) => {
        paymentHandled = true;
        setIsProcessing(false);
        const errResp = response as
          | {
              error?: {
                description?: string;
                reason?: string;
                code?: string;
                metadata?: { order_id?: string; payment_id?: string };
              };
            }
          | undefined;

        const reason =
          errResp?.error?.description ||
          errResp?.error?.reason ||
          "Payment was declined by your bank or card issuer.";
        setPaymentError({
          title: "Payment Authorization Failed",
          message: reason,
          code: errResp?.error?.code || "PAYMENT_FAILED",
          orderId: errResp?.error?.metadata?.order_id || orderData.orderId,
          recoveryAction: true,
        });
        showToast.error(`Payment Failed: ${reason}`);
      });

      rzp.open();
    } catch (error: unknown) {
      console.error("Payment initialization error:", error);
      const msg = error instanceof Error ? error.message : "Failed to initialize payment gateway";
      setPaymentError({
        title: "Payment Gateway Initialization Failed",
        message: msg,
        recoveryAction: true,
      });
      showToast.error(msg);
      setIsProcessing(false);
    }
  };

  // Order Success Screen
  if (orderCompleted) {
    return (
      <div className="min-h-[75vh] bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center space-y-6">
        <div className="h-16 w-16 bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-[#2D6A4F] flex items-center justify-center mx-auto rounded-full">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-bold">
          Order Confirmed &amp; Dispatched Soon
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1C1B19] font-normal">
          Thank You, {formData.fullName}
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5650] max-w-lg mx-auto leading-relaxed">
          Your order <strong className="text-[#1C1B19]">#{orderId}</strong> is officially registered
          with our Hyderabad flagship atelier. An automated tax invoice and courier dispatch updates
          will be sent to <strong className="text-[#1C1B19]">{formData.phone}</strong>.
        </p>

        {/* Order Details Card */}
        <div className="p-6 bg-white border border-[#E8E2D8] max-w-lg mx-auto text-left space-y-3.5 text-xs rounded-xs shadow-xs">
          <div className="flex justify-between border-b border-[#E8E2D8] pb-2 font-medium text-[#1C1B19]">
            <span>Order Reference</span>
            <span className="font-mono font-bold">#{orderId}</span>
          </div>
          <div className="flex justify-between text-[#5A5650]">
            <span>Payment Method</span>
            <span className="font-medium text-[#1C1B19] uppercase">
              {paymentMethod === "upi"
                ? "Razorpay UPI"
                : paymentMethod === "card"
                  ? "Credit / Debit Card"
                  : paymentMethod === "netbanking"
                    ? "NetBanking"
                    : "Cash on Delivery"}
            </span>
          </div>
          <div className="flex justify-between text-[#5A5650]">
            <span>Delivery Destination</span>
            <span className="font-medium text-[#1C1B19] text-right">
              {formData.city}, {formData.state} — {formData.pinCode}
            </span>
          </div>
          <div className="flex justify-between text-[#5A5650]">
            <span>Estimated Metro Delivery</span>
            <span className="font-medium text-[#2D6A4F]">2 – 4 Business Days</span>
          </div>
          <div className="flex justify-between text-[#5A5650] pt-2 border-t border-[#E8E2D8]">
            <span className="font-bold text-[#1C1B19]">Total Paid</span>
            <span className="font-bold text-base text-[#1C1B19]">{formatINR(finalTotal)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild variant="primary" size="lg">
            <Link href={`/track-order?orderId=${orderId}`}>Track Dispatch Timeline</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/women/sarees">Continue Browsing</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Hydration Guard
  if (!isHydrated) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center py-24">
        <h1 className="sr-only">Boutique Checkout</h1>
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#8C867D] uppercase tracking-wider">
            Securing boutique checkout...
          </p>
        </div>
      </div>
    );
  }

  // Empty Cart Handling
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] py-20 px-4 max-w-2xl mx-auto text-center space-y-5">
        <div className="h-16 w-16 border border-[#D8C7A5] flex items-center justify-center text-[#B79B63] mx-auto">
          <ShoppingBag className="h-8 w-8 stroke-[1.2]" />
        </div>
        <h1 className="text-3xl font-serif text-[#1C1B19]">No Items to Checkout</h1>
        <p className="text-xs sm:text-sm text-[#5A5650] leading-relaxed max-w-sm mx-auto">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <div className="pt-2">
          <Button asChild variant="primary" size="lg">
            <Link href="/women/sarees">
              Explore Collections <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28 sm:pb-12">
      {/* Checkout Header */}
      <div className="border-b border-[#E8E2D8] pb-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-bold">
            Boutique Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19] mt-1">
            Shipping &amp; Payment
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#2D6A4F] bg-[#2D6A4F]/10 px-3 py-1.5 border border-[#2D6A4F]/20 font-medium">
          <ShieldCheck className="h-4 w-4" />
          <span>256-Bit Encrypted Secure Checkout</span>
        </div>
      </div>

      {/* 3-Step Checkout Progression Stepper */}
      <div className="mb-8 p-3 sm:p-4 bg-white border border-[#E8E2D8] flex items-center justify-between max-w-2xl mx-auto rounded-xs shadow-2xs text-xs">
        <Link href="/cart" className="flex items-center gap-2 text-[#2D6A4F] hover:underline">
          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#2D6A4F]/10 border border-[#2D6A4F] flex items-center justify-center font-bold text-[10px] sm:text-[11px]">
            ✓
          </div>
          <span className="font-medium hidden sm:inline">1. Bag Review</span>
        </Link>
        <div className="h-[1px] flex-1 bg-[#B79B63] mx-2 sm:mx-3" />
        <div className="flex items-center gap-2 text-[#1C1B19]">
          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#1C1B19] text-white flex items-center justify-center font-bold text-[10px] sm:text-[11px]">
            2
          </div>
          <span className="font-semibold">2. Shipping Destination</span>
        </div>
        <div className="h-[1px] flex-1 bg-[#E8E2D8] mx-2 sm:mx-3" />
        <div className="flex items-center gap-2 text-[#8C867D]">
          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center font-medium text-[10px] sm:text-[11px]">
            3
          </div>
          <span className="hidden sm:inline">3. Payment &amp; Verify</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Delivery Details & Payment Method (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Delivery Address Card */}
            <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-5 rounded-xs shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
                <MapPin className="h-4 w-4 text-[#B79B63]" />
                <h2 className="font-serif text-xl text-[#1C1B19]">1. Delivery Destination</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#1C1B19] font-medium mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63]"
                    placeholder="e.g. Sreeja Varma"
                  />
                </div>

                <div>
                  <label className="block text-[#1C1B19] font-medium mb-1">
                    10-Digit Mobile Number (For Delivery OTP) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63]"
                    placeholder="e.g. 9849012345"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1C1B19] font-medium mb-1">
                    Email Address (For Tax Receipt &amp; Tracking Updates) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63]"
                    placeholder="sreeja.varma@example.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1C1B19] font-medium mb-1">
                    Street Address / Flat / Building / Colony *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63]"
                    placeholder="Flat 402, Royal Residency, Road No. 36"
                  />
                </div>

                <div>
                  <label className="block text-[#1C1B19] font-medium mb-1">City / Town *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63]"
                    placeholder="Hyderabad"
                  />
                </div>

                <div>
                  <label className="block text-[#1C1B19] font-medium mb-1">State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63]"
                  >
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Kerala">Kerala</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1C1B19] font-medium mb-1">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    required
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63]"
                    placeholder="500033"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#1C1B19] font-medium mb-1">
                    Special Atelier Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#1C1B19] outline-none focus:border-[#B79B63]"
                    placeholder="e.g. Call before delivery, gift wrap, etc."
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-5 rounded-xs shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
                <CreditCard className="h-4 w-4 text-[#B79B63]" />
                <h2 className="font-serif text-xl text-[#1C1B19]">2. Payment Selection</h2>
              </div>

              {/* Payment Error Alert & Direct Recovery Options */}
              {paymentError && (
                <div
                  data-testid="payment-error-banner"
                  className="p-4 bg-[#9A3434]/10 border border-[#9A3434]/30 rounded-xs flex items-start gap-3.5 text-xs animate-in fade-in duration-200"
                >
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#9A3434] mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="font-semibold text-[#9A3434] text-sm">
                        {paymentError.title}
                      </strong>
                      <button
                        type="button"
                        onClick={() => setPaymentError(null)}
                        className="text-[11px] text-[#8C867D] hover:text-[#1C1B19] cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                    <p className="text-[#5A5650] leading-relaxed">{paymentError.message}</p>
                    {paymentError.orderId && (
                      <p className="text-[10px] font-mono text-[#8C867D]">
                        Reference ID: {paymentError.orderId}
                      </p>
                    )}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSubmitOrder}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1B19] text-[#FAF7F2] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#B79B63] transition-colors rounded-2xs cursor-pointer shadow-xs"
                      >
                        <RefreshCw className="h-3 w-3" /> Retry Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod("cod");
                          setPaymentError(null);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-[#B79B63] text-[#1C1B19] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors rounded-2xs cursor-pointer"
                      >
                        Switch to Cash on Delivery (COD)
                      </button>
                      <a
                        href={`https://wa.me/916281344628?text=Hello%20Sreesha%20Elegance%2C%20my%20payment%20encountered%20an%20issue%20(${encodeURIComponent(paymentError.message)}).%20Can%20you%20assist%20me%20with%20order%20assistance%3F`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#128C7E] hover:underline ml-1 font-medium"
                      >
                        <Phone className="h-3 w-3" /> Concierge Help
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={cn(
                    "p-3.5 border text-left flex items-start gap-3 transition-colors cursor-pointer",
                    paymentMethod === "upi"
                      ? "border-[#B79B63] bg-[#FAF7F2] ring-1 ring-[#B79B63]"
                      : "border-[#E8E2D8] bg-white hover:border-[#B79B63]"
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                      paymentMethod === "upi" ? "border-[#B79B63]" : "border-[#8C867D]"
                    )}
                  >
                    {paymentMethod === "upi" && (
                      <div className="h-2 w-2 rounded-full bg-[#B79B63]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1C1B19]">
                      Instant UPI (Google Pay, PhonePe, Paytm)
                    </p>
                    <p className="text-[10px] text-[#5A5650] mt-0.5">
                      Fastest zero-fee checkout via QR or VPA
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "p-3.5 border text-left flex items-start gap-3 transition-colors cursor-pointer",
                    paymentMethod === "card"
                      ? "border-[#B79B63] bg-[#FAF7F2] ring-1 ring-[#B79B63]"
                      : "border-[#E8E2D8] bg-white hover:border-[#B79B63]"
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                      paymentMethod === "card" ? "border-[#B79B63]" : "border-[#8C867D]"
                    )}
                  >
                    {paymentMethod === "card" && (
                      <div className="h-2 w-2 rounded-full bg-[#B79B63]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1C1B19]">
                      Credit / Debit Card (RuPay, Visa, MC)
                    </p>
                    <p className="text-[10px] text-[#5A5650] mt-0.5">
                      256-bit SSL encrypted bank gateway
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={cn(
                    "p-3.5 border text-left flex items-start gap-3 transition-colors cursor-pointer",
                    paymentMethod === "netbanking"
                      ? "border-[#B79B63] bg-[#FAF7F2] ring-1 ring-[#B79B63]"
                      : "border-[#E8E2D8] bg-white hover:border-[#B79B63]"
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                      paymentMethod === "netbanking" ? "border-[#B79B63]" : "border-[#8C867D]"
                    )}
                  >
                    {paymentMethod === "netbanking" && (
                      <div className="h-2 w-2 rounded-full bg-[#B79B63]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1C1B19]">NetBanking (50+ Banks)</p>
                    <p className="text-[10px] text-[#5A5650] mt-0.5">
                      HDFC, SBI, ICICI, Axis, Kotak
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={cn(
                    "p-3.5 border text-left flex items-start gap-3 transition-colors cursor-pointer",
                    paymentMethod === "cod"
                      ? "border-[#B79B63] bg-[#FAF7F2] ring-1 ring-[#B79B63]"
                      : "border-[#E8E2D8] bg-white hover:border-[#B79B63]"
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0",
                      paymentMethod === "cod" ? "border-[#B79B63]" : "border-[#8C867D]"
                    )}
                  >
                    {paymentMethod === "cod" && (
                      <div className="h-2 w-2 rounded-full bg-[#B79B63]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1C1B19]">
                      Cash on Delivery (Verified)
                    </p>
                    <p className="text-[10px] text-[#5A5650] mt-0.5">
                      Pay at doorstep after unboxing
                    </p>
                  </div>
                </button>
              </div>

              {/* UPI Field */}
              {paymentMethod === "upi" && (
                <div className="p-3.5 bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs">
                  <label className="block text-[#1C1B19] font-medium">Your UPI VPA / ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E8E2D8] text-[#1C1B19] outline-none font-mono"
                    placeholder="username@okhdfcbank"
                  />
                  <p className="text-[10px] text-[#8C867D]">
                    A payment request will be sent to your UPI app for approval.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E8E2D8] p-6 sm:p-8 space-y-6 sticky top-28 rounded-xs shadow-xs">
            <h2 className="font-serif text-xl text-[#1C1B19] pb-3 border-b border-[#E8E2D8]">
              Order Summary ({cart.length} Pieces)
            </h2>

            {/* Bag Item Thumbnails */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#FAF7F2]">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                  <div className="relative h-14 w-12 shrink-0 bg-[#EFE8DD] overflow-hidden border border-[#E8E2D8]">
                    <Image
                      src={item.product.primaryImage}
                      alt={item.product.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-medium text-[#1C1B19] truncate">{item.product.title}</p>
                    <p className="text-[10px] text-[#8C867D]">
                      Qty: {item.quantity} • Size: {item.size}
                    </p>
                    {item.blouseOption && (
                      <p className="text-[10px] text-[#B79B63] truncate">{item.blouseOption}</p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#1C1B19] shrink-0">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-[#E8E2D8]">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8C867D]" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="w-full pl-8 pr-2 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-mono outline-none focus:border-[#B79B63] uppercase"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-3.5 py-2 bg-[#1C1B19] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium hover:bg-[#B79B63] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-[11px] text-[#2D6A4F] mt-1.5 bg-[#2D6A4F]/10 px-2 py-1">
                  <span>Coupon {appliedCoupon.code} applied</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode("");
                    }}
                    className="text-[#9A3434] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-[#E8E2D8] space-y-2 text-xs text-[#5A5650]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-[#1C1B19] font-medium">{formatINR(cartTotal)}</span>
              </div>
              {includeGiftPackaging && (
                <div className="flex justify-between text-[#1C1B19]">
                  <span className="flex items-center gap-1.5 text-xs text-[#5A5650]">
                    <Gift className="h-3.5 w-3.5 text-[#B79B63]" /> Royal Gift Packaging
                  </span>
                  <span className="text-xs font-semibold text-[#1C1B19]">{formatINR(250)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#2D6A4F]">
                  <span>Atelier Privilege Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Insured Shipping</span>
                <span
                  className={shippingFee === 0 ? "text-[#2D6A4F] font-semibold" : "text-[#1C1B19]"}
                >
                  {shippingFee === 0 ? "FREE" : formatINR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Goods &amp; Services Tax (GST)</span>
                <span className="text-[#1C1B19]">Included in price</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1C1B19] pt-3 border-t border-[#E8E2D8]">
                <span>Total Amount Due</span>
                <span>{formatINR(finalTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isProcessing}
              className="w-full text-xs uppercase tracking-wider py-3.5"
            >
              <Lock className="h-4 w-4 mr-2 text-[#B79B63]" />
              {isProcessing
                ? "Connecting to Razorpay..."
                : `Place Order & Pay ${formatINR(finalTotal)}`}
            </Button>

            <div className="text-center text-[10px] text-[#8C867D] space-y-1">
              <p>🔒 100% Buyer Protection &amp; Silk Mark Guarantee</p>
              <p>Insured courier dispatch via BlueDart &amp; Delhivery Air</p>
            </div>
          </div>
        </div>
      </form>

      {/* Atelier Simulation Gateway Modal (when live Razorpay keys are not yet configured) */}
      {simulationModal && (
        <div
          data-testid="simulation-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B19]/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-[#FAF7F2] border border-[#B79B63]/40 w-full max-w-md p-6 sm:p-7 space-y-5 rounded-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div className="flex items-center gap-2 text-[#B79B63]">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="font-serif text-lg text-[#1C1B19] font-medium">
                  Atelier Payment Simulation
                </h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#B79B63]/15 text-[#B79B63] rounded-2xs font-semibold">
                Demo Mode
              </span>
            </div>

            <div className="p-3.5 bg-white border border-[#E8E2D8] space-y-2 text-xs">
              <div className="flex justify-between text-[#5A5650]">
                <span>Payable Amount</span>
                <span className="font-semibold text-sm text-[#1C1B19]">
                  {formatINR(simulationModal.amount)}
                </span>
              </div>
              <div className="flex justify-between text-[#5A5650]">
                <span>Payment Method</span>
                <span className="uppercase font-medium text-[#1C1B19]">
                  {simulationModal.paymentMethod === "upi"
                    ? "Instant UPI (GPay/PhonePe)"
                    : simulationModal.paymentMethod === "card"
                      ? "Credit / Debit Card"
                      : "NetBanking"}
                </span>
              </div>
              <div className="flex justify-between text-[#5A5650]">
                <span>Simulation Reference</span>
                <span className="font-mono text-[11px] text-[#8C867D]">
                  {simulationModal.orderId}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#5A5650] leading-relaxed">
              Live Razorpay merchant credentials are not yet configured in{" "}
              <code className="text-[#1C1B19] bg-[#EFE8DD] px-1 py-0.5 rounded-2xs font-mono">
                .env.local
              </code>
              . You can complete and verify this order in Atelier simulation mode to test receipts,
              transactional emails, and order registration.
            </p>

            <div className="space-y-2.5 pt-1">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleSimulationSuccess}
                disabled={isProcessing}
                className="w-full text-xs uppercase tracking-wider py-3.5"
              >
                <CheckCircle2 className="h-4 w-4 mr-2 text-[#2D6A4F]" />
                {isProcessing ? "Verifying Payment..." : "Authorize & Complete Payment"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSimulationFailure}
                  disabled={isProcessing}
                  className="text-[11px] text-[#9A3434] hover:bg-[#9A3434]/10 cursor-pointer"
                >
                  Simulate Bank Decline
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSimulationModal(null);
                    setIsProcessing(false);
                  }}
                  disabled={isProcessing}
                  className="text-[11px] cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
