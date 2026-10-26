import { getGame } from "@/data/games";
import { guides, type GuideSlug } from "@/data/guides";
import { PAGE_SEO, type PageSeoId } from "@/data/seo";
import { getCategory } from "@/lib/experience/registry";
import type { Experience } from "@/lib/experience/types";
import { t } from "@/lib/i18n/core";
import { renderOgCard } from "@/lib/og";

// Share cards built from the registries (Phase 49), for routes without a
// hand-written opengraph-image. English only (Satori can't shape Bangla).

/** Cut a description to whole words for the card subtitle. */
function short(text: string, max = 120): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function gameOgImage(slug: string) {
  const g = getGame(slug);
  if (!g) throw new Error(`gameOgImage: unknown game "${slug}"`);
  return renderOgCard({
    eyebrow: `🎮 ${t(g.title, "en")}`,
    emoji: g.emoji,
    title: t(g.tagline, "en"),
    subtitle: short(g.seo.description),
    cta: "Play free",
    accent: g.accent,
  });
}

/** Cards for the site's own hub pages. */
const PAGE_CARD: Partial<Record<PageSeoId, { emoji: string; accent: Experience["accent"]; cta: string }>> = {
  games: { emoji: "🎮", accent: "lime", cta: "Play free" },
  experiences: { emoji: "🎬", accent: "violet", cta: "Pick one" },
  bored: { emoji: "🥱", accent: "marigold", cta: "Cure it" },
  boss: { emoji: "👹", accent: "chili", cta: "Fight now" },
  daily: { emoji: "📅", accent: "marigold", cta: "Play today's" },
  world: { emoji: "🗺️", accent: "sky", cta: "Explore" },
  excuses: { emoji: "😂", accent: "marigold", cta: "Get an excuse" },
  "dhaka-person": { emoji: "🏙️", accent: "sky", cta: "Take the quiz" },
  about: { emoji: "🧠", accent: "cng", cta: "Say hi" },
};

export function pageOgImage(id: PageSeoId) {
  const card = PAGE_CARD[id] ?? { emoji: "🧠", accent: "cng" as const, cta: "Play free" };
  const seo = PAGE_SEO[id];
  const [head, ...rest] = seo.title.split(" — ");
  return renderOgCard({
    eyebrow: `Hottogol`,
    emoji: card.emoji,
    title: rest.length ? rest.join(" — ") : head!,
    subtitle: short(seo.description),
    cta: card.cta,
    accent: card.accent,
  });
}

export function guideOgImage(slug: GuideSlug) {
  const g = guides[slug];
  return renderOgCard({
    eyebrow: "Hottogol guide",
    emoji: g.emoji,
    title: g.seo.title,
    subtitle: short(g.seo.description),
    cta: "See the list",
    accent: "marigold",
  });
}

export function categoryOgImage(slug: string) {
  const c = getCategory(slug);
  return renderOgCard({
    eyebrow: "Hottogol simulators",
    emoji: c?.emoji ?? "🎬",
    title: c ? `${t(c.title, "en")} simulators` : "Funny simulators",
    subtitle: short(c ? t(c.description, "en") : "Free one-minute simulators about everyday chaos."),
    cta: "Play free",
    accent: "violet",
  });
}
