import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { SITE_NAME } from "@/lib/constants";

export default function Custom500() {
  const router = useRouter();

  function handleRetry() {
    router.reload();
  }

  return (
    <>
      <Head>
        <title>{`Terjadi Kesalahan | ${SITE_NAME}`}</title>
      </Head>

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Terjadi Kesalahan
            </h1>

            <p className="text-gray-500 text-sm leading-relaxed">
              Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi
              atau kembali ke beranda.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg
                         hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2
                         focus:ring-blue-500 focus:ring-offset-2"
            >
              Coba Lagi
            </button>

            <Link
              href="/"
              className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg
                         hover:bg-gray-200 transition-colors"
            >
              Ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
