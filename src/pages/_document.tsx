import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id" className="">
      <Head>
        {/* theme-color goes here; viewport must be in _app via next/head */}
        <meta name="theme-color" content="#2563eb" />
      </Head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
