import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { PageTransitionWrapper } from "@/components/layout/PageTransitionWrapper";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { CartWishlistProvider } from "@/context/CartWishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { constructMetadata } from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1C1B19] font-sans antialiased selection:bg-[#F7F3EB] selection:text-[#1C1B19]">
        <AuthProvider>
          <CartWishlistProvider>
            <SmoothScrollProvider>
              <AnnouncementBar />
              <Header />
              <PageTransitionWrapper>{children}</PageTransitionWrapper>
              <Footer />
              <MobileBottomNav />
              <CartDrawer />
              <ToastProvider />
            </SmoothScrollProvider>
          </CartWishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
