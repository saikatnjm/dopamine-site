import { describe, expect, it } from "vitest";
import { GAME_HREF_OVERRIDES, listGames } from "@/data/games";
import { GUIDE_SLUGS, guides } from "@/data/guides";
import { NOINDEX_PAGES, PAGE_SEO, type PageSeoId } from "@/data/seo";
import { gameIsPlayable } from "@/lib/activities";
import { listRegions, REGION_INDEX_MIN } from "@/lib/dialects/content";
import { listCategories, listExperiences } from "@/lib/experience/registry";
import { breadcrumbLd, DESC_MAX, DESC_MIN, fullTitle, ldJson, TITLE_MAX } from "@/lib/seo";
import { categorySeo, regionSeo } from "@/lib/seo-pages";

type Entry = { page: string; title: string; description: string };

/** Every indexable page's search title (as Google shows it) and description. */
function indexable(): Entry[] {
  const out: Entry[] = [];
  for (const id of Object.keys(PAGE_SEO) as PageSeoId[]) {
    if (NOINDEX_PAGES.includes(id)) continue;
    const s = PAGE_SEO[id];
    out.push({ page: id, title: fullTitle(s.title), description: s.description });
  }
  for (const g of listGames()) {
    if (g.slug in GAME_HREF_OVERRIDES || !gameIsPlayable(g.slug)) continue;
    out.push({ page: `game:${g.slug}`, title: fullTitle(g.seo.title), description: g.seo.description });
  }
  for (const e of listExperiences()) out.push({ page: `exp:${e.slug}`, title: fullTitle(e.seo.title), description: e.seo.description });
  for (const s of GUIDE_SLUGS) out.push({ page: `guide:${s}`, title: fullTitle(guides[s].seo.title), description: guides[s].seo.description });
  for (const c of listCategories()) {
    const seo = categorySeo(c.slug)!;
    if (seo.live > 0) out.push({ page: `cat:${c.slug}`, title: fullTitle(seo.title), description: seo.description });
  }
  for (const r of listRegions()) {
    const seo = regionSeo(r.id)!;
    if (seo.forms >= REGION_INDEX_MIN) out.push({ page: `region:${r.id}`, title: fullTitle(seo.title), description: seo.description });
  }
  return out;
}

describe("search titles + descriptions", () => {
  const all = indexable();

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
