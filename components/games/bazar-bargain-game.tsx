"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ResultStamp, ShareActions } from "@/components/games/challenge-ui";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { bazarCopy as copy, endings, items, lines, vendors } from "@/data/games/bazar-bargain";
import { track } from "@/lib/analytics";
import type { FriendChallenge } from "@/lib/challenge";
import {
  GAME_SLUG,
  LEGENDARY,
  PERSONALITIES,
  act,
  isClosed,
  makeRun,
  offerOptions,
  openStall,
  pickLine,
  summarize,
  type Action,
  type Run,
  type StallState,
  type Summary,
} from "@/lib/games/bazar-bargain";
import { createBestStore, encodeSeed, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang, type Text } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);

type Phase = "idle" | "playing" | "over";
type Challenge = FriendChallenge | null;
type Result = { summary: Summary; run: Run; states: StallState[]; newBest: boolean };

const actionBtn =
  "inline-flex min-h-14 items-center justify-center rounded-2xl border-2 border-ink px-3 py-2 text-center font-extrabold leading-tight shadow-pop transition-all duration-100 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none";

/** Vendor quote (always Bangla) + English gloss in English mode. */
function quote(text: Text, price: number, lang: Lang): { quote: string; gloss: string | null } {
  const q = fmt(t(text, "bn"), { price: num(price, "bn") });
  const g = fmt(t(text, "en"), { price: num(price, "en") });
  return { quote: q, gloss: lang === "en" && g !== q ? g : null };
}

export function BazarBargainGame({ challenge }: { challenge: Challenge }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);

  const [phase, setPhase] = useState<Phase>("idle");
  const [seed, setSeed] = useState<number | null>(challenge?.seed ?? null);
  const [run, setRun] = useState<Run | null>(null);
  const [index, setIndex] = useState(0);
  const [st, setSt] = useState<StallState | null>(null);
  const [done, setDone] = useState<StallState[]>([]);
  const [budget, setBudget] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const closed = st !== null && isClosed(st);

  // Keyboard/screen-reader flow: focus "Next" when a stall closes, the heading at the end.
  useEffect(() => {
    if (closed) nextRef.current?.focus();
  }, [closed, index]);
  useEffect(() => {
    if (phase === "over") headingRef.current?.focus();
  }, [phase]);
  function start(nextSeed: number, kind: "first" | "retry" | "replay") {
    const r = makeRun(nextSeed);
    setSeed(nextSeed);
    setRun(r);
    setIndex(0);
    setDone([]);
    setBudget(r.budget);
    setSt(openStall(r, 0, r.budget));
    setResult(null);
    setPhase("playing");
    track(kind === "first" ? "game_start" : "game_retry", { game: GAME_SLUG, mode: kind });
    rootRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  function doAction(action: Action) {
    if (!run || !st || isClosed(st)) return;
    const next = act(run, index, st, action, budget);
    if (next === st) return;
    setSt(next);
    const paid = next.status === "bought" ? next.paid : null;
    if (paid !== null) setBudget((b) => b - paid);
  }

  function advance() {
    if (!run || !st) return;
    const all = [...done, st];
    if (index + 1 < run.stalls.length) {
      setDone(all);
      setIndex(index + 1);
      setSt(openStall(run, index + 1, budget));
      return;
    }
    const summary = summarize(run, all);
    const prev = bestStore.read();
    if (summary.score > prev) bestStore.write(summary.score);
    setResult({ summary, run, states: all, newBest: summary.score > prev });
    setPhase("over");
    track("game_complete", { game: GAME_SLUG, score: summary.score, rank: summary.ending, bought: summary.bought });
  }

  /** Shared "Challenge a friend" actions for a finished round. */
  function shareActions(r: Result) {
    const ending = endings[r.summary.ending];
    const text = fmt(t(copy.shareText, lang), {
      title: t(ending.title, lang),
      saved: num(r.summary.saved, lang),
      score: num(r.summary.score, lang),
    });
    return <ShareActions game={GAME_SLUG} seed={r.run.seed} score={r.summary.score} text={text} accent={ending.accent} rank={ending.id} />;
  }

  const isChallenge = challenge !== null && seed === challenge.seed;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "idle" && (
        <section className={`${card} p-5 sm:p-6`} aria-labelledby="bz-how">
          {isChallenge && <ChallengeBanner challenge={challenge} />}
          <h2 id="bz-how" className="font-display text-2xl font-extrabold">
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
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm font-bold text-ink-muted">
              🏆 {t(copy.best, lang)}: <span className="text-ink">{num(best, lang)}</span>
            </p>
            <button type="button" onClick={() => start(seed ?? newSeed(), "first")} className={`${btnPrimary} ${accentBg.tangerine} w-full sm:w-auto`}>
              🛒 {t(copy.start, lang)}
            </button>
          </div>
        </section>
      )}

      {phase === "playing" && run && st && (
        <Stall
          run={run}
          index={index}
          st={st}
          done={done}
          budget={budget}
          nextRef={nextRef}
          onAction={doAction}
          onNext={advance}
        />
      )}

      {phase === "over" && result && (
        <ResultView
          result={result}
          challenge={challenge}
          headingRef={headingRef}
          onRetry={() => start(newSeed(), "retry")}
          onReplay={() => start(result.run.seed, "replay")}
          share={shareActions(result)}
        />
      )}
    </div>
  );
}

function Stall({
  run,
  index,
  st,
  done,
  budget,
  nextRef,
  onAction,
  onNext,
}: {
  run: Run;
  index: number;
  st: StallState;
  done: StallState[];
  budget: number;
  nextRef: RefObject<HTMLButtonElement | null>;
  onAction: (a: Action) => void;
  onNext: () => void;
}) {
  const { lang } = useI18n();
  const stall = run.stalls[index]!;
  const item = items[stall.item];
  const vendor = vendors[stall.personality];
  const closed = isClosed(st);
  const maxPatience = PERSONALITIES[stall.personality].patience;
  const saved = done.reduce((sum, s, i) => sum + (s.paid !== null ? run.stalls[i]!.ask0 - s.paid : 0), 0);

  const variants = st.line === "greet" ? vendor.greet : lines[st.line];
  const said = quote(pickLine(variants, run.seed, `${index}-${st.turn}-${st.line}`), st.ask, lang);
  const offers = offerOptions(st);
  const mood = st.patience >= maxPatience ? "😊" : st.patience >= 1 ? "😐" : "😤";

  return (
    <section aria-label={fmt(t(copy.stall, lang), { n: num(index + 1, lang), total: num(run.stalls.length, lang) })}>
      {/* Wallet + progress */}
      <div className="grid grid-cols-2 gap-2">
        <Tile label={t(copy.budget, lang)}>৳{num(budget, lang)}</Tile>
        <Tile label={t(copy.saved, lang)} highlight={saved > 0}>
          ৳{num(saved, lang)}
        </Tile>
      </div>
      <ol className="mt-3 flex items-center justify-center gap-2" aria-label={fmt(t(copy.stall, lang), { n: num(index + 1, lang), total: num(run.stalls.length, lang) })}>
        {run.stalls.map((s, i) => {
          const state = i < done.length ? done[i] : i === index ? st : null;
          const mark = state && isClosed(state) ? (state.status === "bought" ? "✅" : "❌") : null;
          return (
            <li
              key={i}
              aria-current={i === index ? "step" : undefined}
              className={`relative grid size-11 place-items-center rounded-full border-2 border-ink text-xl ${i === index ? "bg-marigold shadow-pop" : "bg-surface"} ${i > index ? "opacity-50" : ""}`}
            >
              <span aria-hidden>{items[s.item].emoji}</span>
              {mark && <span className="absolute -bottom-1 -right-1 text-xs">{mark}</span>}
            </li>
          );
        })}
      </ol>

      {/* The stall */}
      <div className={`${card} mt-4 overflow-hidden`}>
        <div className={`${accentBg[vendor.accent]} flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-3`}>
          <p className="flex items-center gap-2 font-extrabold">
            <span aria-hidden className="text-2xl">{vendor.emoji}</span>
            {t(vendor.name, lang)}
          </p>
          <p className="text-sm font-bold" aria-label={`${t(copy.mood, lang)}: ${st.patience + 1}/${maxPatience + 1}`}>
            <span aria-hidden className="text-2xl">{mood}</span>
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <span aria-hidden className="text-6xl drop-shadow-[3px_3px_0_rgb(26_19_37)]">
              {item.emoji}
            </span>
            <div>
              <h2 className="font-display text-2xl font-extrabold leading-tight">{t(item.name, lang)}</h2>
              <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.asking, lang)}</p>
              <p key={st.ask} className="inline-block font-display text-4xl font-black tabular-nums motion-safe:animate-wiggle">
                ৳{num(st.ask, lang)}
              </p>
              {st.ask < stall.ask0 && (
                <p className="text-sm font-bold text-ink-muted line-through">{fmt(t(copy.wasPrice, lang), { price: num(stall.ask0, lang) })}</p>
              )}
            </div>
          </div>

          {/* Speech bubble */}
          <div aria-live="polite" className="relative mt-4 rounded-2xl border-2 border-ink bg-surface-2 p-3">
            <span aria-hidden className="absolute -top-2 left-8 size-4 rotate-45 border-l-2 border-t-2 border-ink bg-surface-2" />
            <p key={`${index}-${st.turn}`} lang="bn" className="text-lg font-bold">
              {said.quote}
            </p>
            {said.gloss && <p className="mt-0.5 text-sm italic text-ink-muted">{said.gloss}</p>}
          </div>

          {!closed ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={st.ask > budget}
                onClick={() => onAction({ kind: "accept" })}
                className={`${actionBtn} ${accentBg.cng} col-span-2`}
              >
                {st.ask > budget ? t(copy.cantAfford, lang) : fmt(t(copy.accept, lang), { price: num(st.ask, lang) })}
              </button>
              {offers.map((price) => (
                <button
                  key={price}
                  type="button"
                  disabled={price > budget}
                  onClick={() => onAction({ kind: "offer", price })}
                  className={`${actionBtn} bg-lime`}
                >
                  {fmt(t(copy.offer, lang), { price: num(price, lang) })}
                </button>
              ))}
              <button type="button" onClick={() => onAction({ kind: "walk" })} className={`${actionBtn} bg-surface`}>
                {t(copy.walk, lang)}
              </button>
              <button type="button" disabled={st.usedRegular} onClick={() => onAction({ kind: "regular" })} className={`${actionBtn} bg-surface`}>
                {t(copy.regular, lang)}
              </button>
              <button type="button" disabled={st.usedNeighbor} onClick={() => onAction({ kind: "neighbor" })} className={`${actionBtn} bg-surface`}>
                {t(copy.neighbor, lang)}
              </button>
              <button type="button" onClick={() => onAction({ kind: "skip" })} className={`${btnGhost} col-span-2`}>
                {t(copy.skip, lang)}
              </button>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              <p
                className={`mx-auto -rotate-2 rounded-xl border-2 border-ink px-4 py-2 text-center font-display text-xl font-black shadow-pop motion-safe:animate-wiggle ${
                  st.status === "bought" ? "bg-lime" : "bg-chili"
                }`}
              >
                {st.status === "bought" && st.paid !== null
                  ? fmt(t(copy.bought, lang), { price: num(st.paid, lang) })
                  : t(copy.notBought, lang)}
                {st.freebie && <span className="block text-base">{t(copy.freebieNote, lang)}</span>}
              </p>
              <button ref={nextRef} type="button" onClick={onNext} className={`${btnPrimary} ${accentBg.marigold}`}>
                {index + 1 < run.stalls.length ? t(copy.next, lang) : t(copy.finish, lang)}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Tile({ label, highlight = false, children }: { label: string; highlight?: boolean; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border-2 border-ink px-2 py-1.5 text-center shadow-pop ${highlight ? accentBg.lime : "bg-surface"}`}>
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="font-display text-2xl font-extrabold tabular-nums leading-tight">{children}</p>
    </div>
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
  const { summary, run, states } = result;
  const ending = endings[summary.ending];
  const legendary = LEGENDARY.includes(summary.ending);
  const stats = [
    { key: "saved", label: copy.statSaved, value: `৳${num(summary.saved, lang)}` },
    { key: "bought", label: copy.statBought, value: `${num(summary.bought, lang)}/${num(run.stalls.length, lang)}` },
    { key: "skill", label: copy.statSkill, value: `${num(summary.skill, lang)}%` },
    { key: "spent", label: copy.statSpent, value: `৳${num(summary.spent, lang)}` },
  ];

  return (
    <section className="grid gap-3" aria-labelledby="bz-result">
      <div className={`${card} overflow-hidden`}>
        <div className={`${accentBg[ending.accent]} border-b-2 border-ink px-5 py-6 text-center`}>
          {legendary && (
            <p className="mx-auto mb-2 w-fit rotate-[-2deg] rounded-pill border-2 border-ink bg-surface px-3 py-0.5 text-sm font-extrabold shadow-pop">
              {t(copy.legendary, lang)}
            </p>
          )}
          <p aria-hidden className="text-7xl drop-shadow-[3px_3px_0_rgb(26_19_37)] motion-safe:animate-wiggle">
            {ending.emoji}
          </p>
          <h2 id="bz-result" ref={headingRef} tabIndex={-1} className="mt-2 font-display text-4xl font-extrabold leading-tight outline-none">
            {t(ending.title, lang)}
          </h2>
          <p className="mt-1 font-display text-5xl font-black tabular-nums">
            {num(summary.score, lang)} <span className="text-lg font-bold">{t(copy.pts, lang)}</span>
          </p>
        </div>
        <div className="p-5">
          <p className="text-center text-ink-muted">{t(ending.blurb, lang)}</p>
          {result.newBest && <p className="mt-3 text-center font-extrabold text-cng-deep">{t(copy.newBest, lang)}</p>}
          <ChallengeOutcome challenge={challenge} seed={run.seed} score={summary.score} />
          <dl className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.key} className="rounded-xl border-2 border-ink bg-surface-2 px-1 py-2">
                <dt className="text-[10px] font-extrabold uppercase leading-tight tracking-wide text-ink-muted sm:text-xs">{t(s.label, lang)}</dt>
                <dd className="font-display text-xl font-extrabold tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>

          {/* Receipt */}
          <h3 className="mt-5 text-sm font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.receipt, lang)}</h3>
          <ul className="mt-2 divide-y-2 divide-dashed divide-ink/20 rounded-xl border-2 border-ink bg-surface px-3 font-mono text-sm">
            {run.stalls.map((s, i) => {
              const state = states[i];
              const paid = state?.paid ?? null;
              return (
                <li key={i} className="flex items-center justify-between gap-2 py-2">
                  <span className="font-sans font-bold">
                    <span aria-hidden>{items[s.item].emoji}</span> {t(items[s.item].name, lang)}
                    {state?.freebie && <span aria-hidden> 🍋</span>}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {paid !== null ? (
                      <>
                        <span className="text-ink-muted line-through">৳{num(s.ask0, lang)}</span> ৳{num(paid, lang)}
                      </>
                    ) : (
                      "❌"
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-center text-xs font-bold text-ink-muted">
            {t(copy.bazarCode, lang)}: <code className="font-mono">{encodeSeed(run.seed)}</code>
          </p>
        </div>
        <ResultStamp game={GAME_SLUG} />
      </div>
      {share}
      <button type="button" onClick={onRetry} className={`${btnPrimary} bg-surface`}>
        {t(copy.retry, lang)}
      </button>
      <button type="button" onClick={onReplay} className={btnGhost}>
        {t(copy.replay, lang)}
      </button>
    </section>
  );
}
