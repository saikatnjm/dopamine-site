import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { accentBg, btnPrimary, card, chip } from "@/components/ui/styles";
import { wordsCopy as copy } from "@/data/dialects/copy";
import { getDistrict, getVerifiedWord, quizPool, verifiedWords, wordIsIndexable } from "@/lib/dialects/content";
import { canPlay } from "@/lib/games/ancholik-quiz";
import { fmt, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

// One reviewed dialect word. Drafts and words awaiting review have no page
// (404). A page is indexable only with a real example sentence — otherwise
// it's too thin for search and stays noindex.

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const w = getVerifiedWord(slug);
  if (!w) return { title: "Word not found", robots: { index: false } };
  const places = w.districtIds.map((id) => getDistrict(id)).filter(Boolean);
  const placesBn = places.map((d) => t(d!.name, "bn")).join(", ");
  const placesEn = places.map((d) => t(d!.name, "en")).join(", ");
  const title = `${w.localWord} মানে কী? — আঞ্চলিক শব্দ, ${placesBn} (${placesEn} dialect)`;
  const description = `“${w.localWord}” (${placesBn}) — প্রমিত বাংলায় “${w.standardWord}”: ${w.meaningBn}।${w.meaningEn ? ` Meaning: ${w.meaningEn}.` : ""} Reviewed by people.`;
  return {
    title,
    description,
    alternates: { canonical: `/games/words/${w.id}` },
    robots: wordIsIndexable(w) ? undefined : { index: false, follow: true },
    openGraph: { type: "article", url: `/games/words/${w.id}`, title, description },
  };
}

export default async function WordPage({ params }: Props) {
  const [{ slug }, { lang }] = await Promise.all([params, getI18n()]);
  const w = getVerifiedWord(slug);
  if (!w) notFound();

  const places = w.districtIds.map((id) => getDistrict(id)).filter((d) => d !== undefined);
  const home = places[0];
  const pool = quizPool();
  const playable = home ? canPlay(pool, home.id, "hard") : false;
  const more = home
    ? verifiedWords()
        .filter((x) => x.id !== w.id && x.districtIds.includes(home.id))
        .slice(0, 6)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: w.localWord,
    description: `${w.standardWord} — ${w.meaningBn}`,
    inLanguage: "bn",
    url: absoluteUrl(`/games/words/${w.id}`),
    inDefinedTermSet: { "@type": "DefinedTermSet", name: "আঞ্চলিক শব্দভান্ডার", url: absoluteUrl("/games/words") },
  };

  const row = "grid gap-0.5 border-t-2 border-dashed border-ink/20 py-3";
  const label = "text-xs font-extrabold uppercase tracking-wider text-ink-muted";

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-muted">
        <Link href="/games/words" className="hover:text-ink">
          {t(copy.allWords, lang)}
        </Link>
      </nav>

      <article className={`${card} mt-4 p-5`}>
        <p className="text-sm font-extrabold">
          {places.map((d) => `${d.emoji} ${t(d.name, lang)}`).join(" · ")} · <span className="text-ink-muted">{t(copy.reviewed, lang)}</span>
        </p>
        <h1 className="mt-2 font-display text-5xl font-black leading-tight" lang="bn">
          {w.localWord}
        </h1>
        {w.pronunciation && (
          <p className="mt-1 font-bold text-ink-muted">
            {t(copy.pronunciation, lang)}: <span lang="bn">{w.pronunciation}</span>
          </p>
        )}
        <dl className="mt-4">
          <div className={row}>
            <dt className={label}>{t(copy.standard, lang)}</dt>
            <dd className="text-xl font-extrabold" lang="bn">
              {w.standardWord}
            </dd>
          </div>
          <div className={row}>
            <dt className={label}>{t(copy.meaning, lang)}</dt>
            <dd className="font-bold" lang="bn">
              {w.meaningBn}
            </dd>
          </div>
          {w.meaningEn && (
            <div className={row}>
              <dt className={label}>{t(copy.meaningEn, lang)}</dt>
              <dd className="font-bold" lang="en">
                {w.meaningEn}
              </dd>
            </div>
          )}
          {w.exampleSentence && (
            <div className={row}>
              <dt className={label}>{t(copy.example, lang)}</dt>
              <dd className="font-bold" lang="bn">
                “{w.exampleSentence}”
              </dd>
            </div>
          )}
          {w.variants.length > 0 && (
            <div className={row}>
              <dt className={label}>{t(copy.variants, lang)}</dt>
              <dd className="font-bold" lang="bn">
                {w.variants.join(", ")}
              </dd>
            </div>
          )}
          <div className={row}>
            <dt className={label}>{t(copy.source, lang)}</dt>
            <dd className="text-sm font-semibold">
              {w.source}
              {w.contributor && ` · ${t(copy.contributor, lang)} ${w.contributor}`}
            </dd>
          </div>
        </dl>
      </article>

      {playable && home && (
        <Link href={`/games/ancholik-quiz?district=${home.id}`} className={`${btnPrimary} ${accentBg.sky} mt-5 w-full`}>
          {fmt(t(copy.playDistrict, lang), { district: t(home.name, lang) })}
        </Link>
      )}

      {more.length > 0 && home && (
        <section className="mt-8" aria-labelledby="more-words">
          <h2 id="more-words" className="font-display text-2xl font-extrabold">
            {fmt(t(copy.more, lang), { district: t(home.name, lang) })}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {more.map((x) => (
              <li key={x.id}>
                <Link href={`/games/words/${x.id}`} className={chip} lang="bn">
                  {x.localWord}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="mt-6 text-xs font-bold text-ink-muted">{t(copy.variesNote, lang)}</p>
    </main>
  );
}
