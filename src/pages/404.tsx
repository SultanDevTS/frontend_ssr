import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        {/* 404 Number */}
        <p className="text-8xl font-extrabold text-blue-600/20">404</p>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold
                     rounded-lg hover:bg-blue-700 transition-colors focus:outline-none
                     focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
