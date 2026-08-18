import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";

const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? "";
const isAdSenseConfigured =
  ADSENSE_PUB_ID.startsWith("ca-pub-") &&
  ADSENSE_PUB_ID !== "ca-pub-XXXXXXXXXXXXXXXX";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // CLS: mencegah layout shift saat font loading
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      {/* Google AdSense — hanya load jika Publisher ID sudah dikonfigurasi */}
      {isAdSenseConfigured && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <Component {...pageProps} />
    </main>
  );
}
