import { notFound } from "next/navigation";
import { getProductBySlug, PRODUCTS } from "@/data/products";
import { ProductDetailView } from "@/components/shop/ProductDetailView";
import { constructMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    category: product.category,
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return constructMetadata({
    title: product.title,
    description: product.shortDescription,
    image: product.primaryImage,
  });
}

export default async function TopLevelProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
