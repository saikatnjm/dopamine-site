import { publishedPosts } from "@/lib/blog-content";
import { absoluteUrl, siteConfig } from "@/lib/site";

// RSS 2.0 of published articles (English titles + leads; owner decision v1).
// Lives outside app/[lang] so /blog/feed.xml is served as-is (proxy skips .xml).

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const rfc822 = (date: string) => new Date(`${date}T00:00:00+06:00`).toUTCString();

export const dynamic = "force-static";

export function GET() {
  const posts = publishedPosts();
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`);
      return `    <item>
      <title>${esc(p.title.en)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${rfc822(p.published)}</pubDate>
      <description>${esc(p.lead.en)}</description>
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${siteConfig.name} blog`)}</title>
    <link>${esc(absoluteUrl("/blog"))}</link>
    <atom:link href="${esc(absoluteUrl("/blog/feed.xml"))}" rel="self" type="application/rss+xml" />
    <description>Traditional games, places and words of Bangladesh — and where to play them.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
