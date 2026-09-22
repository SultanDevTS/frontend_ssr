// components/ads/AdSlot.client.tsx — Client Component
//
// Komponen inti untuk Google AdSense. Alasan Client Component:
// - Menggunakan useEffect (browser-only)
// - Mengakses window.adsbygoogle (browser API)
//
// Cara pakai:
//   <AdSlot slotId={process.env.NEXT_PUBLIC_AD_SLOT_BILLBOARD} format="horizontal" />
//
// Saat NEXT_PUBLIC_ADSENSE_PUB_ID = placeholder atau slot kosong,
// ditampilkan grey placeholder agar layout tetap terlihat benar di development.

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export type AdFormat =
  | "auto"              // responsive, sesuaikan ukuran otomatis
  | "horizontal"        // leaderboard / billboard (728×90)
  | "vertical"          // skyscraper / sidebar
  | "rectangle"         // medium rectangle (300×250)
  | "in-article"        // native / in-feed
  | "fluid";            // in-feed fluid (lebarnya 100%)

type AdSlotProps = {
  /** Slot ID dari dashboard Google AdSense */
  slotId?: string;
  /** Format iklan */
  format?: AdFormat;
  /** CSS class tambahan untuk wrapper <ins> */
  className?: string;
  /** Lebar minimum placeholder saat dev mode (px) */
  placeholderWidth?: string;
  /** Tinggi minimum placeholder saat dev mode (px) */
  placeholderHeight?: string;
  /** Label yang muncul di placeholder */
  placeholderLabel?: string;
};

const PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID ?? "";

/** Cek apakah Publisher ID sudah dikonfigurasi (bukan placeholder) */
function isPubIdConfigured(pubId: string): boolean {
  return (
    pubId.startsWith("ca-pub-") &&
    pubId !== "ca-pub-2081905719548415" &&
    pubId.length > 10
  );
}

export default function AdSlot({
  slotId,
  format = "auto",
  className = "",
  placeholderWidth = "100%",
  placeholderHeight = "90px",
  placeholderLabel = "Google AdSense",
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const isConfigured = isPubIdConfigured(PUB_ID) && Boolean(slotId);

  useEffect(() => {
    if (!isConfigured) return;
    if (pushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.error("[AdSlot] adsbygoogle.push() error:", err);
    }
  }, [isConfigured]);

  // ── DEV / Placeholder mode ─────────────────────────────────────────────
  if (!isConfigured) {
    return (
      <div
        style={{ width: placeholderWidth, minHeight: placeholderHeight }}
        className={`flex flex-col items-center justify-center gap-1
                    border-2 border-dashed border-gray-200 rounded-lg
                    bg-gray-50 text-gray-400 select-none ${className}`}
        aria-label="Ad Placeholder"
      >
        <svg
          className="w-6 h-6 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
        <span className="text-[11px] font-medium">{placeholderLabel}</span>
        <span className="text-[10px] opacity-60">
          {slotId
            ? `Slot: ${slotId}`
            : "Isi NEXT_PUBLIC_ADSENSE_PUB_ID & Slot ID di .env"}
        </span>
      </div>
    );
  }

  // ── Production AdSense mode ────────────────────────────────────────────
  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: "block" }}
      data-ad-client={PUB_ID}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
