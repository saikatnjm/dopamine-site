"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DialectMap, type MapLabel } from "@/components/dialects/dialect-map";
import { Progress } from "@/components/games/personality-game";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultShareKit, useOrigin } from "@/components/share/result-share-kit";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { detectiveCopy as copy } from "@/data/games/which-region";
import { track } from "@/lib/analytics";
import type { ConceptLite, RegionLite } from "@/lib/dialects/content";
import { prefersReducedMotion } from "@/lib/games/shared";
import {
  buildRound,
  GAME_SLUG,
  OTHER,
  scoreAnswers,
  type DetectiveForm,
  type DetectiveQuestion,
  type DetectiveResult,
} from "@/lib/games/which-region";
import { fmt, num, t } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";
import { copyText, shareTargets, type ShareMethod } from "@/lib/sharing";
import type { ResultCardData } from "@/lib/result-card";

type Phase = "intro" | "quiz" | "result";

export function WhichRegionGame({
  eligible,
  forms,
  concepts,
  regions,
  friend,
}: {
  /** Concept ids that make good questions (≥ MIN_REGIONS regions). */
  eligible: string[];
  forms: DetectiveForm[];
  concepts: ConceptLite[];
  regions: RegionLite[];
  /** From a shared link: the friend's guessed region, "mystery", or null. */
  friend: string | null;
}) {
  const { lang } = useI18n();
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState<DetectiveQuestion[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [plays, setPlays] = useState(0);
  const [quip, setQuip] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const regionOrder = useMemo(() => regions.map((r) => r.id), [regions]);
  const conceptOf = useMemo(() => new Map(concepts.map((c) => [c.id, c])), [concepts]);
  const index = answers.length;

  useEffect(() => {
    if (phase !== "quiz") return;
    headingRef.current?.focus({ preventScroll: true });
    if (prefersReducedMotion()) return;
    panelRef.current?.animate(
      [
        { opacity: 0, transform: "translateX(24px) rotate(0.6deg)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 220, easing: "cubic-bezier(.2,.9,.3,1.2)" },
    );
  }, [phase, index]);

  function start() {
    setRound(buildRound(eligible, forms, regionOrder, newSeed()));
    setAnswers([]);
    setQuip(null);
    setPhase("quiz");
    track(plays > 0 ? "game_retry" : "game_start", { game: GAME_SLUG });
    setPlays((n) => n + 1);
  }

  function answer(optionId: string) {
    const next = [...answers, optionId];
    setAnswers(next);
    // A small reaction now and then, picked from the answer count (no randomness needed).
    setQuip(optionId !== OTHER && next.length % 3 === 0 ? (next.length / 3) % copy.thinking.length : null);
    if (next.length < round.length) return;
    const result = scoreAnswers(round, next, regionOrder);
    setPhase("result");
    track("game_complete", { game: GAME_SLUG, outcome: result.top ?? "mystery", score: result.ranking[0]?.hits ?? 0 });
  }

  const regionName = (id: string) => {
    const r = regions.find((x) => x.id === id);
    return r ? t(r.name, lang) : id;
  };

  if (phase === "intro") {
    return (
      <div className="grid gap-4">
        {friend && (
          <p className="-rotate-1 rounded-2xl border-2 border-ink bg-marigold p-3 text-center font-extrabold shadow-pop">
            {friend === "mystery" ? t(copy.friendMystery, lang) : fmt(t(copy.friendBanner, lang), { region: regionName(friend) })}
          </p>
        )}
        <div className={`${card} grid gap-3 p-5 text-center`}>
          <p aria-hidden className="text-5xl">
            🐈 🐔 🧹 💧 🕵️
          </p>
          <p className="font-bold text-ink-muted">{t(copy.intro, lang)}</p>
        </div>
        <button type="button" onClick={start} className={`${btnPrimary} ${accentBg.violet} min-h-16 text-2xl`}>
          {t(friend ? copy.takeIt : copy.start, lang)}
        </button>
        <p className="text-center text-xs font-bold text-ink-muted">{t(copy.note, lang)}</p>
      </div>
    );
  }

  if (phase === "quiz") {
    const q = round[index]!;
    const c = conceptOf.get(q.conceptId)!;
    const progress = fmt(t(copy.progress, lang), { n: num(index + 1, lang), total: num(round.length, lang) });
    return (
      <div className="grid gap-4">
        <Progress label={progress} value={index} max={round.length} />
        <div ref={panelRef} className={`${card} p-5`}>
          <p aria-hidden className="text-center text-6xl">
            {c.emoji}
          </p>
          <h2 ref={headingRef} tabIndex={-1} lang={lang} className="mt-2 text-center font-display text-2xl font-extrabold leading-snug outline-none sm:text-3xl">
            {fmt(t(c.kind === "phrase" ? copy.askPhrase : copy.askWord, lang), { word: c.standard })}
          </h2>
          {lang === "en" && <p className="text-center text-sm font-bold text-ink-muted">({c.en})</p>}
          <div className="mt-4 grid gap-3">
            {q.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => answer(o.id)}
                className="flex min-h-14 items-center justify-center rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-center text-xl font-extrabold shadow-pop transition-all duration-100 hover:-translate-y-0.5 hover:bg-sky hover:shadow-pop-lg active:translate-y-0.5 active:shadow-none"
              >
                <span lang="bn">{o.text}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => answer(OTHER)}
              className="min-h-12 rounded-2xl border-2 border-dashed border-ink/50 px-4 py-2 font-bold text-ink-muted hover:border-ink hover:text-ink"
            >
              {t(copy.other, lang)}
            </button>
          </div>
        </div>
        {quip !== null && (
          <p role="status" className="motion-safe:animate-pop-in justify-self-center -rotate-2 rounded-pill border-2 border-ink bg-lime px-4 py-1 font-extrabold">
            {t(copy.thinking[quip]!, lang)}
          </p>
        )}
        {index > 0 && (
          <button type="button" onClick={() => setAnswers(answers.slice(0, -1))} className={btnGhost}>
            {t(copy.back, lang)}
          </button>
        )}
      </div>
    );
  }

  return <ResultView result={scoreAnswers(round, answers, regionOrder)} round={round} answers={answers} regions={regions} onRetake={start} />;
}

const tile =
  "grid size-12 place-items-center rounded-full border-2 border-ink text-xl font-black shadow-pop transition-all duration-150 group-hover:-translate-y-1 group-hover:shadow-pop-lg group-active:translate-y-0.5 group-active:shadow-none";

function ResultView({
  result,
  round,
  answers,
  regions,
  onRetake,
}: {
  result: DetectiveResult;
  round: DetectiveQuestion[];
  answers: string[];
  regions: RegionLite[];
  onRetake: () => void;
}) {
  const { lang } = useI18n();
  const origin = useOrigin();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [toast, setToast] = useState(false);
  useEffect(() => headingRef.current?.focus({ preventScroll: false }), []);

  const name = (id: string) => {
    const r = regions.find((x) => x.id === id);
    return r ? t(r.name, lang) : id;
  };
  const top = result.top;
  const topScore = result.ranking[0];
  const runners = result.ranking.slice(1, 3).filter((r) => r.hits > 0);
  const picked = round.flatMap((q, i) => q.options.filter((o) => o.id === answers[i]));
  const matchLine = top && topScore ? fmt(t(copy.resultMatch, lang), { hits: num(topScore.hits, lang), answered: num(result.answered, lang), region: name(top) }) : "";

  const url = `${origin}/games/${GAME_SLUG}?r=${top ?? "mystery"}`;
  const message = top ? fmt(t(copy.shareText, lang), { region: name(top) }) : t(copy.shareMystery, lang);
  const targets = shareTargets(url, message);
  const shared = (method: ShareMethod) => track("game_share", { game: GAME_SLUG, method, rank: top ?? "mystery" });

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text: message, url });
        shared("native");
      } catch {
        // share sheet dismissed
      }
      return;
    }
    if (await copyText(`${message} ${url}`)) {
      shared("copy");
      setToast(true);
      window.setTimeout(() => setToast(false), 2000);
    }
  }

  const labels: MapLabel[] = top ? [{ region: top, text: name(top), strong: true }, ...runners.map((r) => ({ region: r.region, text: name(r.region) }))] : [];
  const data: ResultCardData = {
    game: t(copy.title, lang),
    emoji: "🕵️",
    accent: "violet",
    headlineLabel: t(copy.resultKicker, lang),
    headline: top ? fmt(t(copy.resultTitle, lang), { region: name(top) }) : t(copy.mysteryTitle, lang),
    blurb: top ? matchLine : t(copy.mysteryBody, lang),
    stats: [],
    quote: picked.map((o) => o.text).join(" · "),
    path: `/games/${GAME_SLUG}`,
  };
  const links = [
    { method: "whatsapp" as const, href: targets.whatsapp, label: "WhatsApp", glyph: "💬", bg: "bg-[#25D366]" },
    { method: "facebook" as const, href: targets.facebook, label: "Facebook", glyph: "f", bg: "bg-[#1877F2] text-white" },
    { method: "x" as const, href: targets.x, label: "X", glyph: "𝕏", bg: "bg-ink text-bg" },
  ];

  return (
    <div className="grid gap-4">
      <article className={`${card} overflow-hidden`}>
        <div className="bg-violet px-5 pb-4 pt-5 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wider">{t(copy.resultKicker, lang)}</p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-1 font-display text-3xl font-black leading-tight outline-none sm:text-4xl">
            {top ? fmt(t(copy.resultTitle, lang), { region: name(top) }) : t(copy.mysteryTitle, lang)}
          </h2>
          <p className="mt-2 font-bold">{top ? matchLine : t(copy.mysteryBody, lang)}</p>
        </div>
        <div className="p-4">
          <DialectMap regions={regions} labels={labels} highlight={top ? [top, ...runners.map((r) => r.region)] : null} title={top ? name(top) : t(copy.mysteryTitle, lang)} />
          {runners.length > 0 && (
            <p className="mt-2 text-center text-sm font-bold">{fmt(t(copy.runnersUp, lang), { regions: runners.map((r) => name(r.region)).join(", ") })}</p>
          )}
          {picked.length > 0 && (
            <div className="mt-3 text-center">
              <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.yourWords, lang)}</p>
              <ul className="mt-1 flex flex-wrap justify-center gap-1.5">
                {picked.map((o, i) => (
                  <li key={`${o.id}-${i}`} lang="bn" className="rounded-pill border-2 border-ink bg-bg px-2.5 py-0.5 text-sm font-extrabold">
                    {o.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-3 text-center text-xs font-bold text-ink-muted">{t(copy.note, lang)}</p>
        </div>
      </article>

      <p className="text-center font-extrabold">{t(copy.wrongGuess, lang)}</p>
      <button type="button" onClick={share} className={`${btnPrimary} ${accentBg.violet}`}>
        {t(copy.share, lang)}
      </button>
      <section className={`${card} p-3`} aria-label="Share">
        <div className="grid grid-cols-4 gap-1">
          {links.map((l) => (
            <a key={l.method} href={l.href} target="_blank" rel="noopener noreferrer" onClick={() => shared(l.method)} className="group flex flex-col items-center gap-1.5 rounded-xl py-1">
              <span aria-hidden className={`${tile} ${l.bg}`}>
                {l.glyph}
              </span>
              <span className="text-[11px] font-bold leading-tight sm:text-xs">{l.label}</span>
            </a>
          ))}
          <button
            type="button"
            onClick={async () => {
              if (await copyText(`${message} ${url}`)) {
                shared("copy");
                setToast(true);
                window.setTimeout(() => setToast(false), 2000);
              }
            }}
            className="group flex flex-col items-center gap-1.5 rounded-xl py-1"
          >
            <span aria-hidden className={`${tile} bg-lime`}>
              🔗
            </span>
            <span className="text-[11px] font-bold leading-tight sm:text-xs">{t(copy.copyLink, lang)}</span>
          </button>
        </div>
      </section>
      <button type="button" onClick={onRetake} className={`${btnPrimary} bg-surface`}>
        {t(copy.retake, lang)}
      </button>
      <ResultShareKit
        primary={false}
        download
        data={data}
        url={url}
        fileName="which-region-result"
        onShared={shared}
        renderImage={async (host) => {
          const { renderMapPoster } = await import("@/lib/map-poster");
          return renderMapPoster(
            {
              kicker: t(copy.posterKicker, lang),
              title: top ? fmt(t(copy.posterTitle, lang), { region: name(top) }) : t(copy.posterMystery, lang),
              subtitle: top && topScore ? fmt(t(copy.posterSubtitle, lang), { hits: num(topScore.hits, lang), answered: num(result.answered, lang) }) : undefined,
              regions,
              labels,
              highlight: top ? [top, ...runners.map((r) => r.region)] : null,
              cta: t(copy.posterCta, lang),
              path: `/games/${GAME_SLUG}`,
            },
            host,
          );
        }}
      />
      <Link href="/games/word-map" className="justify-self-center text-sm font-extrabold underline">
        {t(copy.mapLink, lang)}
      </Link>
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && <p className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop">✅ {t(copy.linkCopied, lang)}</p>}
      </div>
    </div>
  );
}
