import { ogContentType, ogSize } from "@/lib/og";
import { categoryOgImage } from "@/lib/og-cards";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Hottogol simulators by category";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return categoryOgImage((await params).slug);
}
