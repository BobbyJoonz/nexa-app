import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXA Sunverter Academy",
    short_name: "NEXA Academy",
    description: "Bilingual product education for NEXA Sunverters",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6F8",
    theme_color: "#122C4F",
    lang: "fa",
    dir: "rtl",
    orientation: "portrait",
    categories: ["education", "utilities"],
    icons: [
      {
        src: "/assets/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/assets/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
