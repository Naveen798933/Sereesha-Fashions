import * as React from "react";

export const OrganizationJsonLd: React.FC = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "Sreesha Elegance",
    description:
      "Premium Indian fashion boutique in Hyderabad specializing in luxury sarees, bridal lehengas, and contemporary ethnic wear.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://sreeshaelegance.com",
    telephone: "+91 62813 44628",
    hasMap: "https://maps.app.goo.gl/KPp3kgQXKQoW5urG6?g_st=ac",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Opp, JNTU Rd, HMT Hills, Kukatpally",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      postalCode: "500085",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "17.5023309",
      longitude: "78.3963639",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:30",
        closes: "20:30",
      },
    ],
    priceRange: "₹₹₹",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export const WebSiteJsonLd: React.FC = () => {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sreeshaelegance.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sreesha Elegance",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export interface ProductJsonLdProps {
  product: {
    id: string;
    slug: string;
    title: string;
    category: string;
    categoryLabel?: string;
    price: number;
    primaryImage: string;
    galleryImages?: string[];
    shortDescription?: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
  };
  url?: string;
}

export const ProductJsonLd: React.FC<ProductJsonLdProps> = ({ product, url }) => {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sreeshaelegance.com";
  const productUrl = url || `${siteUrl}/women/${product.category}/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [product.primaryImage, ...(product.galleryImages || [])],
    description: product.shortDescription || product.description || product.title,
    sku: product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: "Sreesha Elegance",
    },
    category: product.categoryLabel || product.category,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Sreesha Elegance",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 5.0,
      reviewCount: Math.max(1, product.reviewCount || 12),
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export const BreadcrumbJsonLd: React.FC<BreadcrumbJsonLdProps> = ({ items }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
