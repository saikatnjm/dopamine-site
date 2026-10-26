import { ogContentType, ogSize } from "@/lib/og";
import { gameOgImage } from "@/lib/og-cards";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Tea Balance — don't spill the cha";

export default function Image() {
  return gameOgImage("tea-balance");
}
