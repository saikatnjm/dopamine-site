// Metadata builders per page type (server-side). Pages export
// `generateMetadata = () => xMetadata(…)`; the language comes from the route
// (/bn/… or English), the text from lib/seo-text.ts.

import type { Metadata } from "next";
import type { GuideSlug } from "@/data/guides";
import { NOINDEX_PAGES, type PageSeoId } from "@/data/seo";
import { gameIsPlayable } from "@/lib/activities";
import { REGION_INDEX_MIN } from "@/lib/dialects/content";
import { getLang } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { categorySeo, experienceSeo, gameSeo, guideSeo, pageSeo, regionSeo } from "@/lib/seo-text";

/** Static pages that have their own app/[lang]/<page>/opengraph-image.tsx. */
const OWN_OG_IMAGE: ReadonlySet<PageSeoId> = new Set(["home", "games", "experiences", "bored", "boss", "daily", "world", "excuses", "dhaka-person", "about", "viral"]);

export async function staticPageMetadata(id: PageSeoId, path: string): Promise<Metadata> {
  const lang = await getLang();
  return pageMetadata({
    ...pageSeo(id, lang),
    path,
    lang,
    noindex: NOINDEX_PAGES.includes(id),
    absoluteTitle: id === "home",
    defaultImage: !OWN_OG_IMAGE.has(id),
  });
}

export async function gameMetadata(slug: string): Promise<Metadata> {
  const lang = await getLang();
  const seo = gameSeo(slug, lang);
  if (!seo) return {};
  // A dialect game without content yet is a thin page: keep it out of search until it's playable.
  return pageMetadata({ ...seo, path: `/games/${slug}`, lang, noindex: !gameIsPlayable(slug) });
}

export async function experienceMetadata(slug: string): Promise<Metadata> {
  const lang = await getLang();
  const seo = experienceSeo(slug, lang);
  return seo ? pageMetadata({ ...seo, path: `/experiences/${slug}`, lang }) : {};
}

export async function guideMetadata(slug: GuideSlug): Promise<Metadata> {
  const lang = await getLang();
  return pageMetadata({ ...guideSeo(slug, lang), path: `/${slug}`, lang });
}

export async function categoryMetadata(slug: string): Promise<Metadata> {
  const lang = await getLang();
  const seo = categorySeo(slug, lang);
  // Categories with nothing playable yet are thin pages: keep them out of search.
  return seo ? pageMetadata({ ...seo, path: `/categories/${slug}`, lang, noindex: seo.live === 0 }) : {};
}

export async function regionMetadata(id: string): Promise<Metadata> {
  const lang = await getLang();
  const seo = regionSeo(id, lang);
  if (!seo) return { title: "Region not found", robots: { index: false } };
  return pageMetadata({ ...seo, path: `/games/word-map/${id}`, lang, type: "article", noindex: seo.forms < REGION_INDEX_MIN, defaultImage: true });
}
