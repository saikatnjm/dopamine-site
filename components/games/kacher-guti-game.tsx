"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { ChallengeBanner, ChallengeOutcome, ShareActions } from "@/components/games/challenge-ui";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { endingInfo, foulInfo, gutiCopy as copy, opponentInfo, rankInfo } from "@/data/games/kacher-guti";
import { track } from "@/lib/analytics";
import { challengePath, type FriendChallenge } from "@/lib/challenge";
import type { Shot } from "@/lib/flick/ai";
import { aimFromDrag, pingPong, powerToSpeed, rotateDir, type Aim } from "@/lib/flick/aim";
import { freeze, isSettled, step, STEP_MS, type StepEvents, type World } from "@/lib/flick/physics";
import {
  cpuOpening,
  cpuScatterPower,
  cpuShot,
  createMatch,
  endingOf,
  GAME_SLUG,
  H,
  HOLE,
  isWin,
  launchWorld,
  LINE_Y,
  MAX_SPEED,
  MIN_SPEED,
  nameTarget,
  opponentOf,
  OPPONENTS,
  packSeed,
  R,
  rankFor,
  resolve,
  ROUNDS,
  scatterWorld,
  shooterPos,
  tintOf,
  TOTAL_MARBLES,
  W,
  type KgState,
  type LastEvent,
  type OpponentId,
  type Side,
} from "@/lib/games/kacher-guti";
import { createBestStore, prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import { newSeed } from "@/lib/random";
import type { ResultCardData } from "@/lib/result-card";
import { playSound, soundStore } from "@/lib/sound";

const bestStore = createBestStore(`hottogol:${GAME_SLUG}:best`);
/** Same cap as simulate() so the animated roll and the headless replay agree. */
const MAX_STEPS = 120 * 20;
const CPU_DELAY_MS = 750;
const METER_PERIOD_MS = 1600;
const TINTS = ["var(--chili)", "var(--sky)", "var(--lime)", "var(--violet)", "var(--marigold)", "var(--tangerine)"];

type Phase = "intro" | "playing" | "over";
type Piece = { id: string; kind: Side | "pot"; tint: number; x: number; y: number; holed?: boolean };

/** World units → stage-relative CSS (the stage is a size container: 100cqw = W). */
const cq = (v: number) => `${(v / W) * 100}cqw`;

function piecesOf(s: KgState): Piece[] {
  const out: Piece[] = [];
  for (const side of ["you", "cpu"] as const) out.push({ id: side, kind: side, tint: 0, ...shooterPos(s, side) });
  for (const m of s.pot) out.push({ id: m.id, kind: "pot", tint: m.tint, x: m.x, y: m.y });
  return out;
}

function piecesOfWorld(s: KgState, w: World): Piece[] {
  const base = piecesOf(s);
  return [
    ...base.filter((p) => p.kind !== "pot" && !w.bodies.some((b) => b.id === p.id)),
    ...w.bodies.map((b) => ({
      id: b.id,
      kind: b.id === "you" || b.id === "cpu" ? (b.id as Side) : ("pot" as const),
      tint: s.pot.find((m) => m.id === b.id)?.tint ?? tintOf(s.seed, b.id),
      x: b.x,
      y: b.y,
    })),
  ];
}

function eventLine(last: LastEvent | null, name: string, lang: Lang): string | null {
  if (!last) return null;
  if (last.kind === "throw") return last.holed ? t(copy.straightIn, lang) : null;
  if (last.kind === "opening") {
    const who = last.winner === "you" ? t(copy.youFirst, lang) : fmt(t(copy.cpuFirst, lang), { name });
    return last.holed ? `${t(copy.straightIn, lang)} ${who}` : who;
  }
  const holed = (n: number, side: Side) =>
    n > 0 ? " " + fmt(t(side === "you" ? copy.holedYours : copy.holedTheirs, lang), { n: num(n, lang), name }) : "";
  if (last.kind === "scatter") return last.holed > 0 ? holed(last.holed, last.side).trim() : null;
  if (last.kind === "clean") {
    const lucky = last.holed > 0 && last.side === "you" ? " " + fmt(t(copy.lucky, lang), { n: num(last.holed, lang) }) : holed(last.holed, last.side);
    return (last.side === "you" ? t(copy.hit, lang) : fmt(t(copy.cpuHit, lang), { name })) + lucky;
  }
  if (last.kind === "foul") {
    const reason = t(foulInfo[last.reason], lang);
    const pay = last.paid ? " " + (last.side === "you" ? t(copy.paid, lang) : fmt(t(copy.cpuPaid, lang), { name })) : "";
    const lucky = last.holed > 0 && last.side === "you" ? " " + fmt(t(copy.lucky, lang), { n: num(last.holed, lang) }) : holed(last.holed, last.side);
    return (last.side === "you" ? "" : "🤖 ") + fmt(t(copy.foul, lang), { reason }) + pay + lucky;
  }
  return t(copy.evening, lang);
}

export function KacherGutiGame({ challenge }: { challenge: FriendChallenge | null }) {
  const { lang } = useI18n();
  const best = useSyncExternalStore(bestStore.subscribe, bestStore.read, () => 0);
  // A challenge only counts when its seed names a real opponent.
  const locked = challenge ? opponentOf(challenge.seed) : null;
  const friend = locked ? challenge : null;
  const [opponent, setOpponent] = useState<OpponentId>(locked ?? "boro-bhai");
  const [seed, setSeed] = useState<number | null>(friend?.seed ?? null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [match, setMatch] = useState<KgState | null>(null);
  const [final, setFinal] = useState<{ s: KgState; newBest: boolean } | null>(null);
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

  function finish(s: KgState) {
    const score = s.pockets.you;
    const prev = bestStore.read();
    if (score > prev) bestStore.write(score);
    setFinal({ s, newBest: score > prev });
    setPhase("over");
    const outcome = endingOf(s);
    if (isWin(outcome)) playSound("win");
    track("game_complete", { game: GAME_SLUG, score, outcome, opponent: s.opponent, rank: rankFor(score) });
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
              🔮🕳️
            </p>
            <p className="mt-3 text-center text-lg font-bold">{t(copy.intro, lang)}</p>
            <p className="mt-2 text-center text-sm font-bold text-ink-muted">{t(copy.rules, lang)}</p>
            <p className="mt-1 text-center text-sm text-ink-muted">{t(copy.names, lang)}</p>
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
                    opponent === id ? `${accentBg[(["lime", "sky", "chili"] as const)[i]!]} -rotate-1` : "bg-surface"
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
          <button type="button" onClick={() => begin(isChallenge ? friend!.seed : undefined)} className={`${btnPrimary} ${accentBg.sky} min-h-16 text-2xl`}>
            {t(copy.start, lang)}
          </button>
          <p className="text-center text-sm font-bold text-ink-muted">🏆 {fmt(t(copy.best, lang), { n: num(best, lang) })}</p>
        </section>
      )}

      {phase === "playing" && match && <Board key={runId} initial={match} onOver={finish} />}

      {phase === "over" && final && (
        <ResultView s={final.s} newBest={final.newBest} challenge={friend} headingRef={headingRef} onRetry={() => begin(final.s.seed)} onNew={newMatch} />
      )}
    </div>
  );
}

function Board({ initial, onOver }: { initial: KgState; onOver: (s: KgState) => void }) {
  const { lang } = useI18n();
  const sound = useSyncExternalStore(soundStore.subscribe, soundStore.read, () => false);
  const [s, setS] = useState(initial);
  const [rolling, setRolling] = useState<Piece[] | null>(null);
  const [pause, setPause] = useState(false);
  const [cpuAim, setCpuAim] = useState<Shot | null>(null);
  const [flash, setFlash] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const aimRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const raf = useRef(0);
  const resume = useRef<(() => void) | null>(null);
  const timers = useRef<number[]>([]);
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const keyAim = useRef({ dirX: 0, dirY: -1, charging: 0 });
  const meterStart = useRef(0);
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

  const busy = rolling !== null || pause || s.stage === "over";
  const youAim = !busy && s.turn === "you" && (s.stage === "opening" || s.stage === "shoot");
  const youScatter = !busy && s.turn === "you" && s.stage === "scatter";
  const youName = !busy && s.stage === "name";

  // Place every marble (imperative: the rAF loop moves the same nodes while rolling).
  useLayoutEffect(() => {
    for (const p of pieces) {
      const n = nodes.current.get(p.id);
      if (!n) continue;
      n.style.transform = `translate3d(${cq(p.x - R)}, ${cq(p.y - R)}, 0)`;
      n.style.opacity = "";
    }
  }, [pieces]);

  function draw(w: World) {
    for (const b of w.bodies) {
      const n = nodes.current.get(b.id);
      if (!n) continue;
      n.style.transform = `translate3d(${cq(b.x - R)}, ${cq(b.y - R)}, 0)`;
      if (b.holed) n.style.opacity = "0";
    }
  }

  /** Animate a launched world with fixed steps, then resolve the match. */
  function launch(w: World, from: KgState) {
    hideAim();
    setCpuAim(null);
    setRolling(piecesOfWorld(from, w));
    playSound("whoosh");
    const events: StepEvents = { contacts: [], holed: [], fallen: [] };
    let acc = 0;
    let last = performance.now();
    const frame = (now: number) => {
      if (document.hidden) {
        raf.current = 0;
        return; // resumed by the visibility listener
      }
      acc += Math.min(250, now - last);
      last = now;
      let clack = 0;
      for (let n = 0; acc >= STEP_MS && n < 40; n++) {
        acc -= STEP_MS;
        const e = step(w);
        events.contacts.push(...e.contacts);
        events.holed.push(...e.holed);
        for (const c of e.contacts) clack = Math.max(clack, c.impulse);
        if (e.holed.length) playSound("drop");
        if (isSettled(w) || w.steps >= MAX_STEPS) break;
      }
      if (clack > 0) playSound("clack", clack / 500);
      draw(w);
      if (isSettled(w) || w.steps >= MAX_STEPS) {
        resume.current = null;
        freeze(w);
        done(from, resolve(from, w, events));
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

  // Pause while hidden; turn-based, so it resumes cleanly.
  useEffect(() => {
    const onVis = () => {
      if (!document.hidden && resume.current && raf.current === 0) resume.current();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  function done(prev: KgState, next: KgState) {
    setS(next);
    setRolling(null);
    setFlash((f) => f + 1);
    const l = next.last;
    if (l?.kind === "clean" && l.side === "you") navigator.vibrate?.(20);
    if (l?.kind === "foul") playSound("foul");
    if (next.stage === "over") later(() => onOver(next), 1600);
    else if (next.round !== prev.round) {
      setPause(true);
      later(() => nextRef.current?.focus(), 50);
    }
  }

  // The computer's turn: think, show its aim, act.
  useEffect(() => {
    if (busy || s.turn !== "cpu" || s.stage === "name") return;
    const id = window.setTimeout(() => {
      if (s.stage === "scatter") return launch(scatterWorld(s, cpuScatterPower(s)), s);
      const shot = s.stage === "opening" ? cpuOpening(s) : cpuShot(s);
      setCpuAim(shot);
      later(() => launch(launchWorld(s, shot), s), prefersReducedMotion() ? 150 : 550);
    }, CPU_DELAY_MS);
    return () => window.clearTimeout(id);
    // launch only touches refs/setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s, busy]);

  // ---- aiming (pointer: slingshot drag; keys: ←/→ + hold Space) ----

  function showAim(a: Aim | null) {
    const el = aimRef.current;
    if (!el) return;
    if (!a) return void (el.style.opacity = "0");
    const p = shooterPos(s, s.turn);
    const len = 26 + a.power * 70;
    el.style.opacity = "1";
    el.style.width = cq(len);
    el.style.transform = `translate3d(${cq(p.x)}, ${cq(p.y)}, 0) matrix(${a.dirX}, ${a.dirY}, ${-a.dirY}, ${a.dirX}, 0, 0)`;
    el.style.setProperty("--power", String(a.power));
  }
  function hideAim() {
    showAim(null);
  }

  function shoot(a: Aim) {
    const shot = { dirX: a.dirX, dirY: a.dirY, speed: powerToSpeed(a.power, MIN_SPEED, MAX_SPEED) };
    launch(launchWorld(s, shot), s);
  }

  const maxDrag = () => (stageRef.current?.getBoundingClientRect().width ?? 360) * 0.42;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!youAim || drag.current) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    showAim(aimFromDrag(d, { x: e.clientX, y: e.clientY }, { deadZone: 12, maxDrag: maxDrag() }));
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const a = aimFromDrag(d, { x: e.clientX, y: e.clientY }, { deadZone: 12, maxDrag: maxDrag() });
    if (a && youAim) shoot(a);
    else hideAim();
  }
  function onPointerCancel() {
    drag.current = null;
    hideAim();
  }

  useEffect(() => {
    if (!youAim) return;
    keyAim.current = { dirX: 0, dirY: -1, charging: 0 };
    let id = 0;
    const charge = () => {
      const k = keyAim.current;
      showAim({ dirX: k.dirX, dirY: k.dirY, power: pingPong(performance.now() - k.charging, METER_PERIOD_MS) });
      id = requestAnimationFrame(charge);
    };
    const onDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = keyAim.current;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        Object.assign(k, rotateDir(k.dirX, k.dirY, e.key === "ArrowRight" ? 1 : -1));
        if (!k.charging) showAim({ dirX: k.dirX, dirY: k.dirY, power: 0 });
      } else if (e.key === " ") {
        e.preventDefault();
        if (e.repeat || k.charging) return;
        k.charging = performance.now();
        id = requestAnimationFrame(charge);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const k = keyAim.current;
      if (e.key !== " " || !k.charging) return;
      e.preventDefault();
      cancelAnimationFrame(id);
      const power = pingPong(performance.now() - k.charging, METER_PERIOD_MS);
      k.charging = 0;
      shoot({ dirX: k.dirX, dirY: k.dirY, power: Math.max(0.02, power) });
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
    // showAim/shoot read the current state on each render's closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youAim, s]);

  // ---- your scatter: stop the meter ----

  useEffect(() => {
    if (!youScatter) return;
    meterStart.current = performance.now();
    let id = 0;
    const tick = () => {
      const m = meterRef.current;
      if (m) m.style.width = `${pingPong(performance.now() - meterStart.current, METER_PERIOD_MS) * 100}%`;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [youScatter]);

  function scatter() {
    if (!youScatter) return;
    launch(scatterWorld(s, pingPong(performance.now() - meterStart.current, METER_PERIOD_MS)), s);
  }

  // ---- render ----

  const event = eventLine(s.last, name, lang);
  const prompt = (() => {
    if (pause) return null;
    if (rolling) return "…";
    if (s.stage === "opening") return s.turn === "you" ? t(copy.yourThrow, lang) : fmt(t(copy.cpuThrow, lang), { name });
    if (s.stage === "scatter") return s.turn === "you" ? t(copy.scatterYou, lang) : fmt(t(copy.scatterCpu, lang), { name });
    if (s.stage === "name") return fmt(t(copy.nameIt, lang), { name });
    if (s.stage === "shoot") return s.turn === "you" ? fmt(t(copy.yourShot, lang), { name }) : fmt(t(copy.cpuAims, lang), { name });
    return null;
  })();
  const target = s.pot.find((m) => m.id === s.target);
  const cpuFrom = shooterPos(s, "cpu");

  return (
    <section className="grid gap-3" aria-label={t(copy.title, lang)}>
      {/* Scoreboard */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center overflow-hidden rounded-2xl border-2 border-ink bg-ink text-center text-bg shadow-pop">
        <div className="p-2">
          <p className="text-[11px] font-extrabold uppercase opacity-70">🫵 {t(copy.you, lang)}</p>
          <p className="font-display text-3xl font-black tabular-nums">{num(s.pockets.you, lang)}</p>
        </div>
        <div className="border-x border-bg/30 px-3 py-2">
          <p className="text-[11px] font-extrabold uppercase opacity-70">{fmt(t(copy.round, lang), { n: num(s.round, lang), total: num(ROUNDS, lang) })}</p>
          <p className="text-sm font-black">
            {t(copy.pot, lang)}: {num(s.pot.length + (s.stage === "scatter" ? s.staked.you + s.staked.cpu : 0), lang)}
          </p>
        </div>
        <div className="p-2">
          <p className="truncate text-[11px] font-extrabold uppercase opacity-70">🤖 {name}</p>
          <p className="font-display text-3xl font-black tabular-nums">{num(s.pockets.cpu, lang)}</p>
        </div>
      </div>

      {/* The ground */}
      <div
        ref={stageRef}
        role="group"
        aria-label={t(copy.stage, lang)}
        aria-describedby="kg-prompt"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        className={`@container relative w-full touch-none select-none overflow-hidden rounded-2xl border-[3px] border-ink shadow-pop ${youAim ? "cursor-crosshair" : ""}`}
        style={{
          aspectRatio: `${W} / ${H}`,
          background:
            "radial-gradient(circle at 20% 30%, rgb(0 0 0 / 0.07) 0 2px, transparent 3px) 0 0 / 23px 19px, radial-gradient(circle at 70% 60%, rgb(255 255 255 / 0.18) 0 1.5px, transparent 2.5px) 0 0 / 31px 27px, linear-gradient(170deg, #d9a66b, #c28a52 60%, #b47d47)",
        }}
      >
        {/* line (দাগ) */}
        <div aria-hidden className="absolute inset-x-[4%] border-t-[3px] border-dashed border-ink/70" style={{ top: cq(LINE_Y + R + 4) }} />
        <span aria-hidden className="absolute left-[4%] rounded bg-ink/80 px-1.5 text-[10px] font-black text-bg" style={{ top: cq(LINE_Y + R + 8) }}>
          {t(copy.line, lang)}
        </span>
        {/* hole (গর্ত) */}
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{
            left: cq(HOLE.x - HOLE.r),
            top: cq(HOLE.y - HOLE.r),
            width: cq(HOLE.r * 2),
            height: cq(HOLE.r * 2),
            background: "radial-gradient(circle at 50% 40%, #1d140c 55%, #4a3220 100%)",
            boxShadow: "inset 0 3px 4px rgb(0 0 0 / 0.6), 0 1px 0 rgb(255 255 255 / 0.35)",
          }}
        />
        <span aria-hidden className="absolute -translate-x-1/2 text-[10px] font-black text-ink/70" style={{ left: cq(HOLE.x), top: cq(HOLE.y - HOLE.r - 14) }}>
          {t(copy.hole, lang)}
        </span>

        {/* target ring */}
        {target && !rolling && (
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-full border-[3px] border-chili motion-safe:animate-pulse"
            style={{ left: cq(target.x - R - 6), top: cq(target.y - R - 6), width: cq(2 * R + 12), height: cq(2 * R + 12) }}
          />
        )}
        {target && !rolling && s.turn === "you" && (
          <span
            aria-hidden
            className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-surface px-2 text-xs font-black shadow-pop motion-safe:animate-pop-in"
            style={{ left: cq(Math.min(W - 50, Math.max(50, target.x))), top: cq(target.y - R - 30) }}
          >
            {t(copy.hitThat, lang)}
          </span>
        )}

        {/* marbles */}
        {pieces.map((p) => (
          <div
            key={p.id}
            ref={(el) => {
              if (el) nodes.current.set(p.id, el);
              else nodes.current.delete(p.id);
            }}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 rounded-full transition-opacity duration-300"
            style={{
              width: cq(2 * R),
              height: cq(2 * R),
              background:
                p.kind === "pot"
                  ? `radial-gradient(circle at 34% 30%, #fff 0 14%, transparent 26%), radial-gradient(circle at 60% 65%, ${TINTS[p.tint % TINTS.length]} 0 30%, transparent 55%), radial-gradient(circle, rgb(230 240 245 / 0.95), rgb(150 175 190) 100%)`
                  : `radial-gradient(circle at 34% 30%, #fff 0 14%, transparent 26%), radial-gradient(circle, ${p.kind === "you" ? "var(--marigold)" : "var(--violet)"}, ${p.kind === "you" ? "#a0711a" : "#5b3fa0"})`,
              boxShadow: p.kind === "pot" ? "0 1px 1px rgb(0 0 0 / 0.45)" : "0 0 0 2px var(--ink), 0 2px 2px rgb(0 0 0 / 0.4)",
            }}
          >
            {p.kind !== "pot" && (
              <span className="absolute -top-[110%] left-1/2 -translate-x-1/2 text-[11px] leading-none">{p.kind === "you" ? "🫵" : "🤖"}</span>
            )}
          </div>
        ))}

        {/* your aim line (drawn from the marble, never under the thumb) */}
        <div
          ref={aimRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 origin-left border-t-4 border-dotted border-ink opacity-0"
          style={{ height: 0 }}
        />
        {/* the computer's aim, shown briefly */}
        {cpuAim && (
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 origin-left border-t-4 border-dotted border-violet-deep"
            style={{
              width: cq(60),
              height: 0,
              transform: `translate3d(${cq(cpuFrom.x)}, ${cq(cpuFrom.y)}, 0) matrix(${cpuAim.dirX}, ${cpuAim.dirY}, ${-cpuAim.dirY}, ${cpuAim.dirX}, 0, 0)`,
            }}
          />
        )}

        {/* naming the computer's target: one button per pot marble */}
        {youName &&
          s.pot.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setS((x) => nameTarget(x, m.id))}
              aria-label={fmt(t(copy.nameLabel, lang), { n: num(i + 1, lang) })}
              className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-offset-0 focus-visible:outline-4 focus-visible:outline-ink"
              style={{ left: cq(m.x), top: cq(m.y) }}
            >
              <span aria-hidden className="size-7 rounded-full border-[3px] border-dashed border-ink motion-safe:animate-pulse" />
            </button>
          ))}

        {/* event sticker */}
        {event && !rolling && (
          <p
            key={flash}
            role="status"
            className="pointer-events-none absolute inset-x-3 bottom-3 rotate-[-1.5deg] rounded-xl border-2 border-ink bg-surface px-3 py-1.5 text-center text-sm font-black shadow-pop motion-safe:animate-pop-in"
          >
            {event}
          </p>
        )}
      </div>

      <p id="kg-prompt" aria-live="polite" className="min-h-6 text-center font-extrabold">
        {prompt}
      </p>

      {youScatter && (
        <div className="grid gap-2">
          <div className="h-5 overflow-hidden rounded-full border-2 border-ink bg-surface" aria-hidden>
            <div ref={meterRef} className="h-full bg-tangerine" style={{ width: "0%" }} />
          </div>
          <button type="button" autoFocus onClick={scatter} className={`${btnPrimary} ${accentBg.tangerine} min-h-14 text-xl`}>
            {t(copy.scatterBtn, lang)}
          </button>
        </div>
      )}

      {pause && (
        <div className={`${card} p-4 text-center motion-safe:animate-pop-in`}>
          <p className="text-lg font-black">
            🫵 {num(s.pockets.you, lang)} · 🤖 {num(s.pockets.cpu, lang)}
          </p>
          <button ref={nextRef} type="button" onClick={() => setPause(false)} className={`${btnPrimary} ${accentBg.lime} mt-3 w-full`}>
            {t(copy.nextRound, lang)}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-ink-muted">{t(copy.how, lang)}</p>
        <button
          type="button"
          aria-pressed={sound}
          onClick={() => soundStore.write(!sound)}
          className={`${btnGhost} min-h-11 shrink-0 px-3 text-sm`}
        >
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
  s: KgState;
  newBest: boolean;
  challenge: FriendChallenge | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onRetry: () => void;
  onNew: () => void;
}) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();
  const score = s.pockets.you;
  const ending = endingOf(s);
  const info = endingInfo[ending];
  const rankId = rankFor(score);
  const opp = opponentInfo[s.opponent];
  const name = t(opp.name, lang);
  const message = fmt(t(copy.shareText, lang), { n: num(score, lang), name });

  const data: ResultCardData = {
    game: t(copy.title, lang),
    emoji: "🔮",
    accent: info.accent,
    headlineLabel: t(copy.scoreLabel, lang),
    headline: `${num(score, lang)}/${num(TOTAL_MARBLES, lang)}`,
    title: t(info.title, lang),
    rank: t(rankInfo[rankId], lang),
    stats: [
      { label: t(copy.marbles, lang), value: `${num(score, lang)}/${num(TOTAL_MARBLES, lang)}` },
      { label: t(copy.cleanHits, lang), value: num(s.stats.clean.you, lang) },
      { label: t(copy.fouls, lang), value: num(s.stats.fouls.you, lang) },
      { label: t(copy.opponent, lang), value: `${opp.emoji} ${name}` },
    ],
    path: `/games/${GAME_SLUG}`,
  };
  const url = `${origin}${challengePath({ game: GAME_SLUG, seed: s.seed, score }) ?? `/games/${GAME_SLUG}`}`;

  return (
    <div className="grid gap-4">
      <ResultCard data={data} host={host} headingId="kg-result" headingRef={headingRef}>
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
