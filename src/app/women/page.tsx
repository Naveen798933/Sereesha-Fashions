import { ProductListingView } from "@/components/shop/ProductListingView";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Women's Couture & Handloom Weaves — Sreesha Elegance",
  description:
    "Explore our complete collection of certified handloom pure silk sarees, bespoke bridal lehengas, festive designer kurtis, and contemporary drapes from Hyderabad.",
});

export default function WomenPage() {
  return (
    <ProductListingView
      title="Women's Couture & Handlooms"
      subtitle="The complete boutique catalog — handloom pure silk sarees, bespoke bridal lehengas, festive designer kurtis, and contemporary silhouettes crafted in Hyderabad."
      categoryFilter="all"
    />
  );
}
