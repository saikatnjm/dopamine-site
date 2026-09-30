"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultCard as SharedResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost } from "@/components/share/result-share-kit";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { questions, quizCopy as copy, results, traitInfo } from "@/data/dhaka-person";
import { track } from "@/lib/analytics";
import {
  encodeAnswers,
  OPTION_KEYS,
  QUESTION_COUNT,
  RESULT_IDS,
  isResultId,
  resultFor,
  topTraits,
  type OptionKey,
  type ResultId,
} from "@/lib/dhaka-person";
import { prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import type { ResultCardData } from "@/lib/result-card";
import { copyText, shareTargets, type ShareMethod } from "@/lib/sharing";

export type Shared = { answers: OptionKey[]; result: ResultId };

// ---------------------------------------------------------------------------
// Local record: which personalities this device has found (no backend).
// ---------------------------------------------------------------------------
const STORE_KEY = "hottogol:dhaka-person:v1";
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORE_KEY);
  } catch {
    return null;
  }
}
function parseFound(raw: string | null): ResultId[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as { found?: unknown };
    return Array.isArray(data.found) ? [...new Set(data.found.filter(isResultId))] : [];
  } catch {
    return [];
  }
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
/** Saves the result; returns how many distinct personalities are now found. */
function saveResult(result: ResultId): number {
  const found = parseFound(readRaw());
  if (!found.includes(result)) found.push(result);
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify({ found, last: result }));
  } catch {
    // storage blocked: the quiz still works, nothing is remembered
  }
  listeners.forEach((l) => l());
  return found.length;
}

const noSubscribe = () => () => {};
function useOrigin(): string {
  return useSyncExternalStore(noSubscribe, () => window.location.origin, () => "");
}

const tile =
  "grid size-12 place-items-center rounded-full border-2 border-ink text-xl font-black shadow-pop transition-all duration-150 group-hover:-translate-y-1 group-hover:shadow-pop-lg group-active:translate-y-0.5 group-active:shadow-none";

const sharePath = (answers: readonly OptionKey[], result: ResultId) => `/dhaka-person?a=${encodeAnswers(answers)}&r=${result}`;

type Phase = "intro" | "quiz" | "result";

export function DhakaPersonQuiz({ friend }: { friend: Shared | null }) {
  const { lang } = useI18n();
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<OptionKey[]>([]);
  const [result, setResult] = useState<ResultId | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const foundRaw = useSyncExternalStore(subscribe, readRaw, () => null);
  const found = parseFound(foundRaw);

  const index = answers.length;

  // Slide the new question in (skipped for reduced motion).
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

  useEffect(() => {
    if (phase !== "result") return;
    resultRef.current?.focus({ preventScroll: false });
    if (prefersReducedMotion()) return;
    resultRef.current?.animate(
      [
        { opacity: 0, transform: "scale(0.9) rotate(-2deg)" },
        { opacity: 1, transform: "scale(1.02) rotate(0.5deg)", offset: 0.7 },
        { opacity: 1, transform: "none" },
      ],
      { duration: 420, easing: "ease-out" },
    );
  }, [phase]);

  function start() {
    setAnswers([]);
    setResult(null);
    setPhase("quiz");
    track(phase === "result" ? "game_retry" : "game_start", { game: "dhaka-person" });
  }

  function answer(key: OptionKey) {
    const next = [...answers, key];
    if (next.length < QUESTION_COUNT) {
      setAnswers(next);
      return;
    }
    const r = resultFor(next);
    const distinct = saveResult(r);
    setAnswers(next);
    setResult(r);
    setPhase("result");
    track("quiz_complete", { quiz: "dhaka-person", result: r, distinct });
  }

  if (phase === "intro") {
    return (
      <div className="grid gap-4">
        {friend && (
          <>
            <p className="-rotate-1 rounded-2xl border-2 border-ink bg-marigold p-3 text-center font-extrabold shadow-pop">{t(copy.friendBanner, lang)}</p>
            <ResultCard result={friend.result} answers={friend.answers} lang={lang} heading={t(copy.friendIs, lang)} />
          </>
        )}
        {!friend && (
          <div className={`${card} grid gap-3 p-5 text-center`}>
            <p aria-hidden className="text-5xl">
              🚕 🍛 🚦 💸 ☕
            </p>
            <p className="font-bold text-ink-muted">{t(copy.intro, lang)}</p>
          </div>
        )}
        <button type="button" onClick={start} className={`${btnPrimary} ${accentBg.cng} min-h-16 text-2xl`}>
          {t(friend ? copy.takeIt : copy.start, lang)}
        </button>
        {found.length > 0 && (
          <p className="text-center text-sm font-bold text-ink-muted">
            {fmt(t(copy.collected, lang), { n: num(found.length, lang), total: num(RESULT_IDS.length, lang) })}
          </p>
        )}
      </div>
    );
  }

  if (phase === "quiz") {
    const q = questions[index]!;
    const pct = Math.round((index / QUESTION_COUNT) * 100);
    const progress = fmt(t(copy.progress, lang), { n: num(index + 1, lang), total: num(QUESTION_COUNT, lang) });
    return (
      <div className="grid gap-4">
        <div>
          <div className="flex items-baseline justify-between text-sm font-extrabold">
            <span>{progress}</span>
            <span className="rounded-pill border-2 border-ink bg-surface px-2.5 py-0.5 text-xs">
              {q.emoji} {t(q.topic, lang)}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label={progress}
            aria-valuemin={0}
            aria-valuemax={QUESTION_COUNT}
            aria-valuenow={index}
            className="mt-2 h-4 overflow-hidden rounded-pill border-2 border-ink bg-surface"
          >
            <span className="block h-full bg-cng transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div ref={panelRef} className={`${card} p-5`}>
          <h2 ref={headingRef} tabIndex={-1} lang={lang} className="font-display text-2xl font-extrabold leading-snug outline-none sm:text-3xl">
            <span aria-hidden className="mr-1">
              {q.emoji}
            </span>{" "}
            {t(q.prompt, lang)}
          </h2>
          <div className="mt-4 grid gap-3">
            {OPTION_KEYS.map((key) => (
              <button
                key={`${q.id}-${key}`}
                type="button"
                onClick={() => answer(key)}
                className="flex min-h-14 items-center gap-3 rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-left font-bold shadow-pop transition-all duration-100 hover:-translate-y-0.5 hover:bg-marigold hover:shadow-pop-lg active:translate-y-0.5 active:shadow-none"
              >
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-bg font-black uppercase">
                  {key}
                </span>
                <span lang={lang}>{t(q.options[key], lang)}</span>
              </button>
            ))}
          </div>
        </div>

        {index > 0 && (
          <button type="button" onClick={() => setAnswers(answers.slice(0, -1))} className={btnGhost}>
            {t(copy.back, lang)}
          </button>
        )}
      </div>
    );
  }

  return <ResultView result={result ?? resultFor(answers)} answers={answers} friend={friend} found={found.length} resultRef={resultRef} onRetake={start} />;
}

function ResultView({
  result,
  answers,
  friend,
  found,
  resultRef,
  onRetake,
}: {
  result: ResultId;
  answers: OptionKey[];
  friend: Shared | null;
  found: number;
  resultRef: RefObject<HTMLDivElement | null>;
  onRetake: () => void;
}) {
  const { lang } = useI18n();
  const origin = useOrigin();
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const info = results[result];
  const url = `${origin}${sharePath(answers, result)}`;
  const message = fmt(t(copy.shareText, lang), { emoji: info.emoji, title: t(info.title, lang) });
  const targets = shareTargets(url, message);
  const shared = (method: ShareMethod) => track("game_share", { game: "dhaka-person", method, result });

  function showToast(m: string) {
    setToast(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2000);
  }
  async function copyLink() {
    if (await copyText(`${message} ${url}`)) {
      showToast(t(copy.linkCopied, lang));
      shared("copy");
    }
  }
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
    await copyLink();
  }

  const links = [
    { method: "whatsapp" as const, href: targets.whatsapp, label: "WhatsApp", glyph: "💬", bg: "bg-[#25D366]" },
    { method: "facebook" as const, href: targets.facebook, label: "Facebook", glyph: "f", bg: "bg-[#1877F2] text-white" },
    { method: "x" as const, href: targets.x, label: "X", glyph: "𝕏", bg: "bg-ink text-bg" },
  ];
  const friendInfo = friend ? results[friend.result] : null;

  return (
    <div className="grid gap-4">
      {friend && friendInfo && (
        <p className="-rotate-1 rounded-2xl border-2 border-ink bg-marigold p-3 text-center font-extrabold shadow-pop">
          {friend.result === result
            ? t(copy.sameAsFriend, lang)
            : fmt(t(copy.diffFromFriend, lang), { emoji: friendInfo.emoji, title: t(friendInfo.title, lang) })}
        </p>
      )}

      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="outline-none focus-visible:outline-3 focus-visible:outline-offset-4">
        <ResultCard result={result} answers={answers} lang={lang} heading={t(copy.youAre, lang)} />
      </div>

      <button type="button" onClick={share} className={`${btnPrimary} ${accentBg.sky}`}>
        {t(copy.share, lang)}
      </button>
      <section aria-label={t(copy.shareVia, lang)} className={`${card} p-3`}>
        <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.shareVia, lang)}</p>
        <div className="grid grid-cols-4 gap-1">
          {links.map((l) => (
            <a
              key={l.method}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => shared(l.method)}
              className="group flex flex-col items-center gap-1.5 rounded-xl py-1"
            >
              <span aria-hidden className={`${tile} ${l.bg}`}>
                {l.glyph}
              </span>
              <span className="text-[11px] font-bold leading-tight sm:text-xs">{l.label}</span>
            </a>
          ))}
          <button type="button" onClick={copyLink} className="group flex flex-col items-center gap-1.5 rounded-xl py-1">
            <span aria-hidden className={`${tile} bg-lime`}>
              🔗
            </span>
            <span className="text-[11px] font-bold leading-tight sm:text-xs">{t(copy.copyLink, lang)}</span>
          </button>
        </div>
      </section>
      <ResultShareKit
        data={quizCard(result, answers, lang, t(copy.youAre, lang))}
        url={url}
        fileName="dhaka-person-result"
        onShared={shared}
        primary={false}
      />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onRetake} className={`${btnPrimary} ${accentBg.cng} px-3 text-base`}>
          {t(copy.retake, lang)}
        </button>
        <Link href="/" className={`${btnPrimary} bg-surface px-3 text-base`}>
          {t(copy.another, lang)}
        </Link>
      </div>
      <p className="text-center text-sm font-bold text-ink-muted">
        {fmt(t(copy.collected, lang), { n: num(found, lang), total: num(RESULT_IDS.length, lang) })}
      </p>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && <p className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop">✅ {toast}</p>}
      </div>
    </div>
  );
}

/** Quiz result → shared card data (only real values: your answers' trait mix). */
function quizCard(result: ResultId, answers: readonly OptionKey[], lang: Lang, heading: string): ResultCardData {
  const info = results[result];
  return {
    game: t(copy.title, lang),
    emoji: "🏙️",
    accent: info.accent,
    headlineLabel: heading,
    titleEmoji: info.emoji,
    headline: t(info.title, lang),
    blurb: t(info.description, lang),
    stats: topTraits(answers).map(({ trait, percent }) => ({
      label: `${traitInfo[trait].emoji} ${t(traitInfo[trait].label, lang)}`,
      value: `${num(percent, lang)}%`,
    })),
    quote: t(info.quote, lang).replace(/^[“"]|[”"]$/g, ""),
    path: "/dhaka-person",
  };
}

/** Screenshot-friendly result card (shared Hottogol design). */
function ResultCard({
  result,
  answers,
  lang,
  heading,
}: {
  result: ResultId;
  answers: readonly OptionKey[];
  lang: Lang;
  heading: string;
}) {
  const host = useHost();
  return (
    <SharedResultCard data={quizCard(result, answers, lang, heading)} host={host} level={2}>
      <p className="text-center text-xs font-bold text-ink-muted">{t(copy.note, lang)}</p>
    </SharedResultCard>
  );
}
