import { describe, expect, it } from "vitest";
import { BLOG_POSTS } from "@/data/blog";
import { blogProblems, readingMinutes, relatedPosts, wordCount, type BlogContext, type BlogPost } from "@/lib/blog";
import { blogContext, publishedPosts } from "@/lib/blog-content";
import { DESC_MAX, DESC_MIN, fullTitle, TITLE_MAX } from "@/lib/seo";
import { GET } from "@/app/blog/feed.xml/route";

// TEST-ONLY fixtures: obviously fake text, never real claims.
const bi = (s: string) => ({ en: s, bn: `পরীক্ষা ${s}` });
const para = (i: number, n = 60) => ({ kind: "p" as const, text: bi(`Fixture paragraph ${i} ` + Array.from({ length: n }, (_, k) => `word${k}`).join(" ")) });
function post(slug: string, extra: Partial<BlogPost> = {}): BlogPost {
  return {
    slug,
    status: "published",
    published: "2026-01-01",
    topic: "places",
    title: bi(`Title ${slug}`),
    seo: { en: { title: `SEO ${slug}`, description: `Desc ${slug}` }, bn: { title: `এসইও ${slug}`, description: `বিবরণ ${slug}` } },
    lead: bi(`Lead ${slug}`),
    cover: { emoji: "📝", accent: "sky" },
    body: [{ kind: "h2", text: bi(`A ${slug}`) }, para(1), { kind: "h2", text: bi(`B ${slug}`) }, para(2), { kind: "h2", text: bi(`C ${slug}`) }, ...[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => para(i + slug.length * 100))],
    play: ["g:test"],
    sources: [{ title: "Fixture source", url: "https://example.com/source" }],
    ...extra,
  };
}
const ctx: BlogContext = { activities: new Set(["g:test"]), districts: new Set(["dhaka"]), paths: new Set(["/games"]), others: ["Copied guide line"], today: "2026-10-26" };

describe("blog validation (fixtures)", () => {
  it("accepts a good post", () => {
    expect(blogProblems([post("ok")], ctx)).toEqual([]);
  });

  it("catches the usual mistakes", () => {
    const run = (p: BlogPost, others: BlogPost[] = []) => blogProblems([p, ...others], ctx).join("\n");
    expect(run(post("a"), [post("a")])).toMatch(/duplicate slug/);
    expect(run(post("a", { play: ["g:nope"] }))).toMatch(/unknown activity g:nope/);
    expect(run(post("a", { body: [...post("a").body, { kind: "map", districts: ["narnia"] }] }))).toMatch(/unknown district narnia/);
    expect(run(post("a", { lead: bi("See [this](/nowhere)") }))).toMatch(/broken link \/nowhere/);
    expect(run(post("a", { lead: bi("See [games](/games?x=1)") }))).not.toMatch(/broken link/);
    expect(run(post("a", { sources: [] }))).toMatch(/needs sources/);
    expect(run(post("a", { published: "2099-01-01" }))).toMatch(/not in the future/);
    expect(run(post("a", { updated: "2025-01-01" }))).toMatch(/bad updated date/);
    expect(run(post("a", { title: { en: "Only English", bn: "" } }))).toMatch(/needs EN \+ BN/);
    expect(run(post("a", { body: [{ kind: "h2", text: bi("x") }, para(1)] }))).toMatch(/needs ≥ 3 sections[\s\S]*only \d+ English words/);
    expect(run(post("a", { body: [...post("a").body, { kind: "p", text: bi("Copied guide line") }] }))).toMatch(/duplicated from another page/);
    expect(run(post("a"), [post("b", { body: [...post("b").body, para(301)] })])).toMatch(/duplicated from blog:a/);
  });

  it("drafts skip date checks (the owner sets the date when publishing)", () => {
    expect(blogProblems([post("d", { status: "needs_review", published: "" })], ctx)).toEqual([]);
  });

  it("reading time and related posts", () => {
    const p = post("r");
    expect(wordCount(p)).toBeGreaterThanOrEqual(600);
    expect(readingMinutes(p)).toBe(Math.ceil(wordCount(p) / 200));
    expect(readingMinutes({ body: [] })).toBe(1);
    const pool = [post("x", { topic: "language", published: "2026-05-01" }), post("y", { published: "2026-02-01" }), post("z", { published: "2026-03-01" }), post("r")];
    expect(relatedPosts(pool[3]!, pool).map((q) => q.slug)).toEqual(["z", "y", "x"]);
  });
});

describe("real blog content", () => {
  it("validates (drafts included)", () => {
    expect(blogProblems(BLOG_POSTS, blogContext())).toEqual([]);
  });

  it("every article's search title/description fits (checked before it's published)", () => {
    for (const p of BLOG_POSTS)
      for (const lang of ["en", "bn"] as const) {
        const { title, description } = p.seo[lang];
        expect(fullTitle(title).length, `${p.slug} ${lang} title`).toBeLessThanOrEqual(TITLE_MAX);
        expect(description.length, `${p.slug} ${lang} description`).toBeGreaterThanOrEqual(DESC_MIN);
        expect(description.length, `${p.slug} ${lang} description`).toBeLessThanOrEqual(DESC_MAX);
      }
  });

  it("only owner-published posts are public; drafts carry no date", () => {
    for (const p of BLOG_POSTS) if (p.status !== "published") expect(p.published).toBe("");
    expect(publishedPosts().every((p) => p.status === "published")).toBe(true);
  });

  it("RSS feed is well-formed and lists only published posts", async () => {
    const xml = await GET().text();
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect((xml.match(/<item>/g) ?? []).length).toBe(publishedPosts().length);
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
    for (const p of BLOG_POSTS.filter((x) => x.status !== "published")) expect(xml).not.toContain(p.slug);
  });
});
