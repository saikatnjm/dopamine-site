import type { MetadataRoute } from "next";
import { experiencesInCategory, listCategories, listExperiences } from "@/lib/experience/registry";
import { absoluteUrl } from "@/lib/site";
import { GAME_HREF_OVERRIDES, listGames } from "@/data/games";
import { GUIDE_SLUGS } from "@/data/guides";
import { gameIsPlayable } from "@/lib/activities";
import { formsForRegion, listRegions, REGION_INDEX_MIN } from "@/lib/dialects/content";

// Only real, useful, indexable pages. Result (/result), challenge (/c) and
// achievements pages are personal and noindex; redirecting routes are left out
// (search engines treat redirects in a sitemap as errors).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/experiences"), changeFrequency: "weekly", priority: 0.8 },
    ...listExperiences().map((e) => ({
      url: absoluteUrl(`/experiences/${e.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...listCategories()
      .filter((c) => experiencesInCategory(c.slug).length > 0)
      .map((c) => ({ url: absoluteUrl(`/categories/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: absoluteUrl("/bored"), changeFrequency: "weekly", priority: 0.9 },
    ...GUIDE_SLUGS.map((s) => ({ url: absoluteUrl(`/${s}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: absoluteUrl("/daily"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/boss"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/world"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/games"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/excuses"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/dhaka-person"), changeFrequency: "monthly", priority: 0.7 },
    ...listGames()
      .filter((g) => !(g.slug in GAME_HREF_OVERRIDES) && gameIsPlayable(g.slug))
      .map((g) => ({
      url: absoluteUrl(`/games/${g.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    // Dialect region pages, once they hold enough sourced words to be useful.
    ...listRegions()
      .filter((r) => formsForRegion(r.id).length >= REGION_INDEX_MIN)
      .map((r) => ({ url: absoluteUrl(`/games/word-map/${r.id}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
  return pages;
}
