// components/ads/AdBillboard.client.tsx — Client Component
// Billboard / Leaderboard: 728×90 — di bawah hero dan atas halaman kategori

import AdLabel from "@/components/ads/AdLabel";
import AdSlot from "@/components/ads/AdSlot";

export default function AdBillboard() {
  return (
    <div className="w-full">
      <div className="flex justify-end mb-1">
        <AdLabel />
      </div>
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_AD_SLOT_BILLBOARD}
        format="horizontal"
        placeholderHeight="90px"
        placeholderWidth="100%"
        placeholderLabel="Billboard Ad · 728×90"
      />
    </div>
  );
}
