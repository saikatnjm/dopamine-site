import { langParams } from "@/lib/i18n/core";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { siteConfig } from "@/lib/site";

export const size = ogSize;
// Pre-render once per language (both serve the same English card).
export const generateStaticParams = langParams;
export const contentType = ogContentType;
export const alt = siteConfig.name;

export default function Image() {
  return renderOgCard({
    eyebrow: siteConfig.name,
    emoji: "🧠",
    title: "Tiny simulators for everyday chaos",
    subtitle: "One-minute games with unexpected endings. Free, no sign-up, made to share.",
    chips: ["Dhaka CNG Simulator", "More cooking"],
    cta: "Play now",
    accent: "chili",
  });
}
