import { VIRAL_PICKS } from "@/data/viral";
import { listActivities } from "@/lib/activities";
import { langParams } from "@/lib/i18n/core";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const size = ogSize;
// Pre-render once per language (both serve the same English card).
export const generateStaticParams = langParams;
export const contentType = ogContentType;
export const alt = "You saw the video. Now try it yourself.";

export default function Image() {
  const byKey = new Map(listActivities("en").map((a) => [a.key, a]));
  const chips = VIRAL_PICKS.slice(0, 3).flatMap((k) => {
    const a = byKey.get(k);
    return a ? [a.title] : [];
  });
  return renderOgCard({
    eyebrow: "Hottogol",
    emoji: "😏",
    title: "YOU SAW THE VIDEO.",
    subtitle: "Now try it yourself. Free, in your browser, no sign-up.",
    chips,
    cta: "Play now",
    accent: "chili",
  });
}
