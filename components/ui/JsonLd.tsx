type Props = {
  data: Record<string, unknown>;
};

export default function JsonLd({ data }: Props) {
  // Escape `<` to prevent injection issues in JSON-LD script tags
  // per Next.js official recommendation for dangerouslySetInnerHTML + JSON-LD
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
