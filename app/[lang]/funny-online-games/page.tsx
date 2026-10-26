import { GuidePage } from "@/components/guides/guide-page";
import { guideMetadata } from "@/lib/seo-pages";

// Content: data/guides.ts ("funny-online-games").
export const generateMetadata = () => guideMetadata("funny-online-games");

export default function FunnyOnlineGamesPage() {
  return <GuidePage slug="funny-online-games" />;
}
