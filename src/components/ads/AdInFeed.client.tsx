// components/ads/AdInFeed.client.tsx — Client Component
// In-feed native ad: disisipkan di dalam grid artikel

import AdLabel from "@/components/ads/AdLabel";
import AdSlot from "@/components/ads/AdSlot.client";

export default function AdInFeed() {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm
                 border-2 border-dashed border-gray-200 relative"
      role="complementary"
      aria-label="Iklan"
    >
      {/* "Iklan" label */}
      <div className="absolute top-2 right-2 z-10">
        <AdLabel />
      </div>

      <AdSlot
        slotId={process.env.NEXT_PUBLIC_AD_SLOT_INFEED}
        format="fluid"
        placeholderHeight="280px"
        placeholderWidth="100%"
        placeholderLabel="In-Feed Ad · Native"
        className="w-full"
      />
    </div>
  );
}
