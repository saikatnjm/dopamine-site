import type { Metadata } from "next";
import Link from "next/link";
import { WorldMap, type WorldView } from "@/components/world/world-map";
import { quizCopy } from "@/data/dhaka-person";
import { excuseCopy } from "@/data/excuses";
import { GAME_HREF_OVERRIDES, getGame } from "@/data/games";
import { worldCopy as copy, worlds, type WorldNodeRef } from "@/data/world";
import { getExperience } from "@/lib/experience/registry";
import { fmt, num, t, type Lang } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

const title = "Hottogol World — Every Funny Dhaka Game & Simulator on One Map";
const description =
  "Explore Hottogol by world: Bangladesh (CNG, bus, bazar, queues), Life (work, rent, decisions) and Arcade (reaction and traffic games). Free, no sign-up.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/world" },
  openGraph: { type: "website", url: "/world", title, description },
  twitter: { card: "summary_large_image", title, description },
};

function duration(sec: number, lang: Lang): string {
  return sec >= 90 ? fmt(t(copy.minutes, lang), { n: num(Math.round(sec / 60), lang) }) : fmt(t(copy.seconds, lang), { n: num(sec, lang) });
}

/** Resolve a map node from the real registries (null if it no longer exists). */
function resolve(ref: WorldNodeRef, lang: Lang, dailyTitle: string): WorldView["nodes"][number] | null {
  const zone = t(ref.zone, lang);
  if (ref.kind === "experience") {
    const e = getExperience(ref.slug);
    if (!e) return null;
    return { key: `x:${e.slug}`, track: { kind: "sim", slug: e.slug }, href: `/experiences/${e.slug}`, title: t(e.title, lang), emoji: e.emoji, accent: e.accent, zone, kind: t(copy.kindSim, lang), time: duration(e.durationSec, lang) };
  }
  if (ref.kind === "game") {
    const g = getGame(ref.slug);
    if (!g) return null;
    return { key: `g:${g.slug}`, track: { kind: "game", slug: g.slug }, href: GAME_HREF_OVERRIDES[g.slug] ?? `/games/${g.slug}`, title: t(g.title, lang), emoji: g.emoji, accent: g.accent, zone, kind: t(copy.kindGame, lang), time: duration(g.durationSec, lang) };
  }
  switch (ref.id) {
    case "daily":
      return { key: "p:daily", track: { kind: "daily" }, href: "/daily", title: dailyTitle, emoji: "📅", accent: "marigold", zone, kind: t(copy.kindDaily, lang), time: null };
    case "dhaka-person":
      return { key: "p:dhaka-person", track: { kind: "quiz" }, href: "/dhaka-person", title: t(quizCopy.title, lang), emoji: "🏙️", accent: "sky", zone, kind: t(copy.kindQuiz, lang), time: duration(90, lang) };
    case "excuses":
      return { key: "p:excuses", track: { kind: "none" }, href: "/excuses?go=1", title: t(excuseCopy.title, lang), emoji: "😂", accent: "marigold", zone, kind: t(copy.kindTool, lang), time: null };
  }
}

export default async function WorldPage() {
  const { lang, d } = await getI18n();
  const view: WorldView[] = worlds.map((w) => ({
    id: w.id,
    emoji: w.emoji,
    accent: w.accent,
    name: t(w.name, lang),
    tagline: t(w.tagline, lang),
    nodes: w.nodes.map((n) => resolve(n, lang, d.footerDaily)).filter((n): n is NonNullable<typeof n> => n !== null),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hottogol World",
    url: absoluteUrl("/world"),
    inLanguage: ["en", "bn"],
    hasPart: view.flatMap((w) => w.nodes.map((n) => ({ "@type": "WebPage", name: n.title, url: absoluteUrl(n.href.split("?")[0]!) }))),
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">
          ← {d.goHome}
        </Link>
      </nav>
      <header className="mb-6 mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">🗺️ {t(copy.title, lang)}</h1>
        <p className="mt-2 max-w-2xl text-lg text-ink-muted">{t(copy.lead, lang)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.jump, lang)}:</span>
          {view.map((w) => (
            <a key={w.id} href={`#world-${w.id}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-pill border-2 border-ink bg-surface px-3.5 py-1.5 text-sm font-extrabold shadow-pop transition-transform hover:-rotate-2">
              <span aria-hidden>{w.emoji}</span> {w.name}
            </a>
          ))}
        </div>
      </header>
      <WorldMap worlds={view} labels={{ played: t(copy.played, lang), done: t(copy.done, lang), best: t(copy.best, lang), fresh: t(copy.fresh, lang), todayDone: t(copy.todayDone, lang), todayOpen: t(copy.todayOpen, lang), found: t(copy.found, lang) }} />
      <p className="mt-10 text-center text-sm font-bold text-ink-muted">{t(copy.localNote, lang)}</p>
    </main>
  );
}
