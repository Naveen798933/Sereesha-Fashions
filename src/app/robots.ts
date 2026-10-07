import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sreeshaelegance.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout", "/order-confirmation", "/account", "/design-system"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
