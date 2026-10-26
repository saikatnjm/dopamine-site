// Blog (Phase 50): researched articles that answer an informational search
// and send the reader into a matching game. Content is validated TypeScript in
// data/blog/ (no MDX/CMS). Only the OWNER sets status "published" + the date;
// drafts ("needs_review") are visible only in the dev server (preview), never
// in the sitemap, feed, menu or search.

import type { Accent } from "@/components/ui/styles";
import type { Text } from "@/lib/i18n/core";

export const BLOG_TOPICS = ["traditional-games", "places", "language", "dhaka-life"] as const;
export type BlogTopic = (typeof BLOG_TOPICS)[number];

export const TOPIC_LABELS: Record<BlogTopic, Text> = {
  "traditional-games": { en: "Traditional games", bn: "ঐতিহ্যবাহী খেলা" },
  places: { en: "Places", bn: "জায়গা" },
  language: { en: "Language", bn: "ভাষা" },
  "dhaka-life": { en: "Dhaka life", bn: "ঢাকার জীবন" },
};

export type BilingualText = { en: string; bn: string };

export type Block =
  | { kind: "h2"; text: BilingualText }
  | { kind: "p"; text: BilingualText }
  | { kind: "list"; ordered?: boolean; items: readonly BilingualText[] }
  | { kind: "table"; head: readonly BilingualText[]; rows: readonly (readonly BilingualText[])[] }
  | { kind: "callout"; tone: "tip" | "note"; text: BilingualText }
  | { kind: "activity"; key: string }
  | { kind: "map"; districts?: readonly string[] };

export type BlogPost = {
  /** Permanent (URLs, links): never rename or reuse. */
  slug: string;
  status: "draft" | "needs_review" | "published";
  /** YYYY-MM-DD, set by the owner when publishing. */
  published: string;
  /** YYYY-MM-DD, only when the content really changed. */
  updated?: string;
  topic: BlogTopic;
  title: BilingualText;
  seo: { en: { title: string; description: string }; bn: { title: string; description: string } };
  lead: BilingualText;
  cover: { emoji: string; accent: Accent };
  body: readonly Block[];
  /** 1–3 activity keys for "Play it now". */
  play: readonly string[];
  sources: readonly { title: string; url: string }[];
  faq?: readonly { q: BilingualText; a: BilingualText }[];
};

export const MIN_WORDS = 600;
export const MIN_SECTIONS = 3;
const SLUG_RE = /^[a-z0-9-]{1,60}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
/** `[link text](/path)` inside paragraph text — internal links only. */
export const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

/** Drafts show only in the dev server (or with BLOG_PREVIEW=1), so the owner can review them. */
export function isBlogPreview(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.BLOG_PREVIEW === "1";
}

const words = (s: string) => s.replace(LINK_RE, "$1").split(/\s+/).filter(Boolean).length;

/** English words in paragraphs, lists, callouts and tables (what a reader actually reads). */
export function wordCount(post: Pick<BlogPost, "body">): number {
  let n = 0;
  for (const b of post.body) {
    if (b.kind === "p" || b.kind === "callout") n += words(b.text.en);
    else if (b.kind === "list") n += b.items.reduce((a, i) => a + words(i.en), 0);
    else if (b.kind === "table") n += b.rows.flat().reduce((a, c) => a + words(c.en), 0);
  }
  return n;
}

/** Reading time in minutes (English words ÷ 200, at least 1). */
export const readingMinutes = (post: Pick<BlogPost, "body">) => Math.max(1, Math.ceil(wordCount(post) / 200));

export type BlogContext = {
  /** Activity keys that exist (listActivities + hidden registry entries). */
  activities: ReadonlySet<string>;
  districts: ReadonlySet<string>;
  /** Internal paths a link may point to (without /bn; query/hash ignored). */
  paths: ReadonlySet<string>;
  /** Paragraphs used elsewhere (guides, how-to) that an article must not copy. */
  others: readonly string[];
  today: string;
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
const pathOf = (href: string) => href.split(/[?#]/)[0]!.replace(/\/$/, "") || "/";

/** Problems with the blog content (empty = OK). */
export function blogProblems(posts: readonly BlogPost[], ctx: BlogContext): string[] {
  const problems: string[] = [];
  const slugs = new Set<string>();
  const seen = new Map<string, string>();
  for (const t of ctx.others) seen.set(norm(t), "another page");
  const paths = new Set([...ctx.paths, ...posts.map((p) => `/blog/${p.slug}`)]);

  for (const p of posts) {
    const at = `blog:${p.slug}`;
    if (!SLUG_RE.test(p.slug)) problems.push(`${at}: bad slug`);
    if (slugs.has(p.slug)) problems.push(`${at}: duplicate slug`);
    slugs.add(p.slug);
    if (p.status === "published") {
      if (!DATE_RE.test(p.published) || p.published > ctx.today) problems.push(`${at}: published must be a real date, not in the future`);
      if (p.updated && (!DATE_RE.test(p.updated) || p.updated < p.published || p.updated > ctx.today)) problems.push(`${at}: bad updated date`);
    }
    if (!(BLOG_TOPICS as readonly string[]).includes(p.topic)) problems.push(`${at}: unknown topic`);
    if (p.play.length < 1 || p.play.length > 3) problems.push(`${at}: needs 1–3 play keys`);
    for (const k of p.play) if (!ctx.activities.has(k)) problems.push(`${at}: unknown activity ${k}`);
    if (p.topic !== "dhaka-life" && p.sources.length === 0) problems.push(`${at}: needs sources`);
    for (const s of p.sources) if (!/^https?:\/\//.test(s.url)) problems.push(`${at}: source URL must be absolute`);

    const texts: BilingualText[] = [p.title, p.lead, ...(p.faq ?? []).flatMap((f) => [f.q, f.a])];
    let sections = 0;
    for (const b of p.body) {
      if (b.kind === "h2") sections++;
      if (b.kind === "h2" || b.kind === "p" || b.kind === "callout") texts.push(b.text);
      if (b.kind === "list") texts.push(...b.items);
      if (b.kind === "table") texts.push(...b.head, ...b.rows.flat());
      if (b.kind === "activity" && !ctx.activities.has(b.key)) problems.push(`${at}: unknown activity block ${b.key}`);
      if (b.kind === "map") for (const d of b.districts ?? []) if (!ctx.districts.has(d)) problems.push(`${at}: unknown district ${d}`);
    }
    for (const t of texts) {
      if (!t.en?.trim() || !t.bn?.trim()) problems.push(`${at}: needs EN + BN: “${(t.en || t.bn || "").slice(0, 40)}”`);
      for (const s of [t.en, t.bn]) {
        for (const m of (s ?? "").matchAll(LINK_RE)) if (!paths.has(pathOf(m[2]!))) problems.push(`${at}: broken link ${m[2]}`);
      }
    }
    if (sections < MIN_SECTIONS) problems.push(`${at}: needs ≥ ${MIN_SECTIONS} sections (h2)`);
    const n = wordCount(p);
    if (n < MIN_WORDS) problems.push(`${at}: only ${n} English words (min ${MIN_WORDS})`);
    // No paragraph copied between articles, guides and how-to text.
    for (const b of p.body) {
      if (b.kind !== "p") continue;
      for (const s of [b.text.en, b.text.bn]) {
        const k = norm(s);
        const prev = seen.get(k);
        if (prev) problems.push(`${at}: paragraph duplicated from ${prev}: “${s.slice(0, 50)}…”`);
        else seen.set(k, at);
      }
    }
  }
  return problems;
}

/** Newest first. */
export const byDate = (a: BlogPost, b: BlogPost) => (b.updated ?? b.published).localeCompare(a.updated ?? a.published) || a.slug.localeCompare(b.slug);

/** 2–3 other articles: same topic first, then newest. Never the post itself. */
export function relatedPosts(post: BlogPost, pool: readonly BlogPost[], max = 3): BlogPost[] {
  const others = pool.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.topic === post.topic).sort(byDate);
  const rest = others.filter((p) => p.topic !== post.topic).sort(byDate);
  return [...same, ...rest].slice(0, max);
}
