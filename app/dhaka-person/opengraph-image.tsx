import { ogContentType, ogSize } from "@/lib/og";
import { pageOgImage } from "@/lib/og-cards";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "What kind of Dhaka person are you? — funny quiz";

export default function Image() {
  return pageOgImage("dhaka-person");
}
