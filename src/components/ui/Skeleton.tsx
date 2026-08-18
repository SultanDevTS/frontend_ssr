// components/ui/Skeleton.tsx — Server Component
// Reusable skeleton loader with fixed dimensions to prevent CLS

type Props = {
  className?: string;
  width?: string | number;
  height?: string | number;
};

export default function Skeleton({ className = "", width, height }: Props) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
