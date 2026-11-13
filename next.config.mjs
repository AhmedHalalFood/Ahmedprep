/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Inlines the stylesheet into <head> in production, removing the render-blocking CSS request.
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/free-shsat-class", destination: "/free-sunday-classes", permanent: true },
      // The dedicated program pages moved; permanent redirects carry existing search equity to the new URLs.
      { source: "/shsat", destination: "/shsat-prep", permanent: true },
      { source: "/digital-sat", destination: "/digital-sat-prep", permanent: true },
      // Temporary (307) during owner review; switch to permanent once the change is approved.
      { source: "/programs", destination: "/programs-2027", permanent: false },
      // Historical URLs from the previous site. Absolute canonical destinations keep www requests to a single 301 hop,
      // so these must stay above the www host redirect.
      { source: "/home", destination: "https://ahmedprep.com/", statusCode: 301 },
      { source: "/who-are-we/why-ahmed-prep", destination: "https://ahmedprep.com/about", statusCode: 301 },
      { source: "/who-are-we/about-me", destination: "https://ahmedprep.com/about", statusCode: 301 },
      { source: "/satact", destination: "https://ahmedprep.com/digital-sat-prep", statusCode: 301 },
      { source: "/sat", destination: "https://ahmedprep.com/digital-sat-prep", statusCode: 301 },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ahmedprep.com" }],
        destination: "https://ahmedprep.com/:path*",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

export default nextConfig
