import type { MetadataRoute } from "next";
import { experiencesInCategory, listCategories, listExperiences } from "@/lib/experience/registry";
import { publishedPosts } from "@/lib/blog-content";
import { LANGS } from "@/lib/i18n/core";
import { localePath } from "@/lib/i18n/paths";
import { absoluteUrl } from "@/lib/site";
import { GAME_HREF_OVERRIDES, listGames } from "@/data/games";
import { GUIDE_SLUGS } from "@/data/guides";
import { gameIsPlayable } from "@/lib/activities";
import { formsForRegion, listRegions, REGION_INDEX_MIN } from "@/lib/dialects/content";

// Only real, useful, indexable pages. Result (/result), challenge (/c) and
// achievements pages are personal and noindex; redirecting routes are left out
// (search engines treat redirects in a sitemap as errors).
export default function sitemap(): MetadataRoute.Sitemap {
  return pages().flatMap(withLanguages);
}

/**
 * Every page exists in English (unprefixed) and Bangla (/bn/…): list both URLs,
 * each with the hreflang pair, as Google recommends for multilingual sitemaps.
 */
function withLanguages(entry: MetadataRoute.Sitemap[number]): MetadataRoute.Sitemap {
  const path = new URL(entry.url).pathname;
  const languages = { en: absoluteUrl(localePath(path, "en")), bn: absoluteUrl(localePath(path, "bn")) };
  return LANGS.map((lang) => ({ ...entry, url: languages[lang], alternates: { languages: { ...languages, "x-default": languages.en } } }));
}

function pages(): MetadataRoute.Sitemap {
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
    // Blog: the index once something is published, and every published article (real dates only).
    ...(publishedPosts().length > 0 ? [{ url: absoluteUrl("/blog"), changeFrequency: "weekly" as const, priority: 0.7, lastModified: publishedPosts()[0]!.updated ?? publishedPosts()[0]!.published }] : []),
    ...publishedPosts().map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.7, lastModified: p.updated ?? p.published })),
    { url: absoluteUrl("/about"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
  return pages;
}
