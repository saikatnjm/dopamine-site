// Search titles + descriptions per language (pure; used by lib/seo-pages.ts and
// tests/seo.test.ts). English lives in the registries / data/seo.ts, Bangla in
// data/seo-bn.ts. Pages with no Bangla entry fall back to English.

import { getGame } from "@/data/games";
import { guides, type GuideSlug } from "@/data/guides";
import { PAGE_SEO, type PageSeoId } from "@/data/seo";
import { SEO_BN } from "@/data/seo-bn";
import { formsForRegion, getRegion } from "@/lib/dialects/content";
import { experiencesInCategory, getCategory, getExperience } from "@/lib/experience/registry";
import { t, type Lang } from "@/lib/i18n/core";
import type { PageSeo } from "@/lib/seo";

const pick = (key: string, en: PageSeo, lang: Lang): PageSeo => (lang === "bn" ? (SEO_BN[key] ?? en) : en);

export const pageSeo = (id: PageSeoId, lang: Lang) => pick(`page:${id}`, PAGE_SEO[id], lang);

export function gameSeo(slug: string, lang: Lang): PageSeo | null {
  const g = getGame(slug);
  return g ? pick(`game:${slug}`, g.seo, lang) : null;
}

export function experienceSeo(slug: string, lang: Lang): PageSeo | null {
  const e = getExperience(slug);
  return e ? pick(`exp:${e.slug}`, e.seo, lang) : null;
}

export const guideSeo = (slug: GuideSlug, lang: Lang) => pick(`guide:${slug}`, guides[slug].seo, lang);

export function categorySeo(slug: string, lang: Lang): (PageSeo & { live: number }) | null {
  const category = getCategory(slug);
  if (!category) return null;
  const live = experiencesInCategory(category.slug).length;
  const name = t(category.title, lang);
  if (lang === "bn") {
    return {
      title: `${name} নিয়ে মজার সিমুলেটর — এক মিনিটের গেম`,
      description: `${t(category.description, "bn")} ${name} নিয়ে এক মিনিটের ফ্রি মজার সিমুলেটর, সাইন-আপ লাগে না।`,
      live,
    };
  }
  return {
    title: `${name} Simulators — Free Funny One-Minute Games`,
    description: `${t(category.description, "en")} Free one-minute ${name.toLowerCase()} simulators, no sign-up.`,
    live,
  };
}

export function regionSeo(id: string, lang: Lang): (PageSeo & { forms: number }) | null {
  const r = getRegion(id);
  if (!r) return null;
  const bn = t(r.name, "bn");
  const en = t(r.name, "en");
  const forms = formsForRegion(r.id).length;
  if (lang === "bn") {
    return {
      title: `${bn}-এর আঞ্চলিক শব্দ ও তাদের অর্থ`,
      description: `${bn}-এর আঞ্চলিক শব্দ, প্রমিত বাংলা অর্থসহ, সূত্র উল্লেখ করে। বাংলাদেশের অন্য এলাকার শব্দের সাথে মিলিয়ে দেখুন।`,
      forms,
    };
  }
  return {
    title: `${bn}-এর আঞ্চলিক শব্দ — ${en.replace(/\s*\(.*\)/, "")} Dialect`,
    description: `${bn}-এর আঞ্চলিক শব্দ, প্রমিত বাংলা অর্থসহ, সূত্র উল্লেখ করে। ${en} dialect words with standard Bangla meanings and sources.`,
    forms,
  };
}
