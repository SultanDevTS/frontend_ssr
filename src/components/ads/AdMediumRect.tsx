// components/ads/AdMediumRect.client.tsx — Client Component
// Medium Rectangle: 300×250 — sidebar kanan

import AdLabel from "@/components/ads/AdLabel";
import AdSlot from "@/components/ads/AdSlot";

export default function AdMediumRect() {
  return (
    <div className="w-full">
      <div className="flex justify-end mb-1">
        <AdLabel />
      </div>
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_AD_SLOT_MEDIUM_RECT}
        format="rectangle"
        placeholderHeight="250px"
        placeholderWidth="300px"
        placeholderLabel="Medium Rectangle · 300×250"
      />
    </div>
  );
}
