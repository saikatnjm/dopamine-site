import { GuidePage } from "@/components/guides/guide-page";
import { guideMetadata } from "@/lib/seo-pages";

// Content: data/guides.ts ("funny-websites").
export const generateMetadata = () => guideMetadata("funny-websites");

export default function FunnyWebsitesPage() {
  return <GuidePage slug="funny-websites" />;
}
