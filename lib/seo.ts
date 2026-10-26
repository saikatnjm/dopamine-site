// One place for page metadata + JSON-LD (Phase 49). Every indexable page builds
// its <head> through pageMetadata(), so canonical, Open Graph, Twitter and
// robots are always complete and consistent (Next replaces a parent's
// openGraph object instead of merging it — a page that sets only a title would
// otherwise share the homepage's og:url and title).
//
// Rules (checked by tests/seo.test.ts): full title incl. TITLE_SUFFIX ≤ TITLE_MAX,
// description DESC_MIN–DESC_MAX, titles + descriptions unique across indexable
// pages. JSON-LD only states facts (no ratings, counts or reviews).

import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n/core";
import { localePath } from "@/lib/i18n/paths";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const TITLE_SUFFIX = ` · ${siteConfig.name}`;
export const TITLE_MAX = 70;
export const DESC_MIN = 70;
export const DESC_MAX = 160;

/**
 * Site-wide share image (app/opengraph-image.tsx), for routes WITHOUT their own
 * opengraph-image file. Don't pass it where a file exists: explicit metadata
 * images win over the file convention.
 */
const DEFAULT_OG = { url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name };

export type PageSeo = { title: string; description: string };

export type PageMetaInput = PageSeo & {
  /** Language-neutral path ("/games/x"); the /bn variant is derived. */
  path: string;
  lang: Lang;
  noindex?: boolean;
  type?: "website" | "article";
  /** Use the title as-is (no " · Hottogol"), e.g. the homepage. */
  absoluteTitle?: boolean;
  /** The route has no opengraph-image file: use the site-wide card. */
  defaultImage?: boolean;
};

export const OG_LOCALE: Record<Lang, string> = { en: "en_US", bn: "bn_BD" };

export function pageMetadata({ path, lang, title, description, noindex, type = "website", absoluteTitle, defaultImage }: PageMetaInput): Metadata {
  const canonical = localePath(path, lang);
  return {
    // A title that already names the site ("Daily Hottogol…") skips the suffix.
    title: absoluteTitle || title.includes(siteConfig.name) ? { absolute: title } : title,
    description,
    // Each language is its own URL; hreflang ties the pair together (x-default = English).
    alternates: { canonical, languages: { en: localePath(path, "en"), bn: localePath(path, "bn"), "x-default": localePath(path, "en") } },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
      locale: OG_LOCALE[lang],
      alternateLocale: [OG_LOCALE[lang === "bn" ? "en" : "bn"]],
      title,
      description,
      ...(defaultImage ? { images: [DEFAULT_OG] } : {}),
    },
    // No twitter.images: Next falls back to the (file-based) og:image.
    twitter: { card: "summary_large_image", title, description },
  };
}

/** The <title> Google shows (template from app/layout.tsx; see pageMetadata). */
export const fullTitle = (title: string) => (title.includes(siteConfig.name) ? title : `${title}${TITLE_SUFFIX}`);

// ---- JSON-LD ----------------------------------------------------------------

type Ld = Record<string, unknown>;

export const organizationLd = (): Ld => ({
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: siteConfig.name,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/icon.svg"),
});

/** Publisher/author reference for page-level entities. */
const publisherRef = { "@id": absoluteUrl("/#organization") };

export type Crumb = { name: string; path?: string };

export function breadcrumbLd(items: readonly Crumb[], lang: Lang = "en"): Ld {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: absoluteUrl(localePath(c.path, lang)) } : {}),
    })),
  };
}

export function itemListLd(name: string, items: readonly { name: string; path: string }[], lang: Lang = "en"): Ld {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absoluteUrl(localePath(it.path, lang)) })),
  };
}

/**
 * Enrich an activity's own JSON-LD (VideoGame, Quiz, WebApplication…) with the
 * facts every activity shares: canonical URL, share image, publisher, platform,
 * free, languages.
 */
export function activityLd(path: string, ld: Ld, lang: Lang, opts: { image?: string } = {}): Ld {
  return {
    isAccessibleForFree: true,
    ...ld,
    inLanguage: lang,
    url: absoluteUrl(localePath(path, lang)),
    image: absoluteUrl(localePath(opts.image ?? `${path}/opengraph-image`, lang)),
    publisher: publisherRef,
    author: publisherRef,
    ...(ld["@type"] === "VideoGame" ? { gamePlatform: "Web browser", operatingSystem: "Any (web browser)", applicationCategory: "Game" } : {}),
  };
}

/** Serialise one or more JSON-LD nodes for a <script type="application/ld+json">. `<` is escaped so data can't close the tag. */
export function ldJson(...nodes: Ld[]): string {
  // One @context at the top; nodes may carry their own (older call sites), drop it.
  const bare = nodes.map((n) => Object.fromEntries(Object.entries(n).filter(([k]) => k !== "@context")));
  const data = bare.length === 1 ? { "@context": "https://schema.org", ...bare[0] } : { "@context": "https://schema.org", "@graph": bare };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
