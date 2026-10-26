import { PostCard } from "@/components/blog/post-card";
import { TopicFilter } from "@/components/blog/topic-filter";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { BLOG_TOPICS, TOPIC_LABELS } from "@/lib/blog";
import { publishedPosts, visiblePosts } from "@/lib/blog-content";
import { t } from "@/lib/i18n/core";
import { localePath } from "@/lib/i18n/paths";
import { getI18n } from "@/lib/i18n/server";
import { blogIndexMetadata } from "@/lib/seo-pages";
import { pageSeo } from "@/lib/seo-text";
import { absoluteUrl } from "@/lib/site";

export const generateMetadata = () => blogIndexMetadata(publishedPosts().length > 0);

export default async function BlogPage() {
  const { lang, d } = await getI18n();
  const posts = visiblePosts();
  const topics = BLOG_TOPICS.filter((tp) => posts.some((p) => p.topic === tp)).map((tp) => ({ id: tp, label: t(TOPIC_LABELS[tp], lang) }));
  const seo = pageSeo("blog", lang);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6">
      <JsonLd
        ld={{
          "@type": "Blog",
          name: seo.title,
          description: seo.description,
          url: absoluteUrl(localePath("/blog", lang)),
          inLanguage: lang,
          publisher: { "@id": absoluteUrl("/#organization") },
          blogPost: publishedPosts().map((p) => ({
            "@type": "BlogPosting",
            headline: p.title[lang],
            url: absoluteUrl(localePath(`/blog/${p.slug}`, lang)),
            datePublished: p.published,
          })),
        }}
      />
      <Breadcrumbs items={[{ name: d.navBlog }]} />
      <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
        <span aria-hidden>📝</span> {d.blogTitle}
      </h1>
      <p className="mt-2 max-w-2xl text-lg text-ink-muted">{d.blogIntro}</p>
      {topics.length > 1 && <TopicFilter topics={topics} allLabel={d.blogAll} listId="blog-list" />}
      {posts.length > 0 ? (
        <ul id="blog-list" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug} className="flex">
              <PostCard post={p} lang={lang} d={d} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-card border-2 border-dashed border-ink/60 bg-surface/60 p-6 text-lg">{d.blogEmpty}</p>
      )}
      <p className="mt-10 text-sm font-bold">
        <a href="/blog/feed.xml" className="underline underline-offset-4">
          {d.blogFeed}
        </a>
      </p>
    </main>
  );
}
