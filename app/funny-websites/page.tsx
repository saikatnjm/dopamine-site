import { GuidePage, guideMetadata } from "@/components/guides/guide-page";

// Content: data/guides.ts ("funny-websites").
export const metadata = guideMetadata("funny-websites");

export default function FunnyWebsitesPage() {
  return <GuidePage slug="funny-websites" />;
}
