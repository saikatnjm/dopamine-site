import { GuidePage, guideMetadata } from "@/components/guides/guide-page";

// Content: data/guides.ts ("random-things-to-do-online").
export const metadata = guideMetadata("random-things-to-do-online");

export default function RandomThingsToDoOnlinePage() {
  return <GuidePage slug="random-things-to-do-online" />;
}
