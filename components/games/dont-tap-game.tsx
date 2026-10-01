"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { decoys, dontTapCopy as copy, dontTapRanks, reactionComment } from "@/data/games/dont-tap";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import { getGame } from "@/data/games";
import type { ResultCardData } from "@/lib/result-card";
import {
  GAME_SLUG,
  MAX_FALSE_STARTS_PER_ROUND,
  PENALTY_MS,
  ROUNDS,
  TOO_SLOW_MS,
  pickLine,
  rankFor,
  roundPlan,
  summarize,
  type RoundResult,
  type Summary,
} from "@/lib/games/dont-tap";
import { createBestStore, encodeSeed, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const gameInfo = getGame(GAME_SLUG)!;

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);

const READY_MS = 900;
const SHOW_MS = 1100;
const EARLY_MS = 1300;

type Phase = "idle" | "playing" | "over";
type Challenge = FriendChallenge | null;
type Result = { summary: Summary; rounds: RoundResult[]; seed: number; newBest: boolean };
type Tone = "ready" | "wait" | "maybe" | "go" | "early" | "show";

/** Event time on the performance.now() clock (falls back to now). */
function stamp(e: Event): number {
  const now = performance.now();
  return e.timeStamp > 0 && e.timeStamp <= now + 5 ? e.timeStamp : now;
}

// Colours come from data-tone so the loop only flips an attribute (no React render).
// No colour transition: the signal must appear instantly.
const buttonClass =
  "relative mx-auto grid aspect-square w-full max-w-[min(100%,24rem)] touch-manipulation select-none place-items-center rounded-[2.5rem] border-4 border-ink text-ink shadow-pop-lg outline-offset-4 " +
  "data-[tone=ready]:bg-surface-2 data-[tone=wait]:bg-chili data-[tone=maybe]:bg-marigold data-[tone=go]:bg-lime data-[tone=early]:bg-ink data-[tone=early]:text-bg data-[tone=show]:bg-sky " +
  "motion-safe:transition-transform motion-safe:duration-75 motion-safe:data-[tone=go]:scale-[1.03] active:translate-x-1 active:translate-y-1 active:shadow-none";

export function DontTapGame({ challenge }: { challenge: Challenge }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [runId, setRunId] = useState(0);
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLSpanElement>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);
  const srRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // ----- Round controller: timers + rAF drive the button directly. -----
  useEffect(() => {
    if (phase !== "playing" || seed === null) return;
    const btn = btnRef.current;
    const label = labelRef.current;
    const sub = subRef.current;
    const emoji = emojiRef.current;
    const sr = srRef.current;
    if (!btn || !label || !sub || !emoji || !sr) return;

    const reduce = prefersReducedMotion();
    const timers: number[] = [];
    const frames: number[] = [];
    const results: RoundResult[] = [];
    let round = 0;
    let attempt = 0;
    let falseStarts = 0;
    let state: Tone = "ready";
    let goAt = 0;
    let lastKeyHit = -Infinity;

    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    /** Apply a visual change in the next frame so its timestamp matches the paint. */
    const inFrame = (fn: () => void) => frames.push(requestAnimationFrame(fn));
    const clearAll = () => {
      timers.forEach((id) => window.clearTimeout(id));
      frames.forEach((id) => cancelAnimationFrame(id));
      timers.length = 0;
      frames.length = 0;
    };

    const paint = (tone: Tone, text: string, subText: string, icon: string, announce?: string) => {
      state = tone;
      btn.dataset.tone = tone;
      label.textContent = text;
      sub.textContent = subText;
      emoji.textContent = icon;
      if (announce !== undefined) sr.textContent = announce;
    };

    const startRound = () => {
      paint("wait", t(copy.wait, lang), t(copy.waitSub, lang), "✋", t(copy.srWait, lang));
      for (const ev of roundPlan(seed, round, attempt)) {
        if (ev.kind === "decoy") {
          const d = decoys[ev.decoy];
          later(
            () =>
              inFrame(() => {
                if (state !== "wait") return;
                paint(d.tone === "go" ? "go" : d.tone === "maybe" ? "maybe" : "wait", t(d.label, lang), t(copy.waitSub, lang), d.emoji, t(copy.srDecoy, lang));
                state = "maybe"; // any decoy counts as "not yet", whatever it looks like
              }),
            ev.at,
          );
          later(
            () =>
              inFrame(() => {
                if (state === "maybe") paint("wait", t(copy.wait, lang), t(copy.waitSub, lang), "✋");
              }),
            ev.at + ev.ms,
          );
        } else {
          later(
            () =>
              inFrame(() => {
                if (state !== "wait") return;
                paint("go", t(copy.go, lang), t(copy.goSub, lang), "👆", t(copy.srGo, lang));
                goAt = performance.now(); // right after the DOM change, same frame as the paint
                later(() => {
                  if (state === "go") record(TOO_SLOW_MS, true, false);
                }, TOO_SLOW_MS);
              }),
            ev.at,
          );
        }
      }
    };

    const record = (ms: number, slow: boolean, penalty: boolean) => {
      clearAll();
      results.push({ ms: Math.round(ms), falseStarts, slow, penalty });
      setRounds([...results]);
      const comment = pickLine(reactionComment(ms), seed, `c-${round}`);
      if (slow) paint("show", fmt(t(copy.slow, lang), { n: num(ms / 1000, lang) }), t(copy.slowSub, lang), "💤", t(copy.slowSub, lang));
      else if (penalty) paint("show", fmt(t(copy.ms, lang), { n: num(ms, lang) }), t(copy.penaltySub, lang), "🚫", t(copy.penaltySub, lang));
      else {
        const text = fmt(t(copy.ms, lang), { n: num(Math.round(ms), lang) });
        paint("show", text, t(comment, lang), "⏱️", `${text}. ${t(comment, lang)}`);
      }
      state = "show";
      later(next, SHOW_MS);
    };

    const next = () => {
      round += 1;
      attempt = 0;
      falseStarts = 0;
      if (round >= ROUNDS) finish();
      else startRound();
    };

    const falseStart = () => {
      clearAll();
      falseStarts += 1;
      if (!reduce) {
        btn.animate([{ translate: "0 0" }, { translate: "-10px 0" }, { translate: "10px 0" }, { translate: "-5px 0" }, { translate: "0 0" }], { duration: 300 });
      }
      try {
        navigator.vibrate?.(60);
      } catch {
        // vibration unsupported
      }
      if (falseStarts >= MAX_FALSE_STARTS_PER_ROUND) {
        record(PENALTY_MS, false, true);
        return;
      }
      paint("early", t(copy.early, lang), t(copy.earlySub, lang), "🙈", `${t(copy.early, lang)} ${t(copy.earlySub, lang)}`);
      attempt += 1;
      later(startRound, EARLY_MS);
    };

    const hit = (at: number) => {
      if (state === "go") record(Math.max(0, at - goAt), false, false);
      else if (state === "wait" || state === "maybe") falseStart();
      // "ready", "early", "show": taps are ignored
    };

    const finish = () => {
      const summary = summarize(results);
      const prev = bestStore.read();
      if (summary.score > prev) bestStore.write(summary.score);
      setResult({ summary, rounds: [...results], seed, newBest: summary.score > prev });
      setPhase("over");
      track("game_complete", {
        game: GAME_SLUG,
        score: summary.score,
        rank: rankFor(summary.score, summary.falseStarts),
        avg_ms: summary.avg,
      });
    };

    // Native listeners: lowest latency, and event.timeStamp is the true input time.
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      hit(stamp(e));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== " " && e.key !== "Enter") return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, input, textarea, select")) return;
      e.preventDefault();
      if (e.repeat) return;
      lastKeyHit = performance.now();
      hit(stamp(e));
    };
    // Assistive tech "clicks" (no pointer, no key) still count.
    const onClick = (e: MouseEvent) => {
      if (e.detail === 0 && performance.now() - lastKeyHit > 500) hit(stamp(e));
    };
    btn.addEventListener("pointerdown", onPointer);
    btn.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);

    paint("ready", t(copy.ready, lang), t(copy.waitSub, lang), "🚦", t(copy.ready, lang));
    btn.focus({ preventScroll: true });
    later(startRound, READY_MS);

    return () => {
      clearAll();
      btn.removeEventListener("pointerdown", onPointer);
      btn.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, seed, runId, lang]);

  useEffect(() => {
    if (phase === "over") headingRef.current?.focus();
  }, [phase]);

  function start(nextSeed: number, kind: "first" | "retry" | "replay") {
    setSeed(nextSeed);
    setRunId((n) => n + 1);
    setRounds([]);
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  /** Shared "Challenge a friend" actions for a finished round. */
  function shareActions(r: Result) {
    const rank = dontTapRanks[rankFor(r.summary.score, r.summary.falseStarts)];
    const text = fmt(t(copy.shareText, lang), {
      avg: num(r.summary.avg, lang),
      best: num(r.summary.best, lang),
      title: t(rank.title, lang),
      score: num(r.summary.score, lang),
    });
    return <ShareActions game={GAME_SLUG} seed={r.seed} score={r.summary.score} text={text} accent={rank.accent} rank={rank.id} />;
  }

  const isChallenge = challenge !== null && seed === challenge.seed;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-5 sm:p-6`} aria-labelledby="dt-how">
          {isChallenge && <ChallengeBanner game={GAME_SLUG} challenge={challenge} onAccept={() => start(seed ?? newSeed(), "first")} />}
          <h2 id="dt-how" className="font-display text-2xl font-extrabold">
            {t(copy.howTitle, lang)}
          </h2>
          <ol className="mt-3 grid gap-2">
            {copy.how.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-lime text-sm font-extrabold">
                  {num(i + 1, lang)}
                </span>
                <span className="text-ink-muted">{t(item, lang)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-sm font-extrabold">{t(copy.rulesTitle, lang)}</p>
          <ul className="mt-2 grid grid-cols-3 gap-2 text-center text-xs font-extrabold">
            <li className="rounded-xl border-2 border-ink bg-lime p-2">
              <span className="block text-base">{t(copy.go, lang)}</span>✅ {t(copy.ruleOk, lang)}
            </li>
            <li className="rounded-xl border-2 border-ink bg-lime p-2">
              <span className="block text-base">{t(copy.wait, lang)}</span>❌ {t(copy.ruleNo1, lang)}
            </li>
            <li className="rounded-xl border-2 border-ink bg-chili p-2">
              <span className="block text-base">{t(copy.go, lang)}</span>❌ {t(copy.ruleNo2, lang)}
            </li>
          </ul>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm font-bold text-ink-muted">
              🏆 {t(copy.best, lang)}: <span className="text-ink">{num(best, lang)}</span>
            </p>
            <button type="button" onClick={() => start(seed ?? newSeed(), "first")} className={`${btnPrimary} ${accentBg.chili} w-full sm:w-auto`}>
              ✋ {t(copy.start, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && (
        <section aria-label={t(copy.buttonLabel, lang)}>
          <RoundDots rounds={rounds} />
          <button
            ref={btnRef}
            type="button"
            aria-label={t(copy.buttonLabel, lang)}
            aria-describedby="dt-status"
            onContextMenu={(e) => e.preventDefault()}
            className={`${buttonClass} mt-4`}
          >
            {/* Filled in by the round controller (no React render on the hot path). */}
            <span className="grid place-items-center gap-2 px-4 text-center">
              <span ref={emojiRef} aria-hidden className="text-6xl leading-none sm:text-7xl" />
              <span ref={labelRef} className="font-display text-5xl font-black leading-none tracking-tight sm:text-6xl" />
              <span ref={subRef} className="text-sm font-bold opacity-80" />
            </span>
          </button>
          <p ref={srRef} id="dt-status" className="sr-only" aria-live="assertive" />
        </section>
      )}

      {phase === "over" && result && (
        <ResultView
          result={result}
          challenge={challenge}
          headingRef={headingRef}
          onRetry={() => start(newSeed(), "retry")}
          onReplay={() => start(result.seed, "replay")}
          share={shareActions(result)}
        />
      )}
    </div>
  );
}

function RoundDots({ rounds }: { rounds: RoundResult[] }) {
  const { lang } = useI18n();
  return (
    <ol className="grid grid-cols-5 gap-1.5" aria-label={fmt(t(copy.round, lang), { n: num(Math.min(rounds.length + 1, ROUNDS), lang), total: num(ROUNDS, lang) })}>
      {Array.from({ length: ROUNDS }, (_, i) => {
        const r = rounds[i];
        const current = i === rounds.length;
        return (
          <li
            key={i}
            aria-current={current ? "step" : undefined}
            className={`rounded-xl border-2 border-ink px-1 py-1.5 text-center text-xs font-extrabold tabular-nums ${
              r ? (r.slow || r.penalty ? "bg-chili" : "bg-lime") : current ? "bg-marigold shadow-pop" : "bg-surface opacity-60"
            }`}
          >
            {r ? (r.penalty ? "🚫" : r.slow ? "💤" : num(r.ms, lang)) : num(i + 1, lang)}
          </li>
        );
      })}
    </ol>
  );
}

function ResultView({
  result,
  challenge,
  headingRef,
  onRetry,
  onReplay,
  share,
}: {
  result: Result;
  challenge: Challenge;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onReplay: () => void;
  /** Share buttons (challenge link). */
  share: ReactNode;
}) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();
  const { summary, rounds } = result;
  const rankId = rankFor(summary.score, summary.falseStarts);
  const rank = dontTapRanks[rankId];
  const stats = [
    { key: "avg", label: copy.avg, value: fmt(t(copy.ms, lang), { n: num(summary.avg, lang) }) },
    { key: "best", label: copy.bestTime, value: fmt(t(copy.ms, lang), { n: num(summary.best, lang) }) },
    { key: "fs", label: copy.falseStarts, value: num(summary.falseStarts, lang) },
  ];

  const card: ResultCardData = {
    game: t(gameInfo.title, lang),
    emoji: gameInfo.emoji,
    accent: rank.accent,
    headline: `${num(summary.score, lang)} ${t(copy.pts, lang)}`,
    title: t(rank.title, lang),
    titleEmoji: rank.emoji,
    blurb: t(rank.blurb, lang),
    stats: stats.map((st) => ({ label: t(st.label, lang), value: st.value })),
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed: result.seed, score: summary.score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <section className="grid gap-3" aria-labelledby="dt-result">
      <ResultCard data={card} host={host} headingId="dt-result" headingRef={headingRef}>
        {result.newBest && <p className="text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
        <ChallengeOutcome game={GAME_SLUG} challenge={challenge} seed={result.seed} score={summary.score} />
          <h3 className="mt-5 text-sm font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.rounds, lang)}</h3>
          <ol className="mt-2 grid gap-1.5">
            {rounds.map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-bold">
                <span className="w-5 text-right tabular-nums text-ink-muted">{num(i + 1, lang)}</span>
                <span className="relative h-5 flex-1 overflow-hidden rounded-pill border-2 border-ink bg-surface">
                  <span
                    className={`block h-full ${r.slow || r.penalty ? "bg-chili" : r.ms < 300 ? "bg-lime" : "bg-marigold"}`}
                    style={{ width: `${Math.min(100, (r.ms / 1000) * 100)}%` }}
                  />
                </span>
                <span className="w-24 text-right tabular-nums">
                  {r.penalty ? "🚫 " : r.slow ? "💤 " : ""}
                  {fmt(t(copy.ms, lang), { n: num(r.ms, lang) })}
                  {r.falseStarts > 0 && <span className="text-chili-deep"> ×{num(r.falseStarts, lang)}</span>}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-center text-xs font-bold text-ink-muted">
            {t(copy.seedCode, lang)}: <code className="font-mono">{encodeSeed(result.seed)}</code>
          </p>
      </ResultCard>
      {share}
      <ResultShareKit primary={false} data={card} url={url} fileName={`${GAME_SLUG}-result`} onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankId })} />
      <button type="button" onClick={onRetry} className={`${btnPrimary} bg-surface`}>
        {t(copy.retry, lang)}
      </button>
      <button type="button" onClick={onReplay} className={btnGhost}>
        {t(copy.replay, lang)}
      </button>
    </section>
  );
}
