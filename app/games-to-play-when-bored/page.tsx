import { GuidePage, guideMetadata } from "@/components/guides/guide-page";

// Content: data/guides.ts ("games-to-play-when-bored").
export const metadata = guideMetadata("games-to-play-when-bored");

export default function GamesToPlayWhenBoredPage() {
  return <GuidePage slug="games-to-play-when-bored" />;
}
