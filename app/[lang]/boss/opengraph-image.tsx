import { langParams } from "@/lib/i18n/core";
import { ogContentType, ogSize } from "@/lib/og";
import { pageOgImage } from "@/lib/og-cards";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
// Pre-render once per language (both serve the same English card).
export const generateStaticParams = langParams;
export const contentType = ogContentType;
export const alt = "Hottogol Weekly Boss — Dhaka Traffic Boss fight";

export default function Image() {
  return pageOgImage("boss");
}
