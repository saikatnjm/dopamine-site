import { GuidePage } from "@/components/guides/guide-page";
import { guideMetadata } from "@/lib/seo-pages";

// Content: data/guides.ts ("games-to-play-when-bored").
export const generateMetadata = () => guideMetadata("games-to-play-when-bored");

export default function GamesToPlayWhenBoredPage() {
  return <GuidePage slug="games-to-play-when-bored" />;
}
