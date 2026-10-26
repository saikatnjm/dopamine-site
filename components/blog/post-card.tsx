import Link from "@/components/i18n/link";
import { accentBg } from "@/components/ui/styles";
import { readingMinutes, TOPIC_LABELS, type BlogPost } from "@/lib/blog";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import type { Dict } from "@/lib/i18n/dictionary";

/** Formatted date for article cards and headers (Bangla digits in bn). */
export function postDate(date: string, lang: Lang): string {
  if (!date) return "";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function PostCard({ post, lang, d }: { post: BlogPost; lang: Lang; d: Dict }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      data-topic={post.topic}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-ink bg-surface shadow-pop transition-transform hover:-translate-y-0.5"
    >
      <div aria-hidden className={`${accentBg[post.cover.accent]} grid h-24 place-items-center border-b-2 border-ink text-5xl`}>
        {post.cover.emoji}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">{t(TOPIC_LABELS[post.topic], lang)}</p>
        <h2 className="font-display text-xl font-extrabold leading-tight group-hover:underline">{post.title[lang]}</h2>
        <p className="text-ink-muted">{post.lead[lang]}</p>
        <p className="mt-auto pt-2 text-sm font-bold text-ink-muted">
          {post.status === "published" ? postDate(post.updated ?? post.published, lang) : d.blogDraft} · {fmt(d.blogMinutes, { n: num(readingMinutes(post), lang) })}
        </p>
      </div>
    </Link>
  );
}
