// components/ads/AdStickyFooter.client.tsx — Client Component
// Sticky mobile footer ad — mobile only (md:hidden)
// Alasan Client: useState (dismiss), useEffect (delay + adsbygoogle.push)

import { useState, useEffect } from "react";
import AdLabel from "@/components/ads/AdLabel";
import AdSlot from "@/components/ads/AdSlot.client";

export default function AdStickyFooter() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Tampil setelah 2 detik agar tidak langsung mengganggu UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (dismissed || !visible) return null;

  return (
    // md:hidden — hanya tampil di layar < 768px (mobile)
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden
                 bg-white border-t border-gray-200 shadow-2xl"
      role="complementary"
      aria-label="Iklan"
    >
      <div className="relative max-w-screen-sm mx-auto px-3 pt-5 pb-3">
        {/* Label */}
        <div className="absolute top-1 left-3">
          <AdLabel />
        </div>

        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-1 right-2 text-gray-400 hover:text-gray-600
                     text-base leading-none p-1 transition-colors"
          aria-label="Tutup iklan"
        >
          ✕
        </button>

        {/* AdSense slot — format fixed / anchor */}
        <AdSlot
          slotId={process.env.NEXT_PUBLIC_AD_SLOT_STICKY}
          format="auto"
          placeholderHeight="50px"
          placeholderWidth="100%"
          placeholderLabel="Sticky Footer Ad · 320×50"
        />
      </div>
    </div>
  );
}
