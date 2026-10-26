import { GuidePage } from "@/components/guides/guide-page";
import { guideMetadata } from "@/lib/seo-pages";

// Content: data/guides.ts ("one-minute-games").
export const generateMetadata = () => guideMetadata("one-minute-games");

export default function OneMinuteGamesPage() {
  return <GuidePage slug="one-minute-games" />;
}
