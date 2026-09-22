import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});


const nextConfig: NextConfig = {
  output: "standalone",
  //basePath: "/ssr-app",
  
// Optimasi gambar dari domain eksternal
  images: {
    remotePatterns: [
      // ── Backend development (localhost) ──────────────────
      {
        protocol: "http",
        hostname: "localhost",
        port: "3008",
      },
      // ── Backend production (VPS via domain) ──────────────
      {
        protocol: "https",
        hostname: "news.beritauptodate.my.id",
      },
      // ── TODO: Tambahkan domain CDN production di sini ─────
      // Setelah domain hosting gambar production diketahui,
      // daftarkan secara eksplisit dan hapus komentar ini.
      {
        protocol: "https",
        hostname: "akcdn.detik.net.id",
      },
      {
        protocol: "https",
        hostname: "*.detik.net.id",
            },
    ],
    // Format modern untuk performa LCP yang lebih baik
    formats: ["image/webp"],
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

export default withBundleAnalyzer(nextConfig);
