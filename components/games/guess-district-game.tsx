"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { DistrictMap } from "@/components/games/district-map";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { DISTRICTS } from "@/data/dialects/districts";
import { DISTRICT_SHAPES } from "@/data/dialects/map";
import { divisionOf } from "@/data/divisions";
import { gdCopy as copy, promptFor, rankInfo, rightLines, wrongLines } from "@/data/games/guess-district";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import { bdDateKey, formatCountdown, getPinnedKey, msUntilNextDay, nowSecond, repinDaily, subscribePinned, subscribeSecond } from "@/lib/daily";
import type { ClueLite } from "@/lib/district-clues";
import {
  bboxOf,
  buildRound,
  correctness,
  dailyNumber,
  dailySeed,
  GAME_SLUG,
  gridOf,
  rankFor,
  typeScores,
  type Question,
} from "@/lib/games/guess-district";
import { parseGdRecord, readGdRaw, recordGd, subscribeGd } from "@/lib/games/guess-district-daily";
import { createBestStore, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import { hashString, newSeed } from "@/lib/random";
import type { ResultCardData } from "@/lib/result-card";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);
const NAME = new Map(DISTRICTS.map((d) => [d.id, d.name]));
const LIME = "#b8f13a";
const CHILI = "#ff5c93";
const MARIGOLD = "#ffc53d";

type Mode = "daily" | "practice" | "challenge";
type Phase = "intro" | "quiz" | "result";

const districtName = (id: string, lang: Lang) => t(NAME.get(id) ?? id, lang);

export function GuessDistrictGame({ clues, challenge }: { clues: ClueLite[]; challenge: FriendChallenge | null }) {
  const { lang } = useI18n();
  // The day this page plays: pinned on first read so midnight never swaps a running round.
  const dateKey = useSyncExternalStore(subscribePinned, getPinnedKey, () => null);
  const record = parseGdRecord(useSyncExternalStore(subscribeGd, () => (dateKey ? readGdRaw(dateKey) : null), () => null));
  const clueOf = useMemo(() => new Map(clues.map((c) => [c.id, c])), [clues]);

  const [phase, setPhase] = useState<Phase>("intro");
  const [mode, setMode] = useState<Mode>(challenge ? "challenge" : "daily");
  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const plays = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const round = useMemo<Question[]>(() => (seed === null ? [] : buildRound(clues, seed)), [clues, seed]);
  const index = revealed ? answers.length - 1 : answers.length;

  function begin(m: Mode, s: number) {
    setMode(m);
    setSeed(s);
    setAnswers([]);
    setRevealed(false);
    setNewBest(false);
    setPhase("quiz");
    track(plays.current > 0 ? "game_retry" : "game_start", { game: GAME_SLUG, mode: m });
    plays.current++;
    rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  const startDaily = () => dateKey && begin("daily", dailySeed(dateKey));
  const startPractice = () => begin("practice", newSeed());
  const startChallenge = () => challenge && begin("challenge", challenge.seed);

  function pickOption(id: string) {
    if (phase !== "quiz" || revealed) return;
    setAnswers((a) => [...a, id]);
    setRevealed(true);
  }

  function next() {
    if (!revealed) return;
    if (answers.length < round.length) {
      setRevealed(false);
      return;
    }
    const results = correctness(round, answers);
    const score = results.filter(Boolean).length;
    const prev = bestStore.read();
    if (score > prev) bestStore.write(score);
    setNewBest(score > prev);
    if (mode === "daily" && dateKey) recordGd(dateKey, score, gridOf(results));
    setPhase("result");
    track("game_complete", { game: GAME_SLUG, score, mode, rank: rankFor(score) });
  }

  // Keys: 1–4 / A–D answer, Enter = next.
  useEffect(() => {
    if (phase !== "quiz") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const q = round[index];
      if (!q) return;
      const n = "1234".indexOf(e.key) >= 0 ? "1234".indexOf(e.key) : "abcd".indexOf(e.key.toLowerCase());
      if (!revealed && n >= 0 && e.key.length === 1) {
        e.preventDefault();
        pickOption(q.options[n]!);
      } else if (revealed && e.key === "Enter") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const number = dateKey ? dailyNumber(dateKey) : null;
  const label = mode === "daily" && number !== null ? `#${num(number, lang)}` : t(copy.practiceLabel, lang);

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "intro" && (
        <section className="grid gap-4">
          {challenge && <ChallengeBanner game={GAME_SLUG} challenge={challenge} onAccept={startChallenge} />}
          {dateKey && !challenge && <NewPuzzleBanner pinned={dateKey} />}
          <div className={`${card} grid gap-3 p-6 text-center`}>
            <h2 className="font-display text-3xl font-black">
              {challenge || number === null ? t(copy.practiceTitle, lang) : fmt(t(copy.dailyTitle, lang), { n: num(number, lang) })}
            </h2>
            <p className="font-bold">{t(challenge ? copy.introPractice : copy.intro, lang)}</p>
            <p className="text-sm font-bold text-ink-muted">{t(copy.how, lang)}</p>
            {!challenge && record && dateKey && (
              <p className="mx-auto rounded-pill border-2 border-ink bg-lime px-3 py-1 text-sm font-extrabold">
                <TodayLine score={record.first} lang={lang} />
              </p>
            )}
            {!challenge && record && <p aria-label={t(copy.title, lang)} className="text-2xl tracking-widest">{record.grid}</p>}
          </div>
          {challenge ? null : record ? (
            <>
              <button type="button" onClick={startPractice} className={`${btnPrimary} ${accentBg.sky} min-h-16 text-2xl`}>
                {t(copy.practice, lang)}
              </button>
              <button type="button" onClick={startDaily} className={btnGhost}>
                {fmt(t(copy.playToday, lang), { n: num(number ?? 1, lang) })}
              </button>
            </>
          ) : (
            <button type="button" onClick={startDaily} disabled={!dateKey} className={`${btnPrimary} ${accentBg.sky} min-h-16 text-2xl`}>
              {t(copy.start, lang)}
            </button>
          )}
        </section>
      )}

      {phase === "quiz" && round[index] && seed !== null && (
        <QuestionView
          q={round[index]}
          index={index}
          seed={seed}
          picked={revealed ? answers[index]! : null}
          clue={round[index].clueId ? clueOf.get(round[index].clueId) : undefined}
          isLast={index === round.length - 1}
          onPick={pickOption}
          onNext={next}
        />
      )}

      {phase === "result" && seed !== null && (
        <ResultView
          round={round}
          answers={answers}
          seed={seed}
          mode={mode}
          label={label}
          challenge={challenge}
          newBest={newBest}
          onPractice={startPractice}
        />
      )}
    </div>
  );
}

/** "Today: 8/10 · next puzzle in 05:12:09" — the 1 s clock lives here, not in the game. */
export function TodayLine({ score, lang }: { score: number; lang: Lang }) {
  const now = useSyncExternalStore(subscribeSecond, nowSecond, () => 0);
  return <>{fmt(t(copy.todayDone, lang), { score: num(score, lang), time: now ? formatCountdown(msUntilNextDay(now)) : "--:--:--" })}</>;
}

/** Midnight passed while this page was open: offer the new puzzle instead of swapping. */
function NewPuzzleBanner({ pinned }: { pinned: string }) {
  const { lang } = useI18n();
  const now = useSyncExternalStore(subscribeSecond, nowSecond, () => 0);
  if (!now || bdDateKey(now) === pinned) return null;
  return (
    <div className="-rotate-1 rounded-2xl border-2 border-ink bg-marigold p-3 text-center font-extrabold shadow-pop" role="status">
      {t(copy.newPuzzle, lang)}{" "}
      <button type="button" onClick={repinDaily} className="underline">
        {t(copy.loadNew, lang)}
      </button>
    </div>
  );
}

function Silhouette({ id, label }: { id: string; label: string }) {
  const shape = DISTRICT_SHAPES[id]!;
  const b = bboxOf(shape.d);
  const pad = Math.max(b.w, b.h) * 0.08;
  return (
    <svg viewBox={`${b.x - pad} ${b.y - pad} ${b.w + pad * 2} ${b.h + pad * 2}`} role="img" aria-label={label} className="mx-auto h-56 w-full max-w-xs">
      <path d={shape.d} fill={MARIGOLD} stroke="#1a1325" strokeWidth={Math.max(b.w, b.h) / 60} strokeLinejoin="round" />
    </svg>
  );
}

function QuestionView({
  q,
  index,
  seed,
  picked,
  clue,
  isLast,
  onPick,
  onNext,
}: {
  q: Question;
  index: number;
  seed: number;
  picked: string | null;
  clue?: ClueLite;
  isLast: boolean;
  onPick: (id: string) => void;
  onNext: () => void;
}) {
  const { lang } = useI18n();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => headingRef.current?.focus({ preventScroll: true }), [index]);
  useEffect(() => {
    if (picked) nextRef.current?.focus({ preventScroll: true });
  }, [picked]);

  const progress = fmt(t(copy.progress, lang), { n: num(index + 1, lang) });
  const right = picked === q.answer;
  const variant = hashString(`${GAME_SLUG}:${seed}:line:${index}`) % 3;
  const division = divisionOf(q.answer);
  const answerName = districtName(q.answer, lang);

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <p className="rounded-pill border-2 border-ink bg-surface px-3 py-0.5 text-sm font-extrabold tabular-nums">{progress}</p>
        <p className="text-xs font-bold text-ink-muted">{t(copy.keys, lang)}</p>
      </div>
      <h2 ref={headingRef} tabIndex={-1} className="-rotate-1 justify-self-center rounded-2xl border-2 border-ink bg-marigold px-4 py-2 text-center font-display text-2xl font-black shadow-pop outline-none">
        {t(promptFor[q.type], lang)}
      </h2>

      {/* The visual. Neutral labels only: no answer in the DOM or ARIA before answering. */}
      <div className={`${card} p-3`}>
        {picked ? (
          <DistrictMap visited={new Set()} fills={{ [q.answer]: LIME, ...(right ? {} : { [picked]: CHILI }) }} title={t(copy.revealAria, lang)} className="mx-auto max-w-[280px]" />
        ) : q.type === "locate" ? (
          <DistrictMap visited={new Set()} fills={{ [q.answer]: MARIGOLD }} anonymous title={fmt(t(copy.mapAria, lang), { n: num(index + 1, lang) })} className="mx-auto max-w-[280px]" />
        ) : q.type === "shape" ? (
          <Silhouette id={q.answer} label={fmt(t(copy.shapeAria, lang), { n: num(index + 1, lang) })} />
        ) : (
          <p className="p-4 text-center font-display text-2xl font-black leading-snug" lang={lang}>
            “{clue ? clue.clue[lang] : ""}”
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3" role="group" aria-label={progress}>
        {q.options.map((id, i) => {
          const state = !picked ? "idle" : id === q.answer ? "right" : id === picked ? "wrong" : "other";
          return (
            <button
              key={id}
              type="button"
              disabled={Boolean(picked)}
              onClick={() => onPick(id)}
              className={`min-h-14 rounded-2xl border-2 border-ink px-2 py-2 text-center font-extrabold shadow-pop transition-transform active:translate-y-0.5 active:shadow-none disabled:cursor-default ${
                state === "right" ? "bg-lime" : state === "wrong" ? "bg-chili" : state === "other" ? "bg-surface opacity-60" : "bg-surface hover:bg-sky"
              }`}
            >
              <span aria-hidden className="mr-1 text-xs text-ink-muted">
                {i + 1}
              </span>
              {districtName(id, lang)}
            </button>
          );
        })}
      </div>

      {picked && (
        <div aria-live="polite" className={`motion-safe:animate-pop-in rounded-2xl border-2 border-ink p-4 shadow-pop ${right ? "bg-lime" : "bg-surface"}`}>
          <p className="text-lg font-black">{t((right ? rightLines : wrongLines)[variant]!, lang)}</p>
          <p className="font-extrabold">
            {right
              ? fmt(t(copy.inDivision, lang), { district: answerName, division: division ? t(division.name, lang) : "" })
              : fmt(t(copy.itWas, lang), { district: answerName })}
          </p>
          {clue?.reveal && <p className="mt-1 font-semibold">{clue.reveal[lang]}</p>}
          {clue && clue.sources.length > 0 && (
            <p className="mt-1 text-xs font-semibold text-ink-muted">
              {t(copy.source, lang)}:{" "}
              {clue.sources.map((s, i) => (
                <span key={i}>
                  {i > 0 && " · "}
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="underline">
                      {s.title}
                    </a>
                  ) : (
                    s.title
                  )}
                </span>
              ))}
            </p>
          )}
          <button ref={nextRef} type="button" onClick={onNext} className={`${btnPrimary} ${accentBg.sky} mt-3 w-full`}>
            {t(isLast ? copy.finish : copy.next, lang)}
          </button>
        </div>
      )}
    </section>
  );
}

function ResultView({
  round,
  answers,
  seed,
  mode,
  label,
  challenge,
  newBest,
  onPractice,
}: {
  round: Question[];
  answers: string[];
  seed: number;
  mode: Mode;
  label: string;
  challenge: FriendChallenge | null;
  newBest: boolean;
  onPractice: () => void;
}) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus({ preventScroll: false }), []);
  const results = correctness(round, answers);
  const score = results.filter(Boolean).length;
  const rankId = rankFor(score);
  const info = rankInfo[rankId];
  const grid = gridOf(results);
  const types = typeScores(round, results);
  const typeStat = (k: keyof typeof types, labelText: string) =>
    types[k] ? [{ label: labelText, value: `${num(types[k]!.correct, lang)}/${num(types[k]!.total, lang)}` }] : [];
  const scoreText = `${num(score, lang)}/${num(10, lang)}`;
  const message = `${fmt(t(copy.shareText, lang), { label, score: num(score, lang) })}\n${grid}`;

  const data: ResultCardData = {
    game: t(copy.title, lang),
    emoji: "🗺️",
    accent: info.accent,
    headlineLabel: `${t(copy.scoreLabel, lang)} · ${label}`,
    headline: scoreText,
    title: t(info.title, lang),
    stats: [
      { label: t(copy.scoreLabel, lang), value: scoreText },
      ...typeStat("locate", t(copy.statMap, lang)),
      ...typeStat("shape", t(copy.statShape, lang)),
      ...typeStat("clue", t(copy.statClue, lang)),
      // Copy result only (cards show 4): the spoiler-free grid.
      { label: "🗺️", value: grid },
    ],
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed, score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <div className="grid gap-4">
      <ResultCard data={data} host={host} headingId="gd-result" headingRef={headingRef}>
        <p className="mt-3 text-center text-2xl tracking-widest" aria-label={`${scoreText}`}>
          {grid}
        </p>
        {mode === "challenge" && <ChallengeOutcome game={GAME_SLUG} challenge={challenge} seed={seed} score={score} />}
        {newBest && <p className="mt-2 text-center text-lg font-black">{t(copy.newBest, lang)}</p>}
      </ResultCard>
      <ShareActions game={GAME_SLUG} seed={seed} score={score} text={message} accent={info.accent} rank={rankId} />
      <ResultShareKit primary={false} data={data} url={url} fileName={`${GAME_SLUG}-result`} onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankId })} />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onPractice} className={`${btnPrimary} ${accentBg.sky} px-3 text-base`}>
          {t(copy.again, lang)}
        </button>
        <Link href="/games/my-bangladesh" className={`${btnPrimary} bg-surface px-3 text-base`}>
          {t(copy.myMap, lang)}
        </Link>
      </div>
    </div>
  );
}
