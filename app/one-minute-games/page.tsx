import { GuidePage, guideMetadata } from "@/components/guides/guide-page";

// Content: data/guides.ts ("one-minute-games").
export const metadata = guideMetadata("one-minute-games");

export default function OneMinuteGamesPage() {
  return <GuidePage slug="one-minute-games" />;
}
