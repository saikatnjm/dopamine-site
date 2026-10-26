import { describe, expect, it } from "vitest";
import { GAME_HREF_OVERRIDES, listGames } from "@/data/games";
import { GUIDE_SLUGS } from "@/data/guides";
import { NOINDEX_PAGES, PAGE_SEO, type PageSeoId } from "@/data/seo";
import { SEO_BN } from "@/data/seo-bn";
import { gameIsPlayable } from "@/lib/activities";
import { publishedPosts } from "@/lib/blog-content";
import { listRegions, REGION_INDEX_MIN } from "@/lib/dialects/content";
import { listCategories, listExperiences } from "@/lib/experience/registry";
import { LANGS, type Lang } from "@/lib/i18n/core";
import { localePath, stripLang } from "@/lib/i18n/paths";
import { breadcrumbLd, DESC_MAX, DESC_MIN, fullTitle, ldJson, TITLE_MAX } from "@/lib/seo";
import { categorySeo, experienceSeo, gameSeo, guideSeo, pageSeo, regionSeo } from "@/lib/seo-text";

type Entry = { page: string; key?: string; title: string; description: string };

/** Every indexable page's search title (as Google shows it) and description, in one language. */
function indexable(lang: Lang): Entry[] {
  const out: Entry[] = [];
  const add = (page: string, s: { title: string; description: string }, key?: string) =>
    out.push({ page, key, title: fullTitle(s.title), description: s.description });
  for (const id of Object.keys(PAGE_SEO) as PageSeoId[]) if (!NOINDEX_PAGES.includes(id)) add(id, pageSeo(id, lang), `page:${id}`);
  for (const g of listGames()) {
    if (g.slug in GAME_HREF_OVERRIDES || !gameIsPlayable(g.slug)) continue;
    add(`game:${g.slug}`, gameSeo(g.slug, lang)!, `game:${g.slug}`);
  }
  for (const e of listExperiences()) add(`exp:${e.slug}`, experienceSeo(e.slug, lang)!, `exp:${e.slug}`);
  for (const s of GUIDE_SLUGS) add(`guide:${s}`, guideSeo(s, lang), `guide:${s}`);
  for (const c of listCategories()) {
    const seo = categorySeo(c.slug, lang)!;
    if (seo.live > 0) add(`cat:${c.slug}`, seo);
  }
  for (const r of listRegions()) {
    const seo = regionSeo(r.id, lang)!;
    if (seo.forms >= REGION_INDEX_MIN) add(`region:${r.id}`, seo);
  }
  for (const p of publishedPosts()) add(`blog:${p.slug}`, p.seo[lang]);
  return out;
}

describe.each(LANGS)("search titles + descriptions (%s)", (lang) => {
  const all = indexable(lang);

  it("covers every page type", () => {
    expect(all.length).toBeGreaterThan(40);
  });

  it(`full titles ≤ ${TITLE_MAX} chars`, () => {
    const long = all.filter((e) => e.title.length > TITLE_MAX).map((e) => `${e.page} (${e.title.length}): ${e.title}`);
    expect(long).toEqual([]);
  });

  it(`descriptions ${DESC_MIN}–${DESC_MAX} chars`, () => {
    const bad = all
      .filter((e) => e.description.length < DESC_MIN || e.description.length > DESC_MAX)
      .map((e) => `${e.page} (${e.description.length})`);
    expect(bad).toEqual([]);
  });

  it("titles and descriptions are unique", () => {
    const dup = (key: "title" | "description") => {
      const seen = new Map<string, string>();
      const out: string[] = [];
      for (const e of all) {
        const prev = seen.get(e[key]);
        if (prev) out.push(`${prev} = ${e.page}`);
        seen.set(e[key], e.page);
      }
      return out;
    };
    expect(dup("title")).toEqual([]);
    expect(dup("description")).toEqual([]);
  });

  it("titles don't repeat the brand suffix", () => {
    expect(all.filter((e) => /Hottogol.*Hottogol/.test(e.title)).map((e) => e.page)).toEqual([]);
  });
});

describe("Bangla SEO coverage", () => {
  it("every registry page has a Bangla entry, and no entry is orphaned", () => {
    const keys = indexable("en").flatMap((e) => (e.key ? [e.key] : []));
    expect(keys.filter((k) => !SEO_BN[k])).toEqual([]);
    // Hidden-for-now games (no content yet) keep their entry for when they become playable.
    const known = new Set([...keys, ...NOINDEX_PAGES.map((id) => `page:${id}`), ...listGames().map((g) => `game:${g.slug}`)]);
    expect(Object.keys(SEO_BN).filter((k) => !known.has(k))).toEqual([]);
  });
});

describe("language paths", () => {
  it("localePath / stripLang", () => {
    expect(localePath("/", "bn")).toBe("/bn");
    expect(localePath("/games/x?s=1#a", "bn")).toBe("/bn/games/x?s=1#a");
    expect(localePath("/?go=1", "bn")).toBe("/bn?go=1");
    expect(localePath("/bn/games", "bn")).toBe("/bn/games");
    expect(localePath("/bn/games", "en")).toBe("/games");
    expect(localePath("/bn", "en")).toBe("/");
    expect(localePath("https://x.com/a", "bn")).toBe("https://x.com/a");
    expect(localePath("//cdn.x/a", "bn")).toBe("//cdn.x/a");
    expect(localePath("/bnx", "bn")).toBe("/bn/bnx");
    expect(stripLang("/en/games")).toBe("/games");
    expect(stripLang("/en")).toBe("/");
    expect(stripLang("/bn?x=1")).toBe("/?x=1");
  });
});

describe("json-ld", () => {
  it("breadcrumbs number from 1, link all but the current page", () => {
    const ld = breadcrumbLd([{ name: "Hottogol", path: "/" }, { name: "Games", path: "/games" }, { name: "CNG Catch" }]) as {
      itemListElement: { position: number; item?: string }[];
    };
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(ld.itemListElement[2]!.item).toBeUndefined();
    expect(ld.itemListElement[1]!.item).toMatch(/\/games$/);
  });

  it("escapes < so data can't close the script tag", () => {
    const out = ldJson({ "@type": "Thing", name: "</script><b>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).name).toBe("</script><b>");
  });
});
