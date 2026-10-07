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
