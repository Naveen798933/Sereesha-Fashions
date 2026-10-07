import { ProductListingView } from "@/components/shop/ProductListingView";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Handloom Sarees — Kanchipuram, Banarasi & Silk Marks",
  description:
    "Explore pure mulberry handloom silk sarees crafted by master weavers from Kanchipuram, Varanasi, and Paithan. Certified authentic Silk Mark tags.",
});

export default function SareesPage() {
  return (
    <ProductListingView
      title="Pure Handloom Sarees"
      subtitle="Certified Silk Mark weaves, pure zari threadwork, and heirloom drapes from the royal ateliers of Hyderabad, Kanchipuram, and Varanasi."
      categoryFilter="sarees"
    />
  );
}
