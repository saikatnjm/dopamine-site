// Metadata builders per page type (server-side; reads the registries).
// Pages call these instead of hand-writing metadata objects; tests/seo.test.ts
// checks the same `*Seo()` functions for length and uniqueness.

import type { Metadata } from "next";
import { getGame } from "@/data/games";
import { NOINDEX_PAGES, PAGE_SEO, type PageSeoId } from "@/data/seo";
import { gameIsPlayable } from "@/lib/activities";
import { formsForRegion, getRegion, REGION_INDEX_MIN } from "@/lib/dialects/content";
import { experiencesInCategory, getCategory, getExperience } from "@/lib/experience/registry";
import { t } from "@/lib/i18n/core";
import { pageMetadata, type PageSeo } from "@/lib/seo";

/** Static pages that have their own app/<page>/opengraph-image.tsx. */
const OWN_OG_IMAGE: ReadonlySet<PageSeoId> = new Set(["home", "games", "experiences", "bored", "boss", "daily", "world", "excuses", "dhaka-person", "about", "viral"]);

export function staticPageMetadata(id: PageSeoId, path: string): Metadata {
  return pageMetadata({
    ...PAGE_SEO[id],
    path,
    noindex: NOINDEX_PAGES.includes(id),
    absoluteTitle: id === "home",
    defaultImage: !OWN_OG_IMAGE.has(id),
  });
}

export function gameMetadata(slug: string): Metadata {
  const game = getGame(slug);
  if (!game) return {};
  // A dialect game without content yet is a thin page: keep it out of search until it's playable.
  return pageMetadata({ ...game.seo, path: `/games/${slug}`, noindex: !gameIsPlayable(slug) });
}

export function experienceMetadata(slug: string): Metadata {
  const e = getExperience(slug);
  return e ? pageMetadata({ ...e.seo, path: `/experiences/${e.slug}` }) : {};
}

export function categorySeo(slug: string): (PageSeo & { live: number }) | null {
  const category = getCategory(slug);
  if (!category) return null;
  const title = t(category.title, "en");
  return {
    title: `${title} Simulators — Free Funny One-Minute Games`,
    description: `${t(category.description, "en")} Free one-minute ${title.toLowerCase()} simulators, no sign-up.`,
    live: experiencesInCategory(category.slug).length,
  };
}

export function categoryMetadata(slug: string): Metadata {
  const seo = categorySeo(slug);
  // Categories with nothing playable yet are thin pages: keep them out of search.
  return seo ? pageMetadata({ ...seo, path: `/categories/${slug}`, noindex: seo.live === 0 }) : {};
}

export function regionSeo(id: string): (PageSeo & { forms: number }) | null {
  const r = getRegion(id);
  if (!r) return null;
  const bn = t(r.name, "bn");
  const en = t(r.name, "en");
  return {
    title: `${bn}-এর আঞ্চলিক শব্দ — ${en.replace(/\s*\(.*\)/, "")} Dialect`,
    description: `${bn}-এর আঞ্চলিক শব্দ, প্রমিত বাংলা অর্থসহ, সূত্র উল্লেখ করে। ${en} dialect words with standard Bangla meanings and sources.`,
    forms: formsForRegion(r.id).length,
  };
}

export function regionMetadata(id: string): Metadata {
  const seo = regionSeo(id);
  if (!seo) return { title: "Region not found", robots: { index: false } };
  return pageMetadata({ ...seo, path: `/games/word-map/${id}`, type: "article", noindex: seo.forms < REGION_INDEX_MIN, defaultImage: true });
}
