import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";
import "@/styles/globals.css";

const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? "";
const isAdSenseConfigured =
  ADSENSE_PUB_ID.startsWith("ca-pub-") &&
  ADSENSE_PUB_ID !== "ca-pub-XXXXXXXXXXXXXXXX";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",  // CLS: mencegah layout shift saat font loading
  preload: false,   // tidak download saat build, dimuat saat runtime
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Viewport harus ada di sini (bukan di _document) — Next.js Page Router requirement */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
    </>
  );
}
