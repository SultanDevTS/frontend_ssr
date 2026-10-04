/**
 * Format ISO date string ke format Indonesia (e.g., "1 Agustus 2026")
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
