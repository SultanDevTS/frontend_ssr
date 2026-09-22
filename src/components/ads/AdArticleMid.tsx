// components/ads/AdArticleMid.client.tsx — Client Component
// Mid-article ad: tampil di tengah konten artikel detail

import AdLabel from "@/components/ads/AdLabel";
import AdSlot from "@/components/ads/AdSlot.client";

export default function AdArticleMid() {
  return (
    <div className="my-8 not-prose">
      <div className="flex justify-center mb-1">
        <AdLabel />
      </div>
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_MID}
        format="in-article"
        placeholderHeight="120px"
        placeholderWidth="100%"
        placeholderLabel="In-Article Ad · Responsive"
      />
    </div>
  );
}
