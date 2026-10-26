import { ogContentType, ogSize } from "@/lib/og";
import { gameOgImage } from "@/lib/og-cards";

// English only: Satori can't shape Bangla (see lib/og.tsx).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Chicken Crossing Dhaka — road-crossing arcade game";

export default function Image() {
  return gameOgImage("chicken-crossing");
}
