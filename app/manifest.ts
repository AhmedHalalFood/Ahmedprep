import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ahmed Prep",
    short_name: "Ahmed Prep",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#08264a",
    icons: [
      { src: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { src: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
