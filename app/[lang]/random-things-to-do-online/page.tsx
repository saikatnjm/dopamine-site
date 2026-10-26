import { GuidePage } from "@/components/guides/guide-page";
import { guideMetadata } from "@/lib/seo-pages";

// Content: data/guides.ts ("random-things-to-do-online").
export const generateMetadata = () => guideMetadata("random-things-to-do-online");

export default function RandomThingsToDoOnlinePage() {
  return <GuidePage slug="random-things-to-do-online" />;
}
