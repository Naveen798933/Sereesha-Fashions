import { ProductListingView } from "@/components/shop/ProductListingView";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Designer Kurtis & Anarkali Sets — Festive Daywear",
  description:
    "Hand-embroidered Chanderi silk Anarkalis, authentic Lucknowi chikankari kurtas, and festive palazzo sets.",
});

export default function KurtisPage() {
  return (
    <ProductListingView
      title="Designer Kurtis & Anarkali Sets"
      subtitle="Artisanal gota patti borders, Lucknowi mukaish needlework, and breathable pure silk fabrics for festive celebrations."
      categoryFilter="kurtis"
    />
  );
}
