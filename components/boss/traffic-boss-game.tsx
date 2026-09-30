"use client";

import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";
import type { BossGameProps, BossRunResult } from "@/components/boss/types";
import { useI18n } from "@/components/providers/lang-provider";
import { btnPrimary } from "@/components/ui/styles";
import { trafficBossCopy as copy, trafficBossRanks } from "@/data/bosses";
import {
  DURATION_MS,
  LANES,
  LIVES,
  PLAYER,
  STEP_MS,
  bossHp,
  createSim,
  move,
  rankFor,
  score,
  step,
  type Kind,
  type Obstacle,
  type StepResult,
} from "@/lib/bosses/traffic-boss";
import { prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t } from "@/lib/i18n/core";

/** Max obstacles on screen at once. DOM nodes are reused. */
const POOL = 40;
const COUNTDOWN_MS = 1500;
const END_DELAY_MS = 900;
const BANNER_MS = 2200;
const SHIELD_UI_MS = 1300;
/** Dash period of the lane markings, in px. */
const DASH = 36;

const looks: Record<Kind, { emoji: string; tile: string; font: number }> = {
  car: { emoji: "🚗", tile: "rounded-xl border-2 border-ink bg-sky", font: 0.46 },
  bus: { emoji: "🚌", tile: "rounded-xl border-2 border-ink bg-tangerine", font: 0.62 },
  cng: { emoji: "🛺", tile: "rounded-xl border-2 border-ink bg-cng", font: 0.46 },
  rickshaw: { emoji: "🚲", tile: "rounded-xl border-2 border-ink bg-chili", font: 0.44 },
  bike: { emoji: "🏍️", tile: "rounded-xl border-2 border-ink bg-violet", font: 0.34 },
  pedestrian: { emoji: "🚶", tile: "", font: 0.4 },
};

export function TrafficBossGame({ seed, onEnd }: BossGameProps) {
  const { lang } = useI18n();
  const reportEnd = useEffectEvent((result: BossRunResult) => onEnd(result));

  const [count, setCount] = useState<number | null>(0);
  const [lives, setLives] = useState(LIVES);
  const [banner, setBanner] = useState<{ id: number; text: string } | null>(null);
  const [fx, setFx] = useState<{ id: number; text: string; x: number } | null>(null);
  const [line, setLine] = useState<string | null>(null);
  const [rain, setRain] = useState(false);
  const [shield, setShield] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLSpanElement>(null);
  const dashRef = useRef<HTMLSpanElement>(null);
  const poolRef = useRef<(HTMLSpanElement | null)[]>([]);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const hpRef = useRef<HTMLSpanElement>(null);
  const hpBarRef = useRef<HTMLSpanElement>(null);
  const moveRef = useRef<((dir: -1 | 1) => void) | null>(null);
  const swipeRef = useRef<{ x: number; moved: boolean } | null>(null);

  // ----- Game loop -----
  useEffect(() => {
    const stage = stageRef.current;
    const player = playerRef.current;
    const dash = dashRef.current;
    const scoreEl = scoreRef.current;
    const timeEl = timeRef.current;
    const hpEl = hpRef.current;
    const hpBar = hpBarRef.current;
    const pool = poolRef.current;
    if (!stage || !player || !dash || !scoreEl || !timeEl || !hpEl || !hpBar) return;

    const reduce = prefersReducedMotion();
    const sim = createSim(seed);
    const slots = new Map<number, number>();
    const free = Array.from({ length: POOL }, (_, i) => POOL - 1 - i);
    const timers: number[] = [];
    let u = stage.clientWidth / LANES; // px per world unit
    let fxId = 0;
    let bannerId = 0;
    let ended = false;

    const hud = () => {
      const hp = bossHp(sim);
      scoreEl.textContent = num(score(sim), lang);
      timeEl.textContent = fmt(t(copy.seconds, lang), {
        n: num(Math.max(0, Math.ceil((DURATION_MS - sim.t) / 1000)), lang),
      });
      hpEl.textContent = `${num(hp, lang)}%`;
      hpBar.style.width = `${hp}%`;
    };

    const sizeObstacle = (el: HTMLSpanElement, o: Obstacle) => {
      el.style.width = `${o.w * u}px`;
      el.style.height = `${o.h * u}px`;
      el.style.fontSize = `${looks[o.kind].font * u}px`;
    };

    const sizeAll = () => {
      player.style.width = `${0.62 * u}px`;
      player.style.height = `${0.9 * u}px`;
      player.style.fontSize = `${0.46 * u}px`;
      for (const o of sim.obstacles) {
        const slot = slots.get(o.id);
        const el = slot === undefined ? null : pool[slot];
        if (el) sizeObstacle(el, o);
      }
    };

    const render = () => {
      player.style.transform = `translate3d(${(sim.x - 0.31) * u}px,${(PLAYER.y + PLAYER.h / 2 - 0.45) * u}px,0)`;
      player.style.opacity = sim.t < sim.shieldUntil && Math.floor(sim.t / 100) % 2 === 0 ? "0.4" : "1";
      const blinkOn = Math.floor(sim.t / 120) % 2 === 0;
      for (const o of sim.obstacles) {
        const slot = slots.get(o.id);
        const el = slot === undefined ? null : pool[slot];
        if (!el) continue;
        el.style.transform = `translate3d(${(o.x - o.w / 2) * u}px,${o.y * u}px,0)`;
        if (o.kind === "cng") el.style.opacity = o.blinking && !blinkOn ? "0.45" : "1";
      }
      dash.style.transform = `translate3d(0,${((sim.dist * u) % DASH) - DASH}px,0)`;
    };

    const spawn = (o: Obstacle) => {
      const slot = free.pop();
      if (slot === undefined) return;
      const el = pool[slot];
      if (!el) return;
      slots.set(o.id, slot);
      const look = looks[o.kind];
      const tile = document.createElement("span");
      tile.className = `flex h-full w-full items-center justify-center leading-none ${look.tile} ${look.tile ? "shadow-pop" : ""}`;
      const emoji = document.createElement("span");
      emoji.textContent = look.emoji;
      tile.append(emoji);
      el.replaceChildren(tile);
      el.style.opacity = "1";
      sizeObstacle(el, o);
      el.style.display = "block";
    };

    const despawn = (id: number) => {
      const slot = slots.get(id);
      if (slot === undefined) return;
      const el = pool[slot];
      if (el) {
        el.style.display = "none";
        el.replaceChildren();
      }
      slots.delete(id);
      free.push(slot);
    };

    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    const showBanner = (text: string) => {
      const id = ++bannerId;
      setBanner({ id, text });
      setLine(text);
      later(() => setBanner((b) => (b?.id === id ? null : b)), BANNER_MS);
    };

    const handle = (r: StepResult) => {
      r.spawned.forEach(spawn);
      r.removed.forEach(despawn);
      if (r.phase !== null) {
        const name = t(copy.phaseNames[r.phase - 1] ?? "", lang);
        showBanner(fmt(t(copy.phase, lang), { n: num(r.phase, lang), name }));
      }
      if (r.event) {
        showBanner(t(copy.events[r.event], lang));
        if (r.event === "rain") setRain(true);
      }
      if (r.rainEnded) setRain(false);
      if (r.nearMiss) {
        fxId += 1;
        const words = copy.nearWords;
        const word = words.length ? words[sim.nearMisses % words.length] : undefined;
        if (word !== undefined) setFx({ id: fxId, text: t(word, lang), x: sim.x / LANES });
        if (!reduce) player.animate([{ scale: 1 }, { scale: 1.18 }, { scale: 1 }], { duration: 220 });
      }
      if (r.hit) {
        setLives(sim.lives);
        setLine(t(copy.hitLines[r.hit.kind], lang));
        if (sim.lives > 0) {
          setShield(true);
          later(() => setShield(false), SHIELD_UI_MS);
        }
        if (!reduce) {
          stage.animate(
            [{ translate: "0 0" }, { translate: "-8px 2px" }, { translate: "7px -2px" }, { translate: "-4px 0" }, { translate: "0 0" }],
            { duration: 320 },
          );
        }
        try {
          navigator.vibrate?.(80);
        } catch {
          // vibration unsupported
        }
      }
    };

    const finish = () => {
      if (ended) return;
      ended = true;
      const rank = trafficBossRanks[rankFor(sim)];
      const seconds = Math.floor(Math.min(sim.t, DURATION_MS) / 1000);
      const survived = sim.over === "survived";
      reportEnd({
        score: score(sim),
        defeated: survived,
        stats: [
          { label: copy.statTime, value: fmt(t(copy.seconds, lang), { n: num(seconds, lang) }) },
          { label: copy.statNear, value: num(sim.nearMisses, lang) },
          { label: copy.statCombo, value: num(sim.maxCombo, lang) },
          { label: copy.statHits, value: num(sim.hits, lang) },
        ],
        line: survived ? copy.survivedLine : copy.knockedLine,
        rank: { emoji: rank.emoji, title: rank.title },
        analytics: { lives: sim.lives, seconds, near: sim.nearMisses },
      });
    };

    let pre = COUNTDOWN_MS;
    let lastCount: number | null = 0;
    let fresh = true;

    moveRef.current = (dir) => {
      if (pre > 0) return;
      move(sim, dir);
    };

    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const dir = k === "arrowleft" || k === "a" ? -1 : k === "arrowright" || k === "d" ? 1 : 0;
      if (dir === 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      e.preventDefault();
      if (!e.repeat) moveRef.current?.(dir);
    };
    window.addEventListener("keydown", onKey);

    const ro = new ResizeObserver(() => {
      u = stage.clientWidth / LANES;
      sizeAll();
      render();
    });
    ro.observe(stage);

    sizeAll();
    render();
    hud();
    stage.focus({ preventScroll: true });

    let raf = 0;
    let acc = 0;
    let overT = 0;
    let lastHud = 0;
    let last = performance.now();

    const tick = (now: number) => {
      // Clamp dt so a backgrounded tab pauses instead of fast-forwarding.
      const dt = Math.min(50, now - last);
      last = now;

      if (fresh) {
        // A restart (language switch) resets the React-side state from the loop.
        fresh = false;
        setLives(LIVES);
        setBanner(null);
        setFx(null);
        setLine(null);
        setRain(false);
        setShield(false);
      }

      if (pre > 0) {
        pre -= dt;
        const c = pre > 0 ? Math.min(2, Math.floor((COUNTDOWN_MS - pre) / (COUNTDOWN_MS / 3))) : null;
        if (c !== lastCount) {
          lastCount = c;
          setCount(c);
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      if (sim.over) {
        overT += dt;
        render();
        if (overT >= END_DELAY_MS) return finish();
        raf = requestAnimationFrame(tick);
        return;
      }

      // Fixed-step simulation keeps the traffic identical on every device.
      acc += dt;
      let steps = 0;
      while (acc >= STEP_MS && steps < 4) {
        acc -= STEP_MS;
        steps += 1;
        handle(step(sim));
        if (sim.over) break;
      }
      if (steps === 4) acc = 0;
      render();
      if (now - lastHud > 100 || sim.over) {
        lastHud = now;
        hud();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      timers.forEach((id) => window.clearTimeout(id));
      moveRef.current = null;
      for (const el of pool) {
        if (!el) continue;
        el.style.display = "none";
        el.replaceChildren();
      }
    };
  }, [seed, lang]);

  const moveButton = (dir: -1 | 1) => (
    <button
      type="button"
      aria-label={t(dir === -1 ? copy.left : copy.right, lang)}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        moveRef.current?.(dir);
      }}
      onClick={(e) => {
        if (e.detail === 0) moveRef.current?.(dir); // keyboard / assistive tech
      }}
      className={`${btnPrimary} min-h-14 touch-manipulation select-none bg-surface text-2xl`}
    >
      <span aria-hidden>{dir === -1 ? "◀" : "▶"}</span>
    </button>
  );

  return (
    <section aria-label={t(copy.stageLabel, lang)}>
      <div className="grid grid-cols-4 gap-1.5">
        <HudTile label={t(copy.lives, lang)}>
          <span aria-label={num(lives, lang)} className="text-base leading-none">
            {lives > 0 ? "❤️".repeat(lives) : "💔"}
          </span>
        </HudTile>
        <HudTile label={t(copy.bossHp, lang)}>
          <span ref={hpRef} className="tabular-nums" />
        </HudTile>
        <HudTile label={t(copy.score, lang)}>
          <span ref={scoreRef} className="tabular-nums" />
        </HudTile>
        <HudTile label={t(copy.time, lang)}>
          <span ref={timeRef} className="tabular-nums" />
        </HudTile>
      </div>

      <div
        aria-hidden
        className="mx-auto mt-2 h-2 w-full max-w-[calc(58dvh*5/7)] overflow-hidden rounded-full border-2 border-ink bg-surface"
      >
        <span ref={hpBarRef} className="block h-full bg-chili" style={{ width: "100%" }} />
      </div>

      <div
        ref={stageRef}
        role="application"
        aria-label={t(copy.stageLabel, lang)}
        tabIndex={0}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          swipeRef.current = { x: e.clientX, moved: false };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const s = swipeRef.current;
          if (!s) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 22) {
            moveRef.current?.(dx < 0 ? -1 : 1);
            s.x = e.clientX;
            s.moved = true;
          }
        }}
        onPointerUp={(e) => {
          const s = swipeRef.current;
          swipeRef.current = null;
          if (!s || s.moved) return;
          // A plain tap moves toward the tapped side.
          const rect = e.currentTarget.getBoundingClientRect();
          moveRef.current?.(e.clientX < rect.left + rect.width / 2 ? -1 : 1);
        }}
        onPointerCancel={() => {
          swipeRef.current = null;
        }}
        className="relative mx-auto mt-2 aspect-[5/7] w-full max-w-[calc(58dvh*5/7)] cursor-pointer touch-none select-none overflow-hidden rounded-card border-2 border-ink bg-[#3b3548] shadow-pop"
      >
        {/* Lane markings (scrolled via transform) */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 block h-[calc(100%+36px)]" ref={dashRef}>
          {[20, 40, 60, 80].map((left) => (
            <span
              key={left}
              style={{ left: `${left}%` }}
              className="absolute top-0 block h-full w-1 -translate-x-1/2 bg-[repeating-linear-gradient(180deg,#fff3d6_0_18px,transparent_18px_36px)] opacity-60"
            />
          ))}
        </span>
        {rain && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 block bg-sky/25 bg-[repeating-linear-gradient(105deg,transparent_0_14px,rgb(255_255_255/0.25)_14px_16px)]"
          />
        )}
        {/* Traffic pool: nodes are reused and positioned by the loop */}
        {Array.from({ length: POOL }, (_, i) => (
          <span
            key={i}
            aria-hidden
            ref={(el) => {
              poolRef.current[i] = el;
            }}
            style={{ display: "none" }}
            className="pointer-events-none absolute left-0 top-0 will-change-transform"
          />
        ))}
        {/* Player */}
        <span
          ref={playerRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 grid place-items-center rounded-xl border-2 border-ink bg-violet leading-none shadow-pop will-change-transform"
        >
          🛵
        </span>
        {fx && <HonkPop key={fx.id} x={fx.x} text={fx.text} />}
        {shield && (
          <span className="pointer-events-none absolute bottom-3 left-1/2 block -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-sky px-3 py-0.5 text-xs font-extrabold shadow-pop">
            🛡️ {t(copy.shield, lang)}
          </span>
        )}
        {banner && (
          <span className="pointer-events-none absolute inset-x-3 top-3 block rotate-[-1.5deg] rounded-xl border-2 border-ink bg-marigold px-3 py-1.5 text-center text-sm font-extrabold shadow-pop">
            {banner.text}
          </span>
        )}
        {count !== null && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/30">
            <span className="rotate-[-3deg] rounded-2xl border-2 border-ink bg-marigold px-6 py-2 font-display text-5xl font-black shadow-pop-lg">
              {t(copy.countdown[count] ?? "", lang)}
            </span>
          </span>
        )}
      </div>

      <div className="mx-auto mt-3 grid max-w-[calc(58dvh*5/7)] grid-cols-2 gap-3">
        {moveButton(-1)}
        {moveButton(1)}
      </div>

      <p className="mt-3 min-h-8 text-center font-bold" aria-live="polite">
        {line ?? " "}
      </p>
    </section>
  );
}

/** Sticker pop that shows once on mount (skipped with reduced motion). */
function HonkPop({ x, text }: { x: number; text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const anim = el.animate(
      [
        { opacity: 0, scale: 0.6, translate: "-50% 8px" },
        { opacity: 1, scale: 1.1, translate: "-50% -6px", offset: 0.3 },
        { opacity: 0, scale: 1, translate: "-50% -28px" },
      ],
      { duration: 650, easing: "ease-out", fill: "forwards" },
    );
    return () => anim.cancel();
  }, []);
  return (
    <span
      ref={ref}
      aria-hidden
      style={{ left: `${Math.min(0.8, Math.max(0.2, x)) * 100}%` }}
      className="pointer-events-none absolute bottom-[22%] -translate-x-1/2 -rotate-6 whitespace-nowrap rounded-xl border-2 border-ink bg-lime px-3 py-1 font-display text-lg font-black shadow-pop"
    >
      {text}
    </span>
  );
}

function HudTile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-surface px-1 py-1.5 text-center shadow-pop">
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="font-display text-xl font-extrabold leading-tight">{children}</p>
    </div>
  );
}
