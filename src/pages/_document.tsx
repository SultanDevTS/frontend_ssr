import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id" className="">
      <Head>
        {/* Viewport & theme */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
      </Head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
