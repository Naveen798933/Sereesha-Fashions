import { ProductListingView } from "@/components/shop/ProductListingView";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Bridal & Festive Lehengas — Hyderabad Royal Atelier",
  description:
    "Handcrafted bridal lehengas adorned with antique zardozi, dabka, and real mirrors. Tailored to perfection at our Kukatpally atelier.",
});

export default function LehengasPage() {
  return (
    <ProductListingView
      title="Bridal & Festive Lehengas"
      subtitle="Exquisite 16-kali silhouettes, antique zardozi embroidery, and regal dupattas tailored for the modern Indian bride."
      categoryFilter="lehengas"
    />
  );
}
