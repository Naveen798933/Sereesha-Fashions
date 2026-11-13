import { notFound } from "next/navigation";
import { fetchProductBySlug, PRODUCTS } from "@/data/products";
import { ProductDetailView } from "@/components/shop/ProductDetailView";
import { constructMetadata } from "@/lib/seo";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

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
  const product = await fetchProductBySlug(slug);
  if (!product) return {};

  return constructMetadata({
    title: product.title,
    description: product.shortDescription,
    image: product.primaryImage,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { category, slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sreeshaelegance.com";
  const breadcrumbItems = [
    { name: "Home", url: `${siteUrl}` },
    { name: "Women", url: `${siteUrl}/women` },
    {
      name: product.categoryLabel || category,
      url: `${siteUrl}/women/${category}`,
    },
    { name: product.title, url: `${siteUrl}/women/${category}/${slug}` },
  ];

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProductDetailView product={product} />
    </>
  );
}
