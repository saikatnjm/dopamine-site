import type { Accent } from "@/components/ui/styles";
import type { CategorySlug } from "@/lib/experience/types";
import type { Text } from "@/lib/i18n/core";

// Teasers for experiences in the oven. Not playable, not in the sitemap.
export type UpcomingExperience = {
  id: string;
  title: Text;
  emoji: string;
  teaser: Text;
  category: CategorySlug;
  accent: Accent;
};

export const upcoming: UpcomingExperience[] = [
];
