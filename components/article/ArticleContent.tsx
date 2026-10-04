import { sanitizeContent } from "@/lib/api";

type Props = {
  content: string;
};

/**
 * Pola paragraf yang tidak ingin ditampilkan
 * dari hasil scraping berita.
 */
const JUNK_PATTERNS: RegExp[] = [
  /^ADVERTISEMENT$/i,
  /^SCROLL TO CONTINUE WITH CONTENT$/i,
  /^\[Gambas:[^\]]+\]$/i,
  /^Lanjut ke sebelah\.\.\./i,
  /^Baca juga\s*:/i,
  /^\(CNN Indonesia\/[^)]+\)$/i,
  /^Simak video\s/i,
  /^Lihat juga\s*:/i,
  /^\s*$/,
];

/**
 * Mendeteksi paragraf yang merupakan kutipan langsung.
 */
function isQuoteParagraph(text: string): boolean {
  const trimmed = text.trim();

  return (
    trimmed.startsWith("\u201C") ||
    trimmed.startsWith('"') ||
    trimmed.startsWith("\u2018")
  );
}

/**
 * Membersihkan dan mentransformasi HTML artikel.
 */
function processContent(rawHtml: string): string {
  return rawHtml.replace(/<p>([\s\S]*?)<\/p>/gi, (fullMatch, inner) => {
    const plainText = inner.replace(/<[^>]*>/g, "").trim();

    const isJunk = JUNK_PATTERNS.some((pattern) => pattern.test(plainText));

    if (isJunk) {
      return "";
    }

    if (isQuoteParagraph(plainText)) {
      return `<blockquote>${inner}</blockquote>`;
    }

    return fullMatch;
  });
}

export default function ArticleContent({ content }: Props) {
  const safeContent = sanitizeContent(content);
  const processedContent = processContent(safeContent);

  return (
    <div
      className="article-body max-w-none"
      dangerouslySetInnerHTML={{
        __html: processedContent,
      }}
    />
  );
}
