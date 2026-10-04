import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header categories={pageProps.categories ?? []} />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
