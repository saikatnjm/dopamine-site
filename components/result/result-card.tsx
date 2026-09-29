import { accentBg, card } from "@/components/ui/styles";
import { resultCardLines, type ResultData } from "@/lib/experience/result-token";
import { fmt, t, type Lang } from "@/lib/i18n/core";
import { getDictionary } from "@/lib/i18n/dictionary";
import { siteConfig } from "@/lib/site";

// Compact, screenshot-friendly card. Fits a 360px-wide phone screen
// without scrolling and carries the site address for screenshots.
export function ResultCard({ result, lang }: { result: ResultData; lang: Lang }) {
  const { experience, outcome } = result;
  const host = new URL(siteConfig.url).host;

  return (
    <article className={`${card} overflow-hidden`}>
      <header
        className={`${accentBg[experience.accent]} border-b-2 border-ink px-5 py-3 text-sm font-extrabold uppercase tracking-wide`}
      >
        {experience.emoji} {t(experience.title, lang)}
      </header>
      <div className="p-5">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
          {resultCardLines(result, lang).map((line) => (
            <div key={line.label} className="contents">
              <dt className="text-ink-muted">{line.label}</dt>
              <dd className="text-right font-semibold">{line.value}</dd>
            </div>
          ))}
        </dl>
        {outcome.quote && (
          <p className="mt-5 rounded-2xl bg-surface-2 px-4 py-3 text-center text-2xl font-bold leading-snug">
            &ldquo;{t(outcome.quote, lang)}&rdquo;
          </p>
        )}
        <h1 className="mt-5 text-center font-display text-3xl font-extrabold leading-tight">
          <span aria-hidden>{outcome.emoji}</span> {t(outcome.title, lang)}
        </h1>
        <p className="mt-2 text-center text-ink-muted">{t(outcome.message, lang)}</p>
      </div>
      <footer className="border-t-2 border-dashed border-line px-5 py-2 text-center text-xs font-semibold text-ink-muted">
        {fmt(getDictionary(lang).playAt, { host })}
      </footer>
    </article>
  );
}
