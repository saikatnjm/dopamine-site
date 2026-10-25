import type { Metadata } from "next";
import Link from "next/link";
import { btnPrimary, card, chip, accentBg } from "@/components/ui/styles";
import { wordsCopy as copy } from "@/data/dialects/copy";
import { gameIsPlayable } from "@/lib/activities";
import { getDistrict, listDistricts, verifiedWords, WORDS_INDEX_MIN } from "@/lib/dialects/content";
import type { DialectWord } from "@/lib/dialects/types";
import { resolveScope } from "@/lib/games/ancholik-quiz";
import { fmt, num, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

// Searchable list of reviewed dialect words. Server-rendered with a plain GET
// form (?q=&district=), so it works without JavaScript and stays crawlable.
// Indexed only once it has enough reviewed words to be genuinely useful.

type Props = { searchParams: Promise<{ q?: string | string[]; district?: string | string[] }> };

const title = "আঞ্চলিক শব্দভান্ডার — Bangladesh Regional Dialect Words & Meanings";
const description =
  "বাংলাদেশের আঞ্চলিক ভাষার শব্দ ও প্রমিত বাংলা অর্থ — যশোর, খুলনা, বরিশাল, নোয়াখালী, সিলেট, চট্টগ্রাম। Regional Bangla dialect words with meanings, reviewed by people.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    alternates: { canonical: "/games/words" },
    robots: verifiedWords().length >= WORDS_INDEX_MIN ? undefined : { index: false, follow: true },
    openGraph: { type: "website", url: "/games/words", title, description },
  };
}

function first(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v)?.slice(0, 60) ?? "";
}

function norm(s: string): string {
  return s.normalize("NFC").toLowerCase().trim();
}

function matches(w: DialectWord, q: string): boolean {
  if (!q) return true;
  const hay = [w.localWord, w.standardWord, w.meaningBn, w.meaningEn ?? "", ...w.variants, ...w.districtIds.flatMap((id) => {
    const d = getDistrict(id);
    return d ? [d.id, t(d.name, "en"), t(d.name, "bn"), ...d.aliases] : [];
  })];
  return hay.some((h) => norm(h).includes(q));
}

export default async function WordsPage({ searchParams }: Props) {
  const [params, { lang, d }] = await Promise.all([searchParams, getI18n()]);
  const q = norm(first(params.q));
  const district = resolveScope(params.district);
  const all = verifiedWords();
  const words = all
    .filter((w) => (district && district !== "mixed" ? w.districtIds.includes(district) : true) && matches(w, q))
    .sort((a, b) => a.localWord.localeCompare(b.localWord, "bn"));
  const districts = listDistricts();
  const quizLive = gameIsPlayable("ancholik-quiz");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "আঞ্চলিক শব্দভান্ডার — Bangladesh Regional Dialect Words",
    url: absoluteUrl("/games/words"),
    inLanguage: "bn",
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-muted">
        <Link href="/games" className="hover:text-ink">
          {d.backGames}
        </Link>
      </nav>
      <header className="mb-6 mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">📖 {t(copy.title, lang)}</h1>
        <p className="mt-2 text-lg text-ink-muted">{t(copy.lead, lang)}</p>
      </header>

      {all.length === 0 ? (
        <div className={`${card} grid gap-4 p-6 text-center`} role="status">
          <p aria-hidden className="text-6xl">
            🛠️
          </p>
          <h2 className="font-display text-3xl font-black" lang="bn">
            {t(copy.emptyTitle, lang)}
          </h2>
          <p className="font-bold text-ink-muted">{t(copy.emptyBody, lang)}</p>
          <Link href="/games/personality" className={`${btnPrimary} ${accentBg.violet}`}>
            🎭 {d.footerPersonality} →
          </Link>
        </div>
      ) : (
        <>
          <form action="/games/words" method="get" role="search" className={`${card} grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-end`}>
            <label className="grid gap-1 font-bold">
              {t(copy.search, lang)}
              <input
                type="search"
                name="q"
                defaultValue={first(params.q)}
                placeholder={t(copy.searchPlaceholder, lang)}
                maxLength={60}
                className="min-h-12 rounded-xl border-2 border-ink bg-bg px-3 font-semibold"
              />
            </label>
            <label className="grid gap-1 font-bold">
              {t(copy.district, lang)}
              <select name="district" defaultValue={district ?? ""} className="min-h-12 rounded-xl border-2 border-ink bg-bg px-3 font-semibold">
                <option value="">{t(copy.allDistricts, lang)}</option>
                {districts.map((x) => (
                  <option key={x.id} value={x.id}>
                    {t(x.name, lang)}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className={`${btnPrimary} ${accentBg.sky} min-h-12 px-5 text-base`}>
              🔍 {t(copy.go, lang)}
            </button>
          </form>

          <p className="mt-4 text-sm font-bold text-ink-muted" role="status">
            {fmt(t(copy.count, lang), { n: num(words.length, lang) })}
            {(q || district) && (
              <>
                {" · "}
                <Link href="/games/words" className="underline">
                  {t(copy.clear, lang)}
                </Link>
              </>
            )}
          </p>

          {words.length === 0 ? (
            <p className={`${card} mt-3 p-4 font-bold`}>{t(copy.noMatch, lang)}</p>
          ) : (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {words.map((w) => (
                <li key={w.id} className={`${card} grid gap-1 p-4`}>
                  <p className="font-display text-2xl font-black" lang="bn">
                    {w.localWord}
                  </p>
                  <p className="font-bold" lang="bn">
                    {t(copy.standard, lang)}: {w.standardWord} · {w.meaningBn}
                  </p>
                  {lang === "en" && w.meaningEn && <p className="text-sm font-semibold text-ink-muted">{w.meaningEn}</p>}
                  <p className="text-xs font-bold text-ink-muted">
                    {w.districtIds.map((id) => getDistrict(id)).filter(Boolean).map((x) => `${x!.emoji} ${t(x!.name, lang)}`).join(" · ")}
                  </p>
                  <Link href={`/games/words/${w.id}`} className="mt-1 justify-self-start text-sm font-extrabold underline">
                    {t(copy.details, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <nav className="mt-8 flex flex-wrap gap-3">
        {quizLive && (
          <Link href="/games/ancholik-quiz" className={chip}>
            🗣️ {d.footerDialect}
          </Link>
        )}
        <Link href="/games/personality" className={chip}>
          🎭 {d.footerPersonality}
        </Link>
      </nav>
      <p className="mt-6 text-xs font-bold text-ink-muted">{t(copy.variesNote, lang)}</p>
    </main>
  );
}
