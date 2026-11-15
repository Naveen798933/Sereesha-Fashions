import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sreesha Elegance | Luxury Indian Fashion & Handloom Silks",
    short_name: "Sreesha Elegance",
    description:
      "Heritage handloom sarees, bespoke bridal couture, and fine jewelry atelier based in Hyderabad.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#1C1B19",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
