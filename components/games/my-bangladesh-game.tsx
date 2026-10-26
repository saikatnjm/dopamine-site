"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { DistrictMap } from "@/components/games/district-map";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultCard } from "@/components/share/result-card";
import { ResultShareKit, useHost, useOrigin } from "@/components/share/result-share-kit";
import { accentBg, btnGhost, btnPrimary, card } from "@/components/ui/styles";
import { DISTRICTS } from "@/data/dialects/districts";
import { DIVISIONS } from "@/data/divisions";
import { badgeCopy, myBdCopy as copy, titleInfo } from "@/data/games/my-bangladesh";
import { track } from "@/lib/analytics";
import { badgesFor, cleanVisited, encodeVisited, GAME_SLUG, mapStats, titleFor, type BadgeId } from "@/lib/games/my-bangladesh";
import { prefersReducedMotion } from "@/lib/games/shared";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import type { ResultCardData } from "@/lib/result-card";
import { copyText, type ShareMethod } from "@/lib/sharing";

// ---------------------------------------------------------------------------
// This device's map: localStorage, with an in-memory copy so blocked storage
// still works for the session. Never written from a friend's link.
// ---------------------------------------------------------------------------
const STORE_KEY = `hottogol:${GAME_SLUG}:v1`;
const listeners = new Set<() => void>();
let memory: string | null = null;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORE_KEY) ?? memory;
  } catch {
    return memory;
  }
}
function parseVisited(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as { visited?: unknown };
    return Array.isArray(data.visited) ? cleanVisited(data.visited) : [];
  } catch {
    return [];
  }
}
function saveVisited(visited: readonly string[]) {
  memory = JSON.stringify({ v: 1, visited, at: Date.now() });
  try {
    window.localStorage.setItem(STORE_KEY, memory);
  } catch {
    // storage blocked: the in-memory copy keeps this session working
  }
  listeners.forEach((l) => l());
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

const districtName = new Map(DISTRICTS.map((d) => [d.id, d.name]));

function badgeLabel(id: BadgeId, lang: Lang): string {
  if (id.startsWith("division-")) {
    const div = DIVISIONS.find((d) => `division-${d.id}` === id);
    return fmt(t(badgeCopy.division, lang), { division: div ? t(div.name, lang) : id });
  }
  return t(badgeCopy[id as Exclude<BadgeId, `division-${string}`>], lang);
}

type View = "friend" | "edit" | "result";

export function MyBangladeshGame({ friend }: { friend: string[] | null }) {
  const { lang } = useI18n();
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  const visited = useMemo(() => parseVisited(raw), [raw]);
  const visitedSet = useMemo(() => new Set(visited), [visited]);
  const [view, setView] = useState<View>(friend ? "friend" : "edit");
  const started = useRef(false);
  const completedCounts = useRef(new Set<number>());

  const stats = mapStats(visited);
  const counter = fmt(t(copy.counter, lang), { n: num(stats.districts, lang), d: num(stats.divisions, lang), p: num(stats.mapPercent, lang) });

  function toggle(id: string) {
    const next = visitedSet.has(id) ? visited.filter((x) => x !== id) : [...visited, id];
    saveVisited(cleanVisited(next));
    if (!started.current) {
      started.current = true;
      track("game_start", { game: GAME_SLUG });
    }
    if (!prefersReducedMotion()) {
      document.querySelector(`[data-district="${id}"]`)?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }],
        { duration: 260, easing: "cubic-bezier(.2,.9,.3,1.4)" },
      );
    }
  }

  function showResult() {
    if (visited.length === 0) return;
    if (!completedCounts.current.has(visited.length)) {
      completedCounts.current.add(visited.length);
      track("game_complete", { game: GAME_SLUG, score: visited.length, result: titleFor(visited.length) });
    }
    setView("result");
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  if (view === "friend" && friend) {
    return <FriendView friend={friend} mine={visited} onMakeMine={() => setView("edit")} />;
  }
  if (view === "result" && visited.length > 0) {
    return <ResultView visited={visited} onEdit={() => setView("edit")} />;
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <p className="text-sm font-bold text-ink-muted">{t(copy.hint, lang)}</p>
      <DistrictMap visited={visitedSet} onToggle={toggle} title={fmt(t(copy.mapAria, lang), { n: num(visited.length, lang) })} />

      {/* Division checklist: the accessible way to pick, and the only easy way for tiny districts. */}
      <div className="grid gap-2">
        {DIVISIONS.map((div) => {
          const n = div.districts.filter((id) => visitedSet.has(id)).length;
          return (
            <details key={div.id} className={`${card} group p-0`}>
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 font-extrabold [&::-webkit-details-marker]:hidden">
                <span>
                  <span aria-hidden className="mr-1 inline-block transition-transform group-open:rotate-90">▸</span> {t(div.name, lang)}
                </span>
                <span className={`rounded-pill border-2 border-ink px-2 py-0.5 text-sm ${n > 0 ? accentBg.marigold : "bg-bg"}`}>
                  {fmt(t(copy.divisionCount, lang), { n: num(n, lang), total: num(div.districts.length, lang) })}
                </span>
              </summary>
              <div className="flex flex-wrap gap-2 border-t-2 border-dashed border-ink/20 p-3">
                {div.districts.map((id) => {
                  const on = visitedSet.has(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(id)}
                      className={`min-h-11 rounded-pill border-2 border-ink px-3 font-bold transition-transform active:translate-y-0.5 ${on ? "bg-marigold shadow-pop" : "bg-surface"}`}
                    >
                      {on ? "✓ " : ""}
                      {t(districtName.get(id) ?? id, lang)}
                    </button>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>

      {visited.length > 0 && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t(copy.clearConfirm, lang))) saveVisited([]);
          }}
          className={btnGhost}
        >
          {t(copy.clear, lang)}
        </button>
      )}

      {/* Live counter + the next step, always in reach on a phone. */}
      <div className="sticky bottom-3 z-20 grid gap-2 rounded-2xl border-2 border-ink bg-surface p-3 shadow-pop">
        <p className="text-center text-sm font-extrabold tabular-nums" role="status" aria-live="polite">
          {counter}
        </p>
        <button type="button" onClick={showResult} disabled={visited.length === 0} className={`${btnPrimary} ${accentBg.marigold} disabled:cursor-not-allowed disabled:opacity-60`}>
          {visited.length === 0 ? t(copy.seeTitleEmpty, lang) : t(copy.seeTitle, lang)}
        </button>
      </div>
      <p className="text-xs font-bold text-ink-muted">{t(copy.note, lang)}</p>
    </div>
  );
}

function ResultView({ visited, onEdit }: { visited: string[]; onEdit: () => void }) {
  const { lang } = useI18n();
  const host = useHost();
  const origin = useOrigin();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [toast, setToast] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    return () => window.clearTimeout(timer.current);
  }, []);

  const stats = mapStats(visited);
  const titleId = titleFor(visited.length);
  const info = titleInfo[titleId];
  const badges = badgesFor(visited);
  const badgeLabels = badges.slice(0, 3).map((b) => badgeLabel(b, lang));
  const count = `${num(stats.districts, lang)}/${num(64, lang)}`;
  const url = `${origin}/games/${GAME_SLUG}?v=${encodeVisited(visited)}`;
  const message = fmt(t(copy.shareText, lang), { n: num(stats.districts, lang), title: t(info.title, lang), emoji: info.emoji });
  const shared = (method: ShareMethod) => track("game_share", { game: GAME_SLUG, method });

  async function ask() {
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
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(false), 2000);
    }
  }

  const data: ResultCardData = {
    game: t(copy.title, lang),
    emoji: "🗺️",
    accent: info.accent,
    headlineLabel: t(copy.resultKicker, lang),
    headline: count,
    title: t(info.title, lang),
    titleEmoji: info.emoji,
    blurb: t(info.blurb, lang),
    stats: [
      { label: t(copy.statDistricts, lang), value: count },
      { label: t(copy.statDivisions, lang), value: `${num(stats.divisions, lang)}/${num(8, lang)}` },
      { label: t(copy.statMap, lang), value: `${num(stats.mapPercent, lang)}%` },
      ...(badgeLabels[0] ? [{ label: t(copy.statBadge, lang), value: badgeLabels[0] }] : []),
    ],
    path: `/games/${GAME_SLUG}`,
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <ResultCard data={data} host={host} headingId="mb-result" headingRef={headingRef}>
        <div className="mx-auto mt-3 w-full max-w-[260px]">
          <DistrictMap visited={new Set(visited)} title={t(copy.title, lang)} />
        </div>
        {badgeLabels.length > 0 && (
          <ul className="mt-3 flex flex-wrap justify-center gap-2" aria-label={t(copy.badges, lang)}>
            {badgeLabels.map((b) => (
              <li key={b} className="rounded-pill border-2 border-ink bg-bg px-3 py-1 text-sm font-extrabold">
                {b}
              </li>
            ))}
          </ul>
        )}
      </ResultCard>

      <button type="button" onClick={ask} className={`${btnPrimary} ${accentBg[info.accent]}`}>
        {t(copy.ask, lang)}
      </button>
      <ResultShareKit
        primary={false}
        download
        data={data}
        url={url}
        fileName="my-bangladesh-map"
        onShared={shared}
        renderImage={async (h) => {
          const { renderDistrictPoster } = await import("@/lib/district-poster");
          return renderDistrictPoster(
            {
              kicker: t(copy.posterKicker, lang),
              count,
              title: t(info.title, lang),
              titleEmoji: info.emoji,
              subtitle: `${num(stats.divisions, lang)}/${num(8, lang)} ${t(copy.statDivisions, lang)} · ${t(copy.statMap, lang)} ${num(stats.mapPercent, lang)}%`,
              badges: badgeLabels,
              visited: new Set(visited),
              cta: t(copy.posterCta, lang),
              path: `/games/${GAME_SLUG}`,
            },
            h,
          );
        }}
      />
      <button type="button" onClick={onEdit} className={`${btnPrimary} bg-surface`}>
        {t(copy.editMap, lang)}
      </button>
      <Link href="/games/guess-district" className="justify-self-center text-sm font-extrabold underline">
        {t(copy.guessLink, lang)}
      </Link>
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && <p className="rounded-pill border-2 border-ink bg-ink px-5 py-2.5 font-bold text-bg shadow-pop">✅ {t(copy.linkCopied, lang)}</p>}
      </div>
    </div>
  );
}

function FriendView({ friend, mine, onMakeMine }: { friend: string[]; mine: string[]; onMakeMine: () => void }) {
  const { lang } = useI18n();
  const theirs = new Set(friend);
  const own = new Set(mine);
  const both = mine.filter((id) => theirs.has(id)).length;
  const info = titleInfo[titleFor(friend.length)];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="-rotate-1 rounded-2xl border-2 border-ink bg-marigold p-4 text-center shadow-pop">
        <p className="text-lg font-extrabold">{friend.length === 1 ? t(copy.friendBannerOne, lang) : fmt(t(copy.friendBanner, lang), { n: num(friend.length, lang) })}</p>
        {friend.length > 0 && <p className="mt-1 font-bold">{fmt(t(copy.friendTitle, lang), { emoji: info.emoji, title: t(info.title, lang) })}</p>}
      </div>
      {mine.length > 0 ? (
        <>
          <DistrictMap visited={own} compare={theirs} title={fmt(t(copy.compare, lang), { me: num(mine.length, lang), them: num(friend.length, lang), both: num(both, lang) })} />
          <p className={`${card} p-3 text-center font-extrabold tabular-nums`}>
            {fmt(t(copy.compare, lang), { me: num(mine.length, lang), them: num(friend.length, lang), both: num(both, lang) })}
            <span className="mt-1 block text-xs font-bold text-ink-muted">{t(copy.compareLegend, lang)}</span>
          </p>
        </>
      ) : (
        <DistrictMap visited={new Set()} compare={theirs} title={fmt(t(copy.friendBanner, lang), { n: num(friend.length, lang) })} />
      )}
      <button type="button" onClick={onMakeMine} className={`${btnPrimary} ${accentBg.marigold} min-h-16 text-2xl`}>
        {t(copy.makeMine, lang)}
      </button>
    </div>
  );
}
