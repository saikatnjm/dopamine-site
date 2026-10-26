"use client";

import Link from "@/components/i18n/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { Progress } from "@/components/games/personality-game";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { accentBg, btnGhost, btnPrimary, card, chip } from "@/components/ui/styles";
import { levelInfo, quizCopy as copy, tierInfo } from "@/data/games/ancholik-quiz";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import type { Difficulty } from "@/lib/dialects/types";
import {
  buildRound,
  canPlay,
  freshConfig,
  GAME_SLUG,
  isCorrect,
  LEVELS,
  MIXED,
  packSeed,
  roundPath,
  roundSize,
  scoreRound,
  tierFor,
  unpackSeed,
  type PoolQuestion,
  type QuizConfig,
} from "@/lib/games/ancholik-quiz";
import { prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";
import type { ResultCardData } from "@/lib/result-card";

export type QuizDistrict = { id: string; name: Text; emoji: string };

type Initial = { scope: string | null; level: Difficulty | null; config: QuizConfig | null };

// ---------------------------------------------------------------------------
// Unfinished round, remembered on this device so a refresh doesn't lose it.
// Optional: blocked storage just means no "continue" button.
// ---------------------------------------------------------------------------
const PROGRESS_KEY = `hottogol:${GAME_SLUG}:progress:v1`;
const PROGRESS_TTL_MS = 24 * 60 * 60 * 1000;
type Saved = { seed: number; ids: string[]; answers: string[]; at: number };
const progressListeners = new Set<() => void>();

function readProgress(): string | null {
  try {
    return window.localStorage.getItem(PROGRESS_KEY);
  } catch {
    return null;
  }
}
function writeProgress(value: Saved | null) {
  try {
    if (value) window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(value));
    else window.localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // storage blocked
  }
  progressListeners.forEach((l) => l());
}
function subscribeProgress(cb: () => void) {
  progressListeners.add(cb);
  return () => progressListeners.delete(cb);
}
/** A saved round that still matches today's pool exactly, or null. */
function parseProgress(raw: string | null, pool: readonly PoolQuestion[]): { config: QuizConfig; answers: string[]; total: number } | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as Partial<Saved>;
    if (typeof s.seed !== "number" || !Array.isArray(s.ids) || !Array.isArray(s.answers) || typeof s.at !== "number") return null;
    if (Date.now() - s.at > PROGRESS_TTL_MS) return null;
    const config = unpackSeed(s.seed);
    if (!config) return null;
    const round = buildRound(pool, config);
    if (round.length !== s.ids.length || round.some((q, i) => q.id !== s.ids![i])) return null;
    const answers = s.answers.filter((a): a is string => typeof a === "string").slice(0, round.length);
    if (answers.length === 0 || answers.length >= round.length) return null;
    return { config, answers, total: round.length };
  } catch {
    return null;
  }
}

type Phase = "setup" | "quiz" | "result";

export function AncholikQuizGame({
  pool,
  districts,
  initial,
  challenge: rawChallenge,
}: {
  /** Published questions about verified words only (from the server). */
  pool: PoolQuestion[];
  districts: QuizDistrict[];
  initial: Initial;
  challenge: FriendChallenge | null;
}) {
  const { lang } = useI18n();
  // A challenge only counts if its seed is a real quiz config.
  const challenge = rawChallenge && unpackSeed(rawChallenge.seed) ? rawChallenge : null;
  const sharedConfig = challenge ? unpackSeed(challenge.seed) : initial.config;

  const [phase, setPhase] = useState<Phase>("setup");
  const [scope, setScope] = useState(sharedConfig?.scope ?? initial.scope ?? MIXED);
  const [level, setLevel] = useState<Difficulty>(sharedConfig?.level ?? initial.level ?? "easy");
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [played, setPlayed] = useState(0);
  const round = useMemo(() => (config ? buildRound(pool, config) : []), [pool, config]);
  const savedRaw = useSyncExternalStore(subscribeProgress, readProgress, () => null);
  const saved = phase === "setup" ? parseProgress(savedRaw, pool) : null;

  // Leaving mid-round (refresh/close) asks first; answers are saved anyway.
  const midRound = phase === "quiz" && answers.length > 0;
  useEffect(() => {
    if (!midRound) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [midRound]);

  function begin(next: QuizConfig, resumeAnswers: string[] = []) {
    setScope(next.scope);
    setLevel(next.level);
    setConfig(next);
    setAnswers(resumeAnswers);
    setPhase("quiz");
    track(played > 0 ? "game_retry" : "game_start", { game: GAME_SLUG, mode: next.scope });
    setPlayed((n) => n + 1);
  }
  const startFresh = (s = scope, l = level) => begin(freshConfig(s, l, newSeed()));

  function answer(optionId: string) {
    if (!config || answers.length >= round.length) return;
    const next = [...answers, optionId];
    setAnswers(next);
    const seed = packSeed(config);
    if (seed !== null) writeProgress({ seed, ids: round.map((q) => q.id), answers: next, at: Date.now() });
  }

  function finish() {
    if (!config) return;
    const s = scoreRound(round, answers);
    writeProgress(null);
    setPhase("result");
    track("game_complete", { game: GAME_SLUG, score: s.correct, total: s.total, rank: tierFor(s.correct, s.total), mode: config.scope, level: config.level });
  }

  function quit() {
    if (answers.length > 0 && !window.confirm(t(copy.quitConfirm, lang))) return;
    writeProgress(null);
    setConfig(null);
    setAnswers([]);
    setPhase("setup");
  }

  // Nothing reviewed yet anywhere → friendly "coming soon", never a broken quiz.
  if (!canPlay(pool, MIXED, "hard")) return <Building lang={lang} />;

  if (phase === "quiz" && config && round.length > 0) {
    return <QuizRound round={round} answers={answers} onAnswer={answer} onFinish={finish} onQuit={quit} />;
  }

  if (phase === "result" && config) {
    return (
      <ResultView
        config={config}
        round={round}
        answers={answers}
        districts={districts}
        challenge={challenge}
        onAgain={() => startFresh(config.scope, config.level)}
        onSetup={() => {
          setConfig(null);
          setPhase("setup");
        }}
      />
    );
  }

  // ---- setup ----
  const sharedPlayable = sharedConfig && buildRound(pool, sharedConfig).length >= 1;
  return (
    <div className="grid gap-5">
      {challenge && sharedPlayable && sharedConfig && <ChallengeBanner game={GAME_SLUG} challenge={challenge} onAccept={() => begin(sharedConfig)} />}
      {!challenge && sharedPlayable && sharedConfig && (
        <div className={`${card} grid gap-3 p-4 text-center`}>
          <p className="font-extrabold">{t(copy.sharedRound, lang)}</p>
          <p className="text-sm font-bold text-ink-muted">
            {scopeName(sharedConfig.scope, districts, lang)} · {levelInfo[sharedConfig.level].emoji} {t(levelInfo[sharedConfig.level].label, lang)}
          </p>
          <button type="button" onClick={() => begin(sharedConfig)} className={`${btnPrimary} ${accentBg.marigold}`}>
            {t(copy.playChallenge, lang)}
          </button>
        </div>
      )}
      {saved && (
        <button type="button" onClick={() => begin(saved.config, saved.answers)} className={`${btnPrimary} bg-surface`}>
          {fmt(t(copy.resume, lang), { n: num(saved.answers.length, lang), total: num(saved.total, lang) })}
        </button>
      )}

      <fieldset>
        <legend className="font-display text-xl font-extrabold">{t(copy.pickRegion, lang)}</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[{ id: MIXED, name: copy.mixed, emoji: "🇧🇩" }, ...districts].map((d) => {
            const n = roundSize(pool, d.id, level);
            const ok = canPlay(pool, d.id, level);
            const selected = d.id === scope;
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setScope(d.id)}
                className={`flex min-h-16 flex-col items-start justify-center rounded-2xl border-2 border-ink px-3 py-2 text-left shadow-pop transition-all duration-100 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none ${selected ? `${accentBg.sky} -rotate-1` : "bg-surface"}`}
              >
                <span className="font-extrabold" lang="bn">
                  <span aria-hidden>{d.emoji}</span> {t(d.name, lang)}
                </span>
                <span className="text-xs font-bold text-ink-muted">
                  {ok ? fmt(t(copy.questionsReady, lang), { n: num(n, lang) }) : t(copy.notReady, lang)}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-xl font-extrabold">{t(copy.pickLevel, lang)}</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={l === level}
              onClick={() => setLevel(l)}
              className={`flex min-h-16 flex-col items-center justify-center rounded-2xl border-2 border-ink px-2 py-2 text-center shadow-pop transition-all duration-100 active:translate-y-0.5 active:shadow-none ${l === level ? `${accentBg.marigold} rotate-1` : "bg-surface"}`}
            >
              <span className="font-extrabold">
                <span aria-hidden>{levelInfo[l].emoji}</span> {t(levelInfo[l].label, lang)}
              </span>
              <span className="text-[11px] font-bold leading-tight text-ink-muted">{t(levelInfo[l].hint, lang)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {canPlay(pool, scope, level) ? (
        <button type="button" onClick={() => startFresh()} className={`${btnPrimary} ${accentBg.cng} min-h-16 text-2xl`}>
          {fmt(t(copy.start, lang), { n: num(roundSize(pool, scope, level), lang) })}
        </button>
      ) : (
        <p className={`${card} p-4 text-center font-bold`} role="status">
          🛠️ {fmt(t(copy.buildingRegion, lang), { region: scopeName(scope, districts, lang) })}
        </p>
      )}
      <p className="text-center text-xs font-bold text-ink-muted">{t(copy.note, lang)}</p>
    </div>
  );
}

function scopeName(scope: string, districts: readonly QuizDistrict[], lang: Lang): string {
  if (scope === MIXED) return t(copy.mixed, lang);
  const d = districts.find((x) => x.id === scope);
  return d ? t(d.name, lang) : scope;
}

function Building({ lang }: { lang: Lang }) {
  return (
    <div className={`${card} grid gap-4 p-6 text-center`} role="status">
      <p aria-hidden className="text-6xl">
        🛠️
      </p>
      <h2 className="font-display text-3xl font-black" lang="bn">
        {t(copy.buildingTitle, lang)}
      </h2>
      <p className="font-bold text-ink-muted">{t(copy.buildingBody, lang)}</p>
      <Link href="/games/word-map" className={`${btnPrimary} ${accentBg.sky}`}>
        {t(copy.buildingMap, lang)}
      </Link>
      <Link href="/games/which-region" className={`${btnPrimary} bg-surface`}>
        🕵️ {t(copy.buildingDetective, lang)}
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// One question per screen: pick → locked → feedback → next.
// ---------------------------------------------------------------------------
function QuizRound({
  round,
  answers,
  onAnswer,
  onFinish,
  onQuit,
}: {
  round: PoolQuestion[];
  answers: string[];
  onAnswer: (optionId: string) => void;
  onFinish: () => void;
  onQuit: () => void;
}) {
  const { lang } = useI18n();
  // Index of the question on screen: the next unanswered one, or the one just answered.
  const [shown, setShown] = useState(Math.min(answers.length, round.length - 1));
  const q = round[shown]!;
  const picked = answers[shown];
  const locked = picked !== undefined;
  const isLast = shown === round.length - 1;
  const correctSoFar = scoreRound(round, answers).correct;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    if (prefersReducedMotion()) return;
    panelRef.current?.animate(
      [
        { opacity: 0, transform: "translateX(24px) rotate(0.6deg)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 220, easing: "cubic-bezier(.2,.9,.3,1.2)" },
    );
  }, [shown]);

  useEffect(() => {
    if (!locked) return;
    feedbackRef.current?.focus({ preventScroll: true });
    feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [locked]);

  const progress = fmt(t(copy.progress, lang), { n: num(shown + 1, lang), total: num(round.length, lang) });
  const right = locked && isCorrect(q, picked);
  const correctOption = q.options.find((o) => o.id === q.correctOptionId);

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Progress label={progress} value={answers.length} max={round.length} bar="bg-sky" />
        </div>
        <p className="shrink-0 rounded-pill border-2 border-ink bg-surface px-2.5 py-0.5 text-xs font-extrabold">
          {fmt(t(copy.scoreSoFar, lang), { n: num(correctSoFar, lang) })}
        </p>
      </div>

      <div ref={panelRef} className={`${card} p-5`}>
        <h2 ref={headingRef} tabIndex={-1} lang={lang} className="font-display text-2xl font-extrabold leading-snug outline-none sm:text-3xl">
          {t(q.question, lang)}
        </h2>
        <div className="mt-4 grid gap-3" role="group" aria-label={progress}>
          {q.options.map((o, i) => {
            const isPicked = o.id === picked;
            const isAnswer = o.id === q.correctOptionId;
            const state = !locked ? "idle" : isAnswer ? "correct" : isPicked ? "wrong" : "other";
            const style = {
              idle: "bg-surface hover:-translate-y-0.5 hover:bg-sky hover:shadow-pop-lg active:translate-y-0.5 active:shadow-none",
              correct: "bg-lime",
              wrong: "bg-chili",
              other: "bg-surface opacity-60",
            }[state];
            return (
              <button
                key={o.id}
                type="button"
                disabled={locked}
                aria-disabled={locked}
                onClick={() => onAnswer(o.id)}
                className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 border-ink px-4 py-3 text-left font-bold shadow-pop transition-all duration-100 disabled:cursor-default ${style}`}
              >
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-bg font-black">
                  {state === "correct" ? "✓" : state === "wrong" ? "✕" : "ABCD"[i]}
                </span>
                <span className="grid">
                  <span lang="bn" className="text-lg">
                    {o.text}
                  </span>
                  {lang === "en" && o.gloss && <span className="text-sm font-semibold text-ink-muted">{o.gloss}</span>}
                </span>
                {state === "correct" && <span className="sr-only">{t(copy.correct, lang)}</span>}
                {state === "wrong" && <span className="sr-only">{t(copy.wrong, lang)}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {locked && (
        <div
          ref={feedbackRef}
          tabIndex={-1}
          aria-live="polite"
          className={`motion-safe:animate-pop-in rounded-2xl border-2 border-ink p-4 shadow-pop outline-none ${right ? "bg-lime" : "bg-surface"}`}
        >
          <p className="text-xl font-black">{t(right ? copy.correct : copy.wrong, lang)}</p>
          {!right && correctOption && (
            <p className="mt-1 font-extrabold">
              {t(copy.answerLabel, lang)} <span lang="bn">{correctOption.text}</span>
            </p>
          )}
          <p className="mt-2 font-semibold">{t(q.explanation, lang)}</p>
        </div>
      )}

      {locked &&
        (isLast ? (
          <button type="button" onClick={onFinish} className={`${btnPrimary} ${accentBg.cng}`}>
            {t(copy.finish, lang)}
          </button>
        ) : (
          <button type="button" onClick={() => setShown(shown + 1)} className={`${btnPrimary} ${accentBg.sky}`}>
            {t(copy.next, lang)}
          </button>
        ))}
      <button type="button" onClick={onQuit} className={btnGhost}>
        {t(copy.quit, lang)}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Result: real score only, challenge link first, then image/copy, review.
// ---------------------------------------------------------------------------
function ResultView({
  config,
  round,
  answers,
  districts,
  challenge,
  onAgain,
  onSetup,
}: {
  config: QuizConfig;
  round: PoolQuestion[];
  answers: string[];
  districts: QuizDistrict[];
  challenge: FriendChallenge | null;
  onAgain: () => void;
  onSetup: () => void;
}) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus({ preventScroll: false }), []);

  const seed = packSeed(config) ?? 0;
  const { correct, total, percent } = scoreRound(round, answers);
  const tierId = tierFor(correct, total);
  const tier = tierInfo[tierId];
  const region = scopeName(config.scope, districts, lang);
  const lvl = levelInfo[config.level];
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed, score: correct }) ?? roundPath(config)}`;
  const message = fmt(t(copy.shareText, lang), { score: num(correct, lang), total: num(total, lang), region });

  const data: ResultCardData = {
    game: t(copy.title, lang),
    emoji: "🗣️",
    accent: tier.accent,
    // Level rides in the label so the card keeps room for the invitation quote.
    headlineLabel: `${t(copy.scoreLabel, lang)} · ${lvl.emoji} ${t(lvl.label, lang)}`,
    headline: `${num(correct, lang)}/${num(total, lang)}`,
    title: t(tier.title, lang),
    titleEmoji: tier.emoji,
    stats: [
      { label: t(copy.statPercent, lang), value: `${num(percent, lang)}%` },
      { label: t(copy.statRegion, lang), value: region },
    ],
    quote: t(copy.invite, lang),
    path: `/games/${GAME_SLUG}`,
  };

  return (
    <div className="grid gap-4">
      <ResultCard data={data} host={host} headingId="aq-result" headingRef={headingRef}>
        <ChallengeOutcome game={GAME_SLUG} challenge={challenge} seed={seed} score={correct} />
      </ResultCard>
      <ShareActions game={GAME_SLUG} seed={seed} score={correct} text={message} accent={tier.accent} rank={tierId} />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onAgain} className={`${btnPrimary} ${accentBg.cng} px-3 text-base`}>
          {t(copy.newRound, lang)}
        </button>
        <button type="button" onClick={onSetup} className={`${btnPrimary} bg-surface px-3 text-base`}>
          {t(copy.changeRegion, lang)}
        </button>
      </div>

      <details className={`${card} p-4`}>
        <summary className="cursor-pointer font-extrabold">{t(copy.review, lang)}</summary>
        <ol className="mt-3 grid gap-3">
          {round.map((q, i) => {
            const ok = isCorrect(q, answers[i]);
            const answer = q.options.find((o) => o.id === q.correctOptionId);
            return (
              <li key={q.id} className="rounded-xl border-2 border-ink/20 p-3">
                <p className="font-bold">
                  <span aria-hidden>{ok ? "✅" : "❌"}</span> {t(q.question, lang)}
                </p>
                <p className="mt-1 text-sm font-bold">
                  {t(copy.answerLabel, lang)} <span lang="bn">{answer?.text}</span>
                </p>
                <Link href={`/games/word-map?c=${q.word.id}`} className="mt-1 inline-block text-sm font-extrabold underline">
                  <span lang="bn">{q.word.localWord}</span> — {t(copy.aboutWord, lang)}
                </Link>
              </li>
            );
          })}
        </ol>
      </details>

      <ResultShareKit
        primary={false}
        download
        data={data}
        url={url}
        fileName={`${GAME_SLUG}-result`}
        onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: tierId })}
      />
      <Link href="/games/word-map" className={`${chip} justify-self-center`}>
        {t(copy.wordsLink, lang)}
      </Link>
    </div>
  );
}
