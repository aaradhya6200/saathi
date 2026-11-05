import type { MetadataRoute } from "next";

// Makes the site installable as an app ("Add to Home Screen").
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saathi · Trusted helper by the hour",
    short_name: "Saathi",
    description: "Book a verified helper by the hour and track the visit live. Hyderabad.",
    id: "/",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFFFF",
    theme_color: "#15803D",
    categories: ["lifestyle", "medical", "utilities"],
    icons: [
      { src: "/app-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Book a Saathi", url: "/book", icons: [{ src: "/app-icon/192", sizes: "192x192" }] },
      { name: "Track a booking", url: "/track", icons: [{ src: "/app-icon/192", sizes: "192x192" }] },
    ],
  };
}
