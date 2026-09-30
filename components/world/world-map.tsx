"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useI18n } from "@/components/providers/lang-provider";
import { accentBg, type Accent } from "@/components/ui/styles";
import { parseStore, readRaw as readAchievements, subscribe as subscribeAchievements } from "@/lib/achievements";
import { bdDateKey, parseDailyRecord, readDailyRaw, subscribeDaily } from "@/lib/daily";
import { prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num } from "@/lib/i18n/core";

// Hottogol World map (client): renders the worlds the server resolved and
// overlays this device's own progress — finished games/simulators (from the
// achievements store), best scores, quiz personalities found and today's
// daily challenge. Nothing is locked: the site has no gating, so every stop
// is always open. No global numbers are shown, ever.

export type NodeTrack = { kind: "game"; slug: string } | { kind: "sim"; slug: string } | { kind: "quiz" } | { kind: "daily" } | { kind: "none" };

export type WorldView = {
  id: string;
  emoji: string;
  accent: Accent;
  name: string;
  tagline: string;
  nodes: { key: string; track: NodeTrack; href: string; title: string; emoji: string; accent: Accent; zone: string; kind: string; time: string | null }[];
};

type Labels = Record<"played" | "done" | "best" | "fresh" | "todayDone" | "todayOpen" | "found", string>;

const QUIZ_KEY = "hottogol:dhaka-person:v1";
const QUIZ_TOTAL = 10;

type Progress = {
  games: Set<string>;
  sims: Set<string>;
  best: Map<string, number>;
  quizFound: number;
  dailyDone: boolean;
};

function read(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function subscribeAll(cb: () => void) {
  const offA = subscribeAchievements(cb);
  const offD = subscribeDaily(cb);
  window.addEventListener("storage", cb);
  return () => {
    offA();
    offD();
    window.removeEventListener("storage", cb);
  };
}

function parse(snapshot: string, gameSlugs: readonly string[]): Progress {
  const empty: Progress = { games: new Set(), sims: new Set(), best: new Map(), quizFound: 0, dailyDone: false };
  if (!snapshot) return empty;
  let parts: string[];
  try {
    parts = JSON.parse(snapshot) as string[];
  } catch {
    return empty;
  }
  const [ach = "", quiz = "", daily = "", ...bests] = parts;
  const store = parseStore(ach || null);
  const best = new Map<string, number>();
  gameSlugs.forEach((slug, i) => {
    const n = Number(bests[i]);
    if (Number.isFinite(n) && n > 0) best.set(slug, Math.floor(n));
  });
  let quizFound = 0;
  try {
    const q = JSON.parse(quiz || "{}") as { found?: unknown };
    quizFound = Array.isArray(q.found) ? q.found.length : 0;
  } catch {
    quizFound = 0;
  }
  return {
    games: new Set(store.stats.games),
    sims: new Set(store.stats.sims),
    best,
    quizFound,
    dailyDone: parseDailyRecord(daily || null) !== null,
  };
}

export function WorldMap({ worlds, labels }: { worlds: WorldView[]; labels: Labels }) {
  const gameSlugs = worlds.flatMap((w) => w.nodes.flatMap((n) => (n.track.kind === "game" ? [n.track.slug] : [])));
  const key = gameSlugs.join(",");
  // One stable string snapshot of everything we read (useSyncExternalStore needs equality).
  const snapshot = useSyncExternalStore(
    subscribeAll,
    () => JSON.stringify([readAchievements() ?? "", read(QUIZ_KEY), readDailyRaw(bdDateKey(Date.now())) ?? "", ...key.split(",").map((s) => read(`hottogol:${s}:best`))]),
    () => "",
  );
  const progress = parse(snapshot, gameSlugs);

  return (
    <div className="grid gap-12">
      {worlds.map((w) => (
        <WorldSection key={w.id} world={w} progress={progress} labels={labels} ready={snapshot !== ""} />
      ))}
    </div>
  );
}

function stateOf(track: NodeTrack, p: Progress, labels: Labels, lang: "en" | "bn"): { text: string; done: boolean } | null {
  switch (track.kind) {
    case "game": {
      const best = p.best.get(track.slug);
      if (best) return { text: fmt(labels.best, { n: num(best, lang) }), done: true };
      return p.games.has(track.slug) ? { text: labels.done, done: true } : null;
    }
    case "sim":
      return p.sims.has(track.slug) ? { text: labels.done, done: true } : null;
    case "quiz":
      return p.quizFound > 0 ? { text: fmt(labels.found, { n: num(p.quizFound, lang), total: num(QUIZ_TOTAL, lang) }), done: true } : null;
    case "daily":
      return p.dailyDone ? { text: labels.todayDone, done: true } : { text: labels.todayOpen, done: false };
    case "none":
      return null;
  }
}

function WorldSection({ world: w, progress, labels, ready }: { world: WorldView; progress: Progress; labels: Labels; ready: boolean }) {
  const { lang } = useI18n();
  const listRef = useRef<HTMLOListElement>(null);

  // Stops pop in once when the world scrolls into view (skipped for reduced motion).
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(list.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        items.forEach((el, i) =>
          el.animate(
            [
              { opacity: 0, transform: "translateY(14px) scale(0.92)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 320, delay: i * 55, easing: "cubic-bezier(.2,.9,.3,1.3)", fill: "backwards" },
          ),
        );
      },
      { threshold: 0.15 },
    );
    io.observe(list);
    return () => io.disconnect();
  }, []);

  const trackable = w.nodes.filter((n) => n.track.kind !== "none" && n.track.kind !== "daily");
  const played = trackable.filter((n) => stateOf(n.track, progress, labels, lang)?.done).length;
  const pct = trackable.length ? Math.round((played / trackable.length) * 100) : 0;

  return (
    <section id={`world-${w.id}`} aria-labelledby={`world-${w.id}-title`} className="scroll-mt-6">
      <div className={`${accentBg[w.accent]} relative overflow-hidden rounded-card border-2 border-ink p-5 shadow-pop sm:p-6`}>
        <span aria-hidden className="pointer-events-none absolute -right-3 -top-4 select-none text-8xl opacity-90 motion-safe:animate-float sm:text-9xl">
          {w.emoji}
        </span>
        <h2 id={`world-${w.id}-title`} className="relative max-w-[75%] font-display text-3xl font-extrabold leading-tight sm:text-4xl">
          {w.name}
        </h2>
        <p className="relative mt-1 max-w-[75%] font-semibold">{w.tagline}</p>
        <div className="relative mt-4 max-w-sm">
          <p className="text-xs font-extrabold uppercase tracking-wider">
            {ready ? fmt(labels.played, { n: num(played, lang), total: num(trackable.length, lang) }) : " "}
          </p>
          <div
            role="meter"
            aria-label={fmt(labels.played, { n: num(played, lang), total: num(trackable.length, lang) })}
            aria-valuemin={0}
            aria-valuemax={trackable.length}
            aria-valuenow={played}
            className="mt-1 h-3.5 overflow-hidden rounded-pill border-2 border-ink bg-surface"
          >
            <span className="block h-full bg-ink transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* The path: a dashed road the stops sit on (zig-zag on phones, a grid on desktop). */}
      <div className="relative mt-5">
        <span aria-hidden className="absolute inset-y-4 left-1/2 w-1 -translate-x-1/2 bg-[repeating-linear-gradient(180deg,var(--ink)_0_10px,transparent_10px_20px)] opacity-20 sm:hidden" />
        <ol ref={listRef} className="relative grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          {w.nodes.map((n, i) => {
            const state = stateOf(n.track, progress, labels, lang);
            return (
              <li key={n.key} className={i % 2 === 1 ? "translate-y-6 sm:translate-y-0" : ""}>
                <Link
                  href={n.href}
                  className={`group flex h-full flex-col items-center gap-2 rounded-card border-2 border-ink bg-surface p-3 text-center shadow-pop transition-all duration-150 hover:-translate-y-1 hover:shadow-pop-lg active:translate-y-0.5 active:shadow-none ${
                    i % 3 === 0 ? "-rotate-1" : i % 3 === 1 ? "rotate-1" : ""
                  }`}
                >
                  <span className="rounded-pill border-2 border-ink bg-surface-2 px-2 py-0.5 text-[11px] font-extrabold leading-tight">{n.zone}</span>
                  <span
                    aria-hidden
                    className={`${accentBg[n.accent]} relative grid size-16 place-items-center rounded-full border-2 border-ink text-4xl shadow-pop transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110 sm:size-20 sm:text-5xl`}
                  >
                    {n.emoji}
                    {state?.done && (
                      <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border-2 border-ink bg-lime text-sm">✓</span>
                    )}
                  </span>
                  <span className="font-display text-base font-extrabold leading-tight sm:text-lg">{n.title}</span>
                  <span className="text-xs font-bold text-ink-muted">
                    {n.kind}
                    {n.time && ` · ${n.time}`}
                  </span>
                  {state && (
                    <span className={`mt-auto rounded-pill border-2 border-ink px-2 py-0.5 text-[11px] font-extrabold ${state.done ? "bg-lime" : "bg-marigold"}`}>
                      {state.text}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
