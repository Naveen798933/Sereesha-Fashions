import type { Metadata } from "next";

export interface MetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonical?: string;
}

const DEFAULT_TITLE = "Sreesha Elegance Hyderabad | Premium Indian Fashion & Ethnic Wear";
const DEFAULT_DESCRIPTION =
  "Discover handcrafted luxury sarees, bridal lehengas, designer anarkalis, and contemporary silhouettes from our Hyderabad boutique atelier. Wear your elegance.";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sreeshaelegance.com";

const DEFAULT_OG_IMAGE = "/logo.png";

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  canonical,
}: MetadataOptions = {}): Metadata {
  const fullTitle = title ? `${title} | Sreesha Elegance Hyderabad` : DEFAULT_TITLE;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonical || BASE_URL,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || BASE_URL,
      siteName: "Sreesha Elegance Hyderabad",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@sreeshaelegance",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}
