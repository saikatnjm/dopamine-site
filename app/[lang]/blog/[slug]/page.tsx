import { notFound } from "next/navigation";
import { postDate, PostCard } from "@/components/blog/post-card";
import { PostBody } from "@/components/blog/post-body";
import { TrackClicks } from "@/components/blog/track-clicks";
import { ActivityCard } from "@/components/experience/activity-card";
import { RelatedLinks } from "@/components/related/related-links";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { card } from "@/components/ui/styles";
import { listActivities } from "@/lib/activities";
import { readingMinutes, TOPIC_LABELS } from "@/lib/blog";
import { getVisiblePost, isDraft, moreFromBlog, visiblePosts } from "@/lib/blog-content";
import { fmt, num, t } from "@/lib/i18n/core";
import { localePath } from "@/lib/i18n/paths";
import { getI18n } from "@/lib/i18n/server";
import { blogPostMetadata } from "@/lib/seo-pages";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return visiblePosts().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  return blogPostMetadata(getVisiblePost((await params).slug));
}

export default async function BlogPostPage({ params }: Props) {
  const [{ slug }, { lang, d }] = await Promise.all([params, getI18n()]);
  const post = getVisiblePost(slug);
  if (!post) notFound();
  const activities = listActivities(lang);
  const plays = post.play.map((k) => activities.find((a) => a.key === k)).filter((a) => a !== undefined);
  const more = moreFromBlog(post);
  const url = absoluteUrl(localePath(`/blog/${post.slug}`, lang));
  const date = post.updated ?? post.published;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6">
      {!isDraft(post) && (
        <JsonLd
          ld={[
            {
              "@type": "BlogPosting",
              headline: post.title[lang],
              description: post.seo[lang].description,
              datePublished: post.published,
              dateModified: date,
              inLanguage: lang,
              url,
              mainEntityOfPage: url,
              image: absoluteUrl(localePath(`/blog/${post.slug}/opengraph-image`, lang)),
              // Never a person (standing instruction 9): the site itself publishes.
              publisher: { "@id": absoluteUrl("/#organization") },
              author: { "@id": absoluteUrl("/#organization") },
            },
            ...(post.faq?.length
              ? [
                  {
                    "@type": "FAQPage",
                    mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q[lang], acceptedAnswer: { "@type": "Answer", text: f.a[lang] } })),
                  },
                ]
              : []),
          ]}
        />
      )}
      <Breadcrumbs items={[{ name: d.navBlog, path: "/blog" }, { name: post.title[lang] }]} />
      {isDraft(post) && <p className="mt-4 rounded-2xl border-2 border-dashed border-chili bg-chili/15 p-3 text-sm font-bold">{d.blogDraftBanner}</p>}

      <article className="mt-4">
        <header>
          <p className="text-sm font-extrabold uppercase tracking-wider text-ink-muted">
            <span aria-hidden>{post.cover.emoji}</span> {t(TOPIC_LABELS[post.topic], lang)}
          </p>
          <h1 className="mt-1 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{post.title[lang]}</h1>
          <p className="mt-3 text-sm font-bold text-ink-muted">
            {isDraft(post) ? d.blogDraft : post.updated ? fmt(d.blogUpdated, { date: postDate(post.updated, lang) }) : postDate(post.published, lang)} ·{" "}
            {fmt(d.blogMinutes, { n: num(readingMinutes(post), lang) })}
          </p>
          <p className="mt-4 text-xl font-bold leading-relaxed">{post.lead[lang]}</p>
        </header>

        <div className="mt-6">
          <PostBody blocks={post.body} lang={lang} activities={activities} mapTitle={post.title[lang]} />
        </div>
      </article>

      {plays.length > 0 && (
        <section aria-labelledby="blog-play" className="mt-12">
          <h2 id="blog-play" className="font-display text-2xl font-extrabold sm:text-3xl">
            {d.blogPlay}
          </h2>
          <TrackClicks source="blog" from={`blog:${post.slug}`} hrefs={Object.fromEntries(plays.map((a) => [a.href.split(/[?#]/)[0]!, a.key]))}>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {plays.map((a) => (
                <ActivityCard key={a.key} activity={a} lang={lang} />
              ))}
            </div>
          </TrackClicks>
        </section>
      )}

      {post.faq && post.faq.length > 0 && (
        <section aria-labelledby="blog-faq" className="mt-12">
          <h2 id="blog-faq" className="font-display text-2xl font-extrabold sm:text-3xl">
            {d.guideFaq}
          </h2>
          <div className="mt-4 grid gap-3">
            {post.faq.map((f, i) => (
              <div key={i} className={`${card} p-5`}>
                <h3 className="font-display text-xl font-extrabold">{f.q[lang]}</h3>
                <p className="mt-1 text-ink-muted">{f.a[lang]}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="blog-sources" className="mt-12">
        <h2 id="blog-sources" className="font-display text-xl font-extrabold">
          {d.blogSources}
        </h2>
        <ul className="mt-3 grid list-disc gap-1.5 pl-6 text-ink-muted">
          {post.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-words underline underline-offset-4 hover:text-ink">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {more.length > 0 && (
        <section aria-labelledby="blog-more" className="mt-12">
          <h2 id="blog-more" className="font-display text-2xl font-extrabold sm:text-3xl">
            {d.blogMore}
          </h2>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2">
            {more.map((p) => (
              <li key={p.slug} className="flex">
                <PostCard post={p} lang={lang} d={d} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {post.play[0] && <RelatedLinks current={post.play[0]} />}
    </main>
  );
}
