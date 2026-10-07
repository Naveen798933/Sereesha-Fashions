import { ProductListingView } from "@/components/shop/ProductListingView";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Contemporary Silhouettes & Indo-Western Couture",
  description:
    "Pre-draped ready-to-wear sarees, embroidered cape sharara sets, and modern festive ensembles from Sreesha Elegance.",
});

export default function ContemporaryPage() {
  return (
    <ProductListingView
      title="Contemporary Silhouettes"
      subtitle="Effortless ready-to-wear draped saree gowns, cape shararas, and Indo-Western couture designed for modern celebrations."
      categoryFilter="contemporary"
    />
  );
}
