"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { endingInfo, kopInfo, latimCopy as copy, opponentInfo, rankInfo } from "@/data/games/latim-fight";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import { aimFromDrag, pingPong, rotateDir } from "@/lib/flick/aim";
import { cloneWorld, freeze, isSettled, simulate, step, STEP_MS, type StepEvents, type World } from "@/lib/flick/physics";
import {
  applyKop,
  CIRCLE,
  cpuThrow,
  createMatch,
  endingOf,
  GAME_SLUG,
  H,
  isWin,
  kopGrade,
  LR,
  MAX_BOUTS,
  opponentOf,
  OPPONENTS,
  other,
  packSeed,
  perfectKops,
  rankFor,
  resolve,
  scoreOf,
  spinFor,
  sweetSpot,
  SWEET_WIDTH,
  throwOrigin,
  throwWorld,
  W,
  WIN_AT,
  type KopGrade,
  type LastEvent,
  type LtState,
  type OpponentId,
  type Side,
  type Throw,
} from "@/lib/games/latim-fight";
import { createBestStore, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";
import type { ResultCardData } from "@/lib/result-card";
import { playSound, soundStore } from "@/lib/sound";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);
const INTRO_KEY = `hottogol:${GAME_SLUG}:intro-seen`;
const MAX_STEPS = 120 * 20;
const CPU_DELAY_MS = 750;
const WIND_PERIOD_MS = 1200;
const SLOWMO_MS = 400;
/** Kop ring: shrinks from KOP_FROM × to KOP_TO × the latim's radius over KOP_MS. */
const KOP_MS = 1300;
const KOP_FROM = 3.4;
const KOP_TO = 0.6;
const KOP_MEET_MS = ((KOP_FROM - 1) / (KOP_FROM - KOP_TO)) * KOP_MS;

type Phase = "intro" | "playing" | "over";
type Piece = { id: Side; x: number; y: number; spin: number; fallen: boolean };

const cq = (v: number) => `${(v / W) * 100}cqw`;
const STRIPES: Record<Side, string> = {
  you: "repeating-conic-gradient(var(--marigold) 0 30deg, var(--chili) 30deg 60deg)",
  cpu: "repeating-conic-gradient(var(--violet) 0 30deg, var(--sky) 30deg 60deg)",
};

/** Latims on the ground, plus the thrower's latim in hand at the throwing spot. */
function piecesOf(s: LtState): Piece[] {
  const throwing = s.stage === "order" || s.stage === "defend" || s.stage === "attack";
  return (["you", "cpu"] as const).flatMap((id) => {
    if (throwing && s.turn === id) return [{ id, ...throwOrigin(s), spin: 0, fallen: false }];
    const l = s.latims[id];
    return l ? [{ id, ...l }] : [];
  });
}

function eventLine(last: LastEvent | null, name: string, lang: Lang): string | null {
  if (!last) return null;
  switch (last.kind) {
    case "attacker":
      return last.side === "you" ? t(copy.youAttack, lang) : fmt(t(copy.cpuAttack, lang), { name });
    case "placed":
      return t(copy.placed, lang);
    case "knockout":
      return last.side === "you" ? t(copy.knockoutYou, lang) : fmt(t(copy.knockoutCpu, lang), { name });
    case "stuck":
      return t(copy.stuck, lang);
    case "swap":
      return t(last.hit ? copy.swapHit : copy.swapMiss, lang);
    case "kop":
      return t(kopInfo[last.grade], lang);
    default:
      return null;
  }
}

export function LatimFightGame({ challenge }: { challenge: FriendChallenge | null }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);
  const locked = challenge ? opponentOf(challenge.seed) : null;
  const friend = locked ? challenge : null;
  const [opponent, setOpponent] = useState<OpponentId>(locked ?? "boro-bhai");
  const [seed, setSeed] = useState<number | null>(friend?.seed ?? null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [match, setMatch] = useState<LtState | null>(null);
  const [final, setFinal] = useState<{ s: LtState; newBest: boolean } | null>(null);
  const [runId, setRunId] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const played = useRef(0);

  // Instant, not smooth: a drag that starts while the page is still scrolling pans it and cancels the throw.
  const scrollTop = () => rootRef.current?.scrollIntoView({ block: "start" });

  function begin(s = seed ?? packSeed(newSeed() >>> 2, opponent)) {
    setSeed(s);
    setMatch(createMatch(s));
    setFinal(null);
    setRunId((n) => n + 1);
    setPhase("playing");
    track(played.current > 0 ? "game_retry" : "game_start", { game: GAME_SLUG });
    played.current++;
    scrollTop();
  }

  function finish(s: LtState) {
    const score = scoreOf(s);
    const prev = bestStore.read();
    if (score > prev) bestStore.write(score);
    setFinal({ s, newBest: score > prev });
    setPhase("over");
    const outcome = endingOf(s);
    if (isWin(outcome)) playSound("win");
    track("game_complete", { game: GAME_SLUG, score, outcome, opponent: s.opponent, rank: rankFor(score), perfectKops: perfectKops(s) });
    window.setTimeout(() => headingRef.current?.focus(), 50);
  }

  function newMatch() {
    setSeed(null);
    setFinal(null);
    setPhase("intro");
    scrollTop();
  }

  const isChallenge = friend !== null && seed === friend.seed;

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {phase === "intro" && (
        <section className="grid gap-4">
          {isChallenge && friend && <ChallengeBanner game={GAME_SLUG} challenge={friend} onAccept={() => begin(friend.seed)} />}
          <div className={`${card} p-5`}>
            <p aria-hidden className="text-center text-5xl">
              🌀⭕
            </p>
            <p className="mt-3 text-center text-lg font-bold">{t(copy.intro, lang)}</p>
            <p className="mt-2 text-center text-sm font-bold text-ink-muted">{t(copy.rules, lang)}</p>
          </div>
          {isChallenge && locked ? (
            <div className={`${card} p-4 text-center`}>
              <p className="text-sm font-bold text-ink-muted">{t(copy.locked, lang)}</p>
              <p className="mt-1 text-xl font-black">
                {opponentInfo[locked].emoji} {t(opponentInfo[locked].name, lang)}
              </p>
            </div>
          ) : (
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.pick, lang)}</legend>
              {OPPONENTS.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={opponent === id}
                  onClick={() => setOpponent(id)}
                  className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 border-ink p-3 text-left shadow-pop transition-transform ${
                    opponent === id ? `${accentBg[(["lime", "tangerine", "chili"] as const)[i]!]} -rotate-1` : "bg-surface"
                  }`}
                >
                  <span aria-hidden className="text-3xl">
                    {opponentInfo[id].emoji}
                  </span>
                  <span>
                    <span className="block font-black">{t(opponentInfo[id].name, lang)}</span>
                    <span className="block text-sm font-bold opacity-80">{t(opponentInfo[id].blurb, lang)}</span>
                  </span>
                </button>
              ))}
            </fieldset>
          )}
          <button type="button" onClick={() => begin(isChallenge ? friend!.seed : undefined)} className={`${btnPrimary} ${accentBg.tangerine} min-h-16 text-2xl`}>
            {t(copy.start, lang)}
          </button>
          <p className="text-center text-sm font-bold text-ink-muted">🏆 {fmt(t(copy.best, lang), { n: num(best, lang) })}</p>
        </section>
      )}

      {phase === "playing" && match && <Arena key={runId} initial={match} onOver={finish} />}

      {phase === "over" && final && (
        <ResultView s={final.s} newBest={final.newBest} challenge={friend} headingRef={headingRef} onRetry={() => begin(final.s.seed)} onNew={newMatch} />
      )}
    </div>
  );
}

function readIntroSeen(): boolean {
  try {
    return window.localStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

function Arena({ initial, onOver }: { initial: LtState; onOver: (s: LtState) => void }) {
  const { lang } = useI18n();
  const sound = useSyncExternalStore(soundStore.subscribe, soundStore.read, () => false);
  const [s, setS] = useState(initial);
  const [rolling, setRolling] = useState<Piece[] | null>(null);
  const [cpuAim, setCpuAim] = useState<Throw | null>(null);
  const [flash, setFlash] = useState(0);
  // Circle-drawing intro: full the first time, quick (with skip) after, none with reduced motion.
  const [introMs] = useState(() => (prefersReducedMotion() ? 0 : readIntroSeen() ? 900 : 2600));
  const [drawing, setDrawing] = useState(introMs > 0);
  const [kopResult, setKopResult] = useState<KopGrade | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<Side, HTMLDivElement>());
  const aimRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const kopBtnRef = useRef<HTMLButtonElement>(null);
  const raf = useRef(0);
  const resume = useRef<(() => void) | null>(null);
  const timers = useRef<number[]>([]);
  // Live state for the visual loop (spin rotation + wobble), read outside React renders.
  const live = useRef<Piece[]>(piecesOf(initial));
  const angles = useRef<Record<Side, number>>({ you: 0, cpu: 0 });
  const wind = useRef<{ start: number; x: number; y: number; id: number | null; dirX: number; dirY: number; power: number } | null>(null);
  const kopStart = useRef(0);
  const name = t(opponentInfo[s.opponent].name, lang);
  const pieces = useMemo(() => rolling ?? piecesOf(s), [rolling, s]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(
    () => () => {
      timers.current.forEach((x) => window.clearTimeout(x));
      cancelAnimationFrame(raf.current);
    },
    [],
  );

  const busy = rolling !== null || drawing || s.stage === "over";
  const youThrow = !busy && s.turn === "you" && (s.stage === "order" || s.stage === "defend" || s.stage === "attack");
  const youKop = !busy && s.stage === "kop" && kopResult === null;

  useEffect(() => {
    try {
      window.localStorage.setItem(INTRO_KEY, "1");
    } catch {
      // the first-time intro just plays again
    }
    if (introMs === 0) return;
    const id = window.setTimeout(() => setDrawing(false), introMs);
    return () => window.clearTimeout(id);
  }, [introMs]);

  // ---- visuals: one rAF loop spins the stripes and adds wobble (purely cosmetic) ----
  useLayoutEffect(() => {
    live.current = pieces;
    for (const p of pieces) place(p);
  }, [pieces]);

  function place(p: Piece) {
    const n = nodes.current.get(p.id);
    if (!n) return;
    const wob = p.fallen || p.spin >= 0.25 ? 0 : (0.25 - p.spin) * 10;
    n.style.transform = `translate3d(${cq(p.x - LR)}, ${cq(p.y - LR)}, 0)`;
    n.style.setProperty("--wob", `${wob}px`);
    const inner = n.firstElementChild as HTMLElement | null;
    if (inner) inner.style.transform = `rotate(${angles.current[p.id]}deg) ${p.fallen ? "scaleY(0.55)" : ""}`;
  }

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let id = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      for (const p of live.current) {
        if (!p.fallen) angles.current[p.id] = (angles.current[p.id] + p.spin * dt * 1.4) % 360;
        const inner = nodes.current.get(p.id)?.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = `rotate(${angles.current[p.id]}deg) ${p.fallen ? "scaleY(0.55)" : ""}`;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  // ---- throwing: animate the same fixed steps the rules use ----

  function launch(from: LtState, th: Throw) {
    hideAim();
    setCpuAim(null);
    const w = throwWorld(from, th);
    // Peek at the outcome (headless copy) so a knockout gets its slow-motion moment.
    const peek = cloneWorld(w);
    const peekEvents = simulate(peek);
    const peekState = resolve(from, peek, peekEvents, th);
    const knockout = peekState.last?.kind === "knockout" && !prefersReducedMotion();
    const toPieces = (world: World): Piece[] =>
      world.bodies.map((b) => ({ id: b.id as Side, x: b.x, y: b.y, spin: b.spin ?? 0, fallen: !!b.fallen }));
    setRolling(toPieces(w));
    playSound("whoosh");
    const events: StepEvents = { contacts: [], holed: [], fallen: [] };
    let acc = 0;
    let last = performance.now();
    let slowUntil = 0;
    const frame = (now: number) => {
      if (document.hidden) {
        raf.current = 0;
        return;
      }
      const dt = Math.min(250, now - last);
      last = now;
      acc += now < slowUntil ? dt / 2 : dt;
      let crash = 0;
      for (let n = 0; acc >= STEP_MS && n < 40; n++) {
        acc -= STEP_MS;
        const e = step(w);
        events.contacts.push(...e.contacts);
        events.fallen.push(...e.fallen);
        for (const c of e.contacts) crash = Math.max(crash, c.impulse);
        if (knockout && e.contacts.length && slowUntil === 0) slowUntil = now + SLOWMO_MS;
        if (isSettled(w) || w.steps >= MAX_STEPS) break;
      }
      if (crash > 0) playSound("crash", crash / 600);
      live.current = toPieces(w);
      for (const p of live.current) place(p);
      if (isSettled(w) || w.steps >= MAX_STEPS) {
        resume.current = null;
        freeze(w);
        done(resolve(from, w, events, th));
        return;
      }
      raf.current = requestAnimationFrame(frame);
    };
    resume.current = () => {
      last = performance.now();
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  }

  useEffect(() => {
    const onVis = () => {
      if (!document.hidden && resume.current && raf.current === 0) resume.current();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  function done(next: LtState) {
    setS(next);
    setRolling(null);
    setFlash((f) => f + 1);
    if (next.last?.kind === "knockout" && next.last.side === "you") navigator.vibrate?.(30);
    if (next.last?.kind === "knockout" && next.last.side === "cpu") playSound("foul");
    if (next.stage === "over") later(() => onOver(next), 1600);
  }

  // The computer's turn.
  useEffect(() => {
    if (busy || s.turn !== "cpu" || s.stage === "kop") return;
    const id = window.setTimeout(() => {
      const th = cpuThrow(s);
      setCpuAim(th);
      later(() => launch(s, th), prefersReducedMotion() ? 150 : 550);
    }, CPU_DELAY_MS);
    return () => window.clearTimeout(id);
    // launch only touches refs/setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, busy]);

  // ---- your throw: hold to wind, drag to aim, release to throw ----

  const sweet = sweetSpot(s);
  const meterNow = () => (wind.current ? pingPong(performance.now() - wind.current.start, WIND_PERIOD_MS) : 0);

  function showAim(dirX: number, dirY: number, power: number) {
    const el = aimRef.current;
    if (!el) return;
    const o = throwOrigin(s);
    el.style.opacity = "1";
    el.style.width = cq(20 + power * 90);
    el.style.transform = `translate3d(${cq(o.x)}, ${cq(o.y)}, 0) matrix(${dirX}, ${dirY}, ${-dirY}, ${dirX}, 0, 0)`;
  }
  function hideAim() {
    if (aimRef.current) aimRef.current.style.opacity = "0";
  }

  // Wind meter runs while winding.
  function startWind(x: number, y: number, id: number | null) {
    const dir = s.stage === "order" ? { dirX: 0, dirY: 1 } : { dirX: 0, dirY: -1 };
    wind.current = { start: performance.now(), x, y, id, ...dir, power: 0.6 };
    playSound("whoosh", 0.2);
    const tick = () => {
      if (!wind.current) return;
      if (meterRef.current) meterRef.current.style.left = `${meterNow() * 100}%`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function release() {
    const w = wind.current;
    if (!w) return;
    const spin = spinFor(meterNow(), sweet);
    wind.current = null;
    if (meterRef.current) meterRef.current.style.left = "0%";
    launch(s, { dirX: w.dirX, dirY: w.dirY, power: Math.max(0.03, w.power), spin });
  }
  function cancelWind() {
    wind.current = null;
    hideAim();
  }

  const maxDrag = () => (stageRef.current?.getBoundingClientRect().width ?? 360) * 0.42;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (youKop) return kop();
    if (!youThrow || wind.current) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    startWind(e.clientX, e.clientY, e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const w = wind.current;
    if (!w || w.id !== e.pointerId) return;
    const a = aimFromDrag(w, { x: e.clientX, y: e.clientY }, { deadZone: 12, maxDrag: maxDrag() });
    if (!a) return hideAim();
    Object.assign(w, { dirX: a.dirX, dirY: a.dirY, power: a.power });
    showAim(a.dirX, a.dirY, a.power);
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const w = wind.current;
    if (!w || w.id !== e.pointerId) return;
    // A tap without a drag is not a throw.
    if (!aimFromDrag(w, { x: e.clientX, y: e.clientY }, { deadZone: 12, maxDrag: maxDrag() })) return cancelWind();
    release();
  }

  useEffect(() => {
    if (!youThrow) return;
    const key = { dirX: 0, dirY: s.stage === "order" ? 1 : -1, power: 0.6 };
    const onDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const w = wind.current;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        Object.assign(key, rotateDir(key.dirX, key.dirY, e.key === "ArrowRight" ? 1 : -1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        key.power = Math.max(0.05, Math.min(1, key.power + (e.key === "ArrowUp" ? 0.05 : -0.05)));
      } else if (e.key === " ") {
        e.preventDefault();
        if (!e.repeat && !w) startWind(0, 0, null);
      } else return;
      if (wind.current && wind.current.id === null) Object.assign(wind.current, key);
      showAim(key.dirX, key.dirY, key.power);
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key !== " " || !wind.current || wind.current.id !== null) return;
      e.preventDefault();
      Object.assign(wind.current, key);
      release();
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
    // showAim/release read this render's state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youThrow, s]);

  // ---- ঘর কোপ: tap when the shrinking ring meets the latim ----

  useEffect(() => {
    if (!youKop) return;
    kopStart.current = performance.now();
    kopBtnRef.current?.focus();
    const ring = ringRef.current;
    const anim = ring?.animate([{ transform: `scale(${KOP_FROM})` }, { transform: `scale(${KOP_TO})` }], { duration: KOP_MS, easing: "linear", fill: "forwards" });
    const id = window.setTimeout(() => grade(null), KOP_MS + 150);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        kop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      anim?.cancel();
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
    // kop/grade read refs and this render's state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youKop]);

  function kop() {
    if (!youKop) return;
    grade(performance.now() - kopStart.current - KOP_MEET_MS);
  }
  function grade(errorMs: number | null) {
    const g = kopGrade(errorMs);
    setKopResult(g);
    if (g !== "miss") {
      playSound("crash", g === "perfect" ? 1 : 0.6);
      const n = nodes.current.get(other(s.turn));
      if (n && !prefersReducedMotion()) n.animate([{ translate: "0 0" }, { translate: "3px 0" }, { translate: "-3px 0" }, { translate: "0 0" }], { duration: 240, iterations: 2 });
    }
    later(() => {
      setKopResult(null);
      done(applyKop(s, g));
    }, 1100);
  }

  // ---- render ----

  const event = eventLine(s.last, name, lang);
  const prompt = (() => {
    if (drawing) return t(copy.drawing, lang);
    if (rolling) return "…";
    if (s.stage === "order") return s.turn === "you" ? t(copy.orderYou, lang) : fmt(t(copy.orderCpu, lang), { name });
    if (s.stage === "defend") return s.turn === "you" ? t(copy.defendYou, lang) : fmt(t(copy.defendCpu, lang), { name });
    if (s.stage === "attack") return s.turn === "you" ? t(copy.attackYou, lang) : fmt(t(copy.attackCpu, lang), { name });
    if (s.stage === "kop") return t(copy.kopTitle, lang);
    return null;
  })();
  const knocked = s.stage === "kop" ? s.latims[other(s.attacker)] : null;
  const origin = throwOrigin(s);
  const role = (side: Side) => (s.stage === "order" || s.stage === "over" ? null : s.attacker === side ? t(copy.attack, lang) : t(copy.defend, lang));

  return (
    <section className="grid gap-3" aria-label={t(copy.title, lang)}>
      {/* Scoreboard */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded-2xl border-2 border-ink bg-ink text-center text-bg shadow-pop">
        {(["you", "cpu"] as const).map((side, i) => (
          <div key={side} className={`p-2 ${i === 1 ? "order-3" : ""}`}>
            <p className="truncate text-[11px] font-extrabold uppercase opacity-70">{side === "you" ? `🫵 ${t(copy.you, lang)}` : `🤖 ${name}`}</p>
            <p className="font-display text-3xl font-black tabular-nums">{num(s.won[side], lang)}</p>
            <p className="min-h-4 text-[10px] font-black">{role(side)}</p>
          </div>
        ))}
        <div className="order-2 border-x border-bg/30 px-3 py-2">
          <p className="text-[11px] font-extrabold uppercase opacity-70">{fmt(t(copy.bout, lang), { n: num(Math.max(1, s.bouts), lang), total: num(MAX_BOUTS, lang) })}</p>
          <p className="text-sm font-black">{fmt(t(copy.firstTo, lang), { n: num(WIN_AT, lang) })}</p>
        </div>
      </div>

      {/* The ground with the scratched circle */}
      <div
        ref={stageRef}
        role="group"
        aria-label={t(copy.stage, lang)}
        aria-describedby="lt-prompt"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={cancelWind}
        className={`@container relative w-full touch-none select-none overflow-hidden rounded-2xl border-[3px] border-ink shadow-pop ${youThrow ? "cursor-crosshair" : ""}`}
        style={{
          aspectRatio: `${W} / ${H}`,
          background:
            "radial-gradient(circle at 20% 30%, rgb(0 0 0 / 0.07) 0 2px, transparent 3px) 0 0 / 23px 19px, radial-gradient(circle at 70% 60%, rgb(255 255 255 / 0.18) 0 1.5px, transparent 2.5px) 0 0 / 31px 27px, linear-gradient(170deg, #d9a66b, #c28a52 60%, #b47d47)",
        }}
      >
        <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full">
          <circle
            cx={CIRCLE.x}
            cy={CIRCLE.y}
            r={CIRCLE.r}
            fill="rgb(0 0 0 / 0.05)"
            stroke="var(--ink)"
            strokeOpacity={0.65}
            strokeWidth={3}
            strokeDasharray={drawing ? `${2 * Math.PI * CIRCLE.r}` : "7 5"}
            className={drawing ? "lt-draw" : ""}
            style={{ ["--len" as string]: `${2 * Math.PI * CIRCLE.r}`, animationDuration: `${introMs}ms` }}
          />
          {/* throwing spot */}
          <circle cx={origin.x} cy={origin.y} r={5} fill="var(--ink)" opacity={s.stage === "order" ? 0 : 0.5} />
        </svg>
        {drawing && (
          <>
            <div aria-hidden className="lt-sweep absolute origin-[0_50%] border-t-2 border-dotted border-ink/60" style={{ left: cq(CIRCLE.x), top: cq(CIRCLE.y), width: cq(CIRCLE.r), animationDuration: `${introMs}ms` }}>
              <span className="absolute -right-2 -top-2.5 size-4 rounded-full border-2 border-ink" style={{ background: STRIPES.you }} />
            </div>
            <button type="button" onClick={() => setDrawing(false)} className="absolute right-3 top-3 min-h-11 rounded-full border-2 border-ink bg-surface px-3 text-sm font-black shadow-pop">
              {t(copy.skip, lang)}
            </button>
          </>
        )}

        {/* latims */}
        {pieces.map((p) => (
          <div
            key={p.id}
            ref={(el) => {
              if (el) nodes.current.set(p.id, el);
              else nodes.current.delete(p.id);
            }}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0"
            style={{ width: cq(2 * LR), height: cq(2 * LR) }}
          >
            <div
              className="size-full rounded-full border-2 border-ink"
              style={{ background: `radial-gradient(circle, var(--ink) 0 14%, transparent 16%), ${STRIPES[p.id]}`, boxShadow: "var(--wob, 0px) 3px 0 rgb(0 0 0 / 0.35)" }}
            />
            <span className="absolute -top-[75%] left-1/2 -translate-x-1/2 text-[11px] leading-none">{p.id === "you" ? "🫵" : "🤖"}</span>
          </div>
        ))}

        {/* aim lines */}
        <div ref={aimRef} aria-hidden className="pointer-events-none absolute left-0 top-0 origin-left border-t-4 border-dotted border-ink opacity-0" style={{ height: 0 }} />
        {cpuAim && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 origin-left border-t-4 border-dotted border-violet-deep"
            style={{
              width: cq(70),
              height: 0,
              transform: `translate3d(${cq(origin.x)}, ${cq(origin.y)}, 0) matrix(${cpuAim.dirX}, ${cpuAim.dirY}, ${-cpuAim.dirY}, ${cpuAim.dirX}, 0, 0)`,
            }}
          />
        )}

        {/* kop ring */}
        {knocked && youKop && (
          <div
            ref={ringRef}
            aria-hidden
            className="pointer-events-none absolute rounded-full border-4 border-chili"
            style={{ left: cq(knocked.x - LR), top: cq(knocked.y - LR), width: cq(2 * LR), height: cq(2 * LR), transform: `scale(${KOP_FROM})` }}
          />
        )}
        {knocked && kopResult && kopResult !== "miss" && (
          <span
            aria-hidden
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-3xl motion-safe:animate-pop-in"
            style={{ left: cq(knocked.x), top: cq(knocked.y) }}
          >
            💥
          </span>
        )}

        {(event || kopResult) && !rolling && (
          <p
            key={flash + (kopResult ?? "")}
            role="status"
            className="pointer-events-none absolute inset-x-3 top-3 rotate-[-1.5deg] rounded-xl border-2 border-ink bg-surface px-3 py-1.5 text-center text-sm font-black shadow-pop motion-safe:animate-pop-in"
          >
            {kopResult ? t(kopInfo[kopResult], lang) : event}
          </p>
        )}
      </div>

      <p id="lt-prompt" aria-live="polite" className="min-h-6 text-center font-extrabold">
        {prompt}
      </p>

      {/* wind meter (spin): release in the green */}
      {youThrow && (
        <div aria-hidden className="relative h-6 overflow-hidden rounded-full border-2 border-ink bg-surface">
          <div className="absolute inset-y-0 bg-lime" style={{ left: `${(sweet - SWEET_WIDTH / 2) * 100}%`, width: `${SWEET_WIDTH * 100}%` }} />
          <div ref={meterRef} className="absolute inset-y-0 w-1.5 -translate-x-1/2 bg-ink" style={{ left: "0%" }} />
          <span className="absolute inset-y-0 left-2 grid place-items-center text-[10px] font-black uppercase">🌀 {t(copy.spin, lang)}</span>
        </div>
      )}

      {youKop && (
        <button ref={kopBtnRef} type="button" onClick={kop} className={`${btnPrimary} ${accentBg.chili} min-h-14 text-xl`}>
          {t(copy.kopBtn, lang)}
        </button>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-ink-muted">{t(copy.how, lang)}</p>
        <button type="button" aria-pressed={sound} onClick={() => soundStore.write(!sound)} className={`${btnGhost} min-h-11 shrink-0 px-3 text-sm`}>
          {sound ? t(copy.soundOn, lang) : t(copy.soundOff, lang)}
        </button>
      </div>
    </section>
  );
}

function ResultView({
  s,
  newBest,
  challenge,
  headingRef,
  onRetry,
  onNew,
}: {
  s: LtState;
  newBest: boolean;
  challenge: FriendChallenge | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onNew: () => void;
}) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();
  const score = scoreOf(s);
  const ending = endingOf(s);
  const info = endingInfo[ending];
  const rankId = rankFor(score);
  const opp = opponentInfo[s.opponent];
  const name = t(opp.name, lang);
  const bestKop = s.kops.includes("perfect") ? t(copy.kopPerfect, lang) : s.kops.includes("good") ? t(copy.kopGood, lang) : "—";

  const data: ResultCardData = {
    game: t(copy.title, lang),
    emoji: "🌀",
    accent: info.accent,
    headlineLabel: t(copy.scoreLabel, lang),
    headline: num(score, lang),
    title: t(info.title, lang),
    rank: t(rankInfo[rankId], lang),
    stats: [
      { label: t(copy.latimsWon, lang), value: `${num(s.won.you, lang)}–${num(s.won.cpu, lang)}` },
      { label: t(copy.bestKop, lang), value: bestKop },
      { label: t(copy.longestSpin, lang), value: fmt(t(copy.seconds, lang), { n: num(Math.round(s.longestSpin * 10) / 10, lang) }) },
      { label: t(copy.opponent, lang), value: `${opp.emoji} ${name}` },
    ],
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed: s.seed, score }) ?? `/games/${GAME_SLUG}`}`;
  const message = fmt(t(copy.shareText, lang), { n: num(score, lang), name });

  return (
    <div className="grid gap-4">
      <ResultCard data={data} host={host} headingId="lt-result" headingRef={headingRef}>
        <ChallengeOutcome game={GAME_SLUG} challenge={challenge} seed={s.seed} score={score} />
        {newBest && <p className="mt-3 text-center text-lg font-black">{t(copy.newBest, lang)}</p>}
      </ResultCard>
      <ShareActions game={GAME_SLUG} seed={s.seed} score={score} text={message} accent={info.accent} rank={rankId} />
      <ResultShareKit primary={false} data={data} url={url} fileName={`${GAME_SLUG}-result`} onShared={(method) => track("game_share", { game: GAME_SLUG, method, rank: rankId })} />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onRetry} className={`${btnPrimary} ${accentBg.lime} px-3 text-base`}>
          {t(copy.retry, lang)}
        </button>
        <button type="button" onClick={onNew} className={`${btnPrimary} bg-surface px-3 text-base`}>
          {t(copy.newMatch, lang)}
        </button>
      </div>
    </div>
  );
}
