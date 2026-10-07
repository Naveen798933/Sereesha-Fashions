import { ProductListingView } from "@/components/shop/ProductListingView";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "The Royal Nizam Edit — Heritage Couture Collection",
  description:
    "Our signature boutique collection inspired by the royal aesthetic and historic grandeur of Hyderabad. Pure silk sarees, bridal ensembles, and handcraft.",
});

export default function CollectionsPage() {
  return (
    <ProductListingView
      title="The Royal Nizam Collection"
      subtitle="Bespoke bridal heirlooms and certified pure handloom silk weaves curated from our flagship Kukatpally atelier."
      collectionFilter="Royal Nizam Edit"
    />
  );
}
