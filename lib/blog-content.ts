// Validated read access to the blog (Phase 50). Validation runs at import, so
// bad content fails the build (same idea as lib/dialects/content.ts).

import { BLOG_POSTS } from "@/data/blog";
import { DISTRICTS } from "@/data/dialects/districts";
import { listGames } from "@/data/games";
import { GUIDE_SLUGS, guides } from "@/data/guides";
import { HOW_TO } from "@/data/how-to";
import { listActivities } from "@/lib/activities";
import { blogProblems, byDate, isBlogPreview, relatedPosts, type BlogContext, type BlogPost } from "@/lib/blog";
import { listRegions } from "@/lib/dialects/content";
import { listCategories, listExperiences } from "@/lib/experience/registry";

const textsOf = (x: unknown): string[] => (typeof x === "string" ? [x] : x && typeof x === "object" ? Object.values(x).flatMap(textsOf) : []);

/** Everything an article may reference. */
export function blogContext(): BlogContext {
  const activities = new Set([...listGames().map((g) => `g:${g.slug}`), ...listExperiences().map((e) => `x:${e.slug}`), "p:dhaka-person", "p:excuses"]);
  const paths = new Set<string>([
    "/", "/games", "/experiences", "/bored", "/daily", "/boss", "/world", "/excuses", "/dhaka-person", "/about", "/privacy", "/terms", "/blog", "/achievements",
    ...GUIDE_SLUGS.map((s) => `/${s}`),
    ...listGames().map((g) => `/games/${g.slug}`),
    ...listExperiences().map((e) => `/experiences/${e.slug}`),
    ...listCategories().map((c) => `/categories/${c.slug}`),
    ...listRegions().map((r) => `/games/word-map/${r.id}`),
    ...listActivities("en").map((a) => a.href.split(/[?#]/)[0]!),
  ]);
  const others = [
    ...GUIDE_SLUGS.flatMap((s) => [...guides[s].intro, ...guides[s].picks.map((p) => p.why), ...(guides[s].faq ?? []).map((f) => f.a)]).flatMap(textsOf),
    ...Object.values(HOW_TO).flatMap((h) => [...h.steps, ...h.tips, ...h.faq.map((f) => f.a)]).flatMap(textsOf),
  ];
  const today = new Date(Date.now() + 6 * 3600_000).toISOString().slice(0, 10); // Bangladesh date
  return { activities, districts: new Set(DISTRICTS.map((d) => d.id)), paths, others, today };
}

const problems = blogProblems(BLOG_POSTS, blogContext());
if (problems.length) throw new Error(`Blog content is invalid:\n- ${problems.join("\n- ")}`);

/** Published articles, newest first (sitemap, feed, menu, search). */
export function publishedPosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.status === "published").sort(byDate);
}

/** What the blog pages show: published, plus drafts in preview (dev server). */
export function visiblePosts(): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.status === "published" || (isBlogPreview() && p.status === "needs_review")).sort(byDate);
}

export function getVisiblePost(slug: string): BlogPost | undefined {
  return visiblePosts().find((p) => p.slug === slug);
}

export const isDraft = (p: BlogPost) => p.status !== "published";

export function moreFromBlog(post: BlogPost): BlogPost[] {
  return relatedPosts(post, visiblePosts());
}

/** Newest published article that sends readers to this activity (for the game page's "📖 Read" link). */
export function articleFor(activityKey: string): BlogPost | undefined {
  return publishedPosts().find((p) => p.play.includes(activityKey));
}

/** Show the Blog menu link? (Once something is published, or while previewing drafts.) */
export const blogInMenu = () => visiblePosts().length > 0;
