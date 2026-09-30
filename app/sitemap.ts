import type { MetadataRoute } from "next";
import { experiencesInCategory, listCategories, listExperiences } from "@/lib/experience/registry";
import { absoluteUrl } from "@/lib/site";
import { listGames } from "@/data/games";

// Only real, useful pages. Result pages are personal and noindex.
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
    { url: absoluteUrl("/daily"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/games"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/excuses"), changeFrequency: "monthly", priority: 0.7 },
    ...listGames().map((g) => ({
      url: absoluteUrl(`/games/${g.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
  return pages;
}
