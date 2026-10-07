import { ProductListingView } from "@/components/shop/ProductListingView";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "New Arrivals — Autumn & Festive 2026 Curations",
  description:
    "Explore the newest handloom silk sarees, contemporary drape gowns, and bridal lehengas freshly crafted for the 2026 festive season.",
});

export default function NewArrivalsPage() {
  return (
    <ProductListingView
      title="New Arrivals — Festive Edit"
      subtitle="Fresh off our handloom looms and atelier embroidery frames. Explore newly dropped designs for this season."
      badgeFilter="NEW"
    />
  );
}
