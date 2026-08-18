import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimasi gambar dari domain eksternal (API backend)
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3008",
      },
      {
        protocol: "https",
        hostname: "awsimages.detik.net.id",
      },
      {
        protocol: "https",
        hostname: "*.detik.net.id",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Format modern untuk performa LCP yang lebih baik
    formats: ["image/avif", "image/webp"],
    // Device sizes untuk responsive images (CLS optimization)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Compress response untuk performa lebih baik
  compress: true,

  // Production-safe: disable x-powered-by header
  poweredByHeader: false,

  // Strict mode React untuk mendeteksi bug
  reactStrictMode: true,

  // Headers keamanan untuk production
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
