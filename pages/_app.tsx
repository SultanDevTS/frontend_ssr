import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Konfigurasi font disamakan dengan app/layout.tsx pada App Router.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Terapkan font pada <html>, setara dengan className={inter.className} di App Router */}
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>

      <Header categories={pageProps.categories ?? []} />
      <main className="min-h-screen">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
