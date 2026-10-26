import { getVisiblePost } from "@/lib/blog-content";
import { ogContentType, ogSize } from "@/lib/og";
import { blogOgImage } from "@/lib/og-cards";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Hottogol blog article";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return blogOgImage(getVisiblePost((await params).slug));
}
