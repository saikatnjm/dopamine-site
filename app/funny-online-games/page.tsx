import { GuidePage, guideMetadata } from "@/components/guides/guide-page";

// Content: data/guides.ts ("funny-online-games").
export const metadata = guideMetadata("funny-online-games");

export default function FunnyOnlineGamesPage() {
  return <GuidePage slug="funny-online-games" />;
}
