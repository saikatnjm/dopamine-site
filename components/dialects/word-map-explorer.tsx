"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DialectMap, type MapLabel } from "@/components/dialects/dialect-map";
import { useI18n } from "@/components/providers/lang-provider";
import { ResultShareKit, useOrigin } from "@/components/share/result-share-kit";
import { accentBg, btnPrimary, card } from "@/components/ui/styles";
import { mapCopy as copy } from "@/data/games/word-map";
import { track } from "@/lib/analytics";
import type { ConceptLite, PublicForm, RegionLite } from "@/lib/dialects/content";
import { fmt, num, t } from "@/lib/i18n/core";
import type { ResultCardData } from "@/lib/result-card";

// শব্দের মানচিত্র: pick a concept, every region shows its word on the map.
// Data arrives pre-filtered from the server (public forms only). The concept
// lives in ?c= so a shared link opens the same word.

export const MAP_SLUG = "word-map";

export function WordMapExplorer({
  concepts,
  regions,
  forms,
  initialConcept,
}: {
  /** Concepts with at least one public form, best-covered first. */
  concepts: ConceptLite[];
  regions: RegionLite[];
  forms: PublicForm[];
  initialConcept: string;
}) {
  const { lang } = useI18n();
  const origin = useOrigin();
  const [conceptId, setConceptId] = useState(initialConcept);
  const [selected, setSelected] = useState<string | null>(null);
  const concept = concepts.find((c) => c.id === conceptId) ?? concepts[0]!;

  const byRegion = useMemo(() => {
    const m = new Map<string, PublicForm[]>();
    for (const f of forms) if (f.conceptId === concept.id) for (const r of f.regions) m.set(r, [...(m.get(r) ?? []), f]);
    return m;
  }, [forms, concept.id]);

  const names = new Set([...byRegion.values()].flat().map((f) => f.form)).size;
  const countLine = fmt(t(copy.count, lang), { names: num(names, lang), regions: num(byRegion.size, lang) });
  const active = selected && byRegion.has(selected) ? selected : (regions.find((r) => byRegion.has(r.id))?.id ?? null);
  const labels: MapLabel[] = regions.flatMap((r) => {
    const fs = byRegion.get(r.id);
    if (!fs?.length) return [];
    return [{ region: r.id, text: fs.length > 1 ? `${fs[0]!.form} +${num(fs.length - 1, lang)}` : fs[0]!.form }];
  });

  function pickConcept(id: string) {
    setConceptId(id);
    setSelected(null);
    try {
      window.history.replaceState(null, "", `?c=${id}`);
    } catch {
      // history blocked: the page still works, the link just won't carry the word
    }
    track("game_start", { game: MAP_SLUG, mode: id });
  }

  const regionName = (id: string) => {
    const r = regions.find((x) => x.id === id);
    return r ? t(r.name, lang) : id;
  };
  const shareUrl = `${origin}/games/${MAP_SLUG}?c=${concept.id}`;
  const card9x16: ResultCardData = {
    game: t(copy.title, lang),
    emoji: "🗺️",
    accent: "sky",
    headline: `${concept.emoji} ${concept.standard}`,
    blurb: countLine,
    stats: [...byRegion.entries()].slice(0, 4).map(([r, fs]) => ({ label: regionName(r), value: fs.map((f) => f.form).join(" / ") })),
    path: `/games/${MAP_SLUG}?c=${concept.id}`,
  };

  return (
    // minmax(0,1fr): grid items default to min-width:auto, which would let the
    // chip strip widen the whole page instead of scrolling inside itself.
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      {/* Concept picker: one horizontal strip, scrolls inside itself on phones. */}
      <section aria-label={t(copy.pick, lang)} className="min-w-0">
        <p className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">{t(copy.pick, lang)}</p>
        <div className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:thin]">
          {concepts.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === concept.id}
              onClick={() => pickConcept(c.id)}
              className={`shrink-0 rounded-pill border-2 border-ink px-3 py-2 text-sm font-extrabold shadow-pop transition-transform active:translate-y-0.5 active:shadow-none ${
                c.id === concept.id ? `${accentBg.marigold} -rotate-2` : "bg-surface"
              }`}
            >
              <span aria-hidden>{c.emoji}</span> <span lang="bn">{c.standard}</span>
            </button>
          ))}
        </div>
      </section>

      <header className="text-center">
        <p aria-hidden className="text-6xl">
          {concept.emoji}
        </p>
        <h2 className="mt-1 font-display text-4xl font-black" lang="bn">
          {concept.standard}
        </h2>
        {lang === "en" && <p className="font-bold text-ink-muted">{concept.en}</p>}
        <p className="mt-1 inline-block -rotate-1 rounded-pill border-2 border-ink bg-lime px-3 py-0.5 text-sm font-extrabold">{countLine}</p>
      </header>

      <DialectMap
        regions={regions}
        labels={labels}
        selected={active}
        onSelect={(id) => setSelected(id)}
        title={fmt(t(copy.mapAria, lang), { word: concept.standard })}
      />

      {active && byRegion.get(active) && (
        <RegionDetail region={regions.find((r) => r.id === active)!} forms={byRegion.get(active)!} />
      )}

      <ResultShareKit
        data={card9x16}
        url={shareUrl}
        fileName={`word-map-${concept.id}`}
        primary={false}
        download
        alsoLike={false}
        playAnother={false}
        onShared={(method) => track("game_share", { game: MAP_SLUG, method, rank: concept.id })}
        renderImage={async (host) => {
          const { renderMapPoster } = await import("@/lib/map-poster");
          return renderMapPoster(
            {
              kicker: t(copy.posterKicker, lang),
              title: fmt(t(copy.posterTitle, lang), { word: concept.standard }),
              subtitle: fmt(t(copy.posterSubtitle, lang), { names: num(names, lang), regions: num(byRegion.size, lang) }),
              regions,
              labels: labels.map((l) => ({ ...l, text: byRegion.get(l.region)![0]!.form })),
              cta: t(copy.posterCta, lang),
              path: `/games/${MAP_SLUG}`,
            },
            host,
          );
        }}
      />

      {/* Every region as a list: the accessible way to browse, and shows the gaps. */}
      <section aria-labelledby="wm-regions" className={`${card} p-4`}>
        <h2 id="wm-regions" className="font-display text-xl font-extrabold">
          {t(copy.regionsHeading, lang)}
        </h2>
        <ul className="mt-3 grid gap-2">
          {regions.map((r) => {
            const fs = byRegion.get(r.id);
            return (
              <li key={r.id}>
                <button
                  type="button"
                  disabled={!fs}
                  onClick={() => setSelected(r.id)}
                  aria-pressed={r.id === active}
                  className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border-2 px-3 py-2 text-left ${
                    r.id === active ? "border-ink bg-marigold" : fs ? "border-ink/30 bg-bg hover:border-ink" : "border-dashed border-ink/20 text-ink-muted"
                  }`}
                >
                  <span className="font-bold">
                    <span aria-hidden>{r.emoji}</span> {t(r.name, lang)}
                  </span>
                  <span lang="bn" className={`text-right font-extrabold ${fs ? "" : "text-sm font-semibold"}`}>
                    {fs ? fs.map((f) => f.form).join(" / ") : t(copy.unknown, lang)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <Link href="/games/which-region" className={`${btnPrimary} ${accentBg.violet}`}>
        {t(copy.detectiveCta, lang)}
      </Link>
      <p className="text-xs font-bold text-ink-muted">{t(copy.note, lang)}</p>
    </div>
  );
}

function RegionDetail({ region, forms }: { region: RegionLite; forms: PublicForm[] }) {
  const { lang } = useI18n();
  return (
    <section aria-live="polite" className={`${card} motion-safe:animate-pop-in -rotate-[0.5deg] p-4`}>
      <h3 className="font-display text-2xl font-extrabold">
        <span aria-hidden>{region.emoji}</span> {t(region.name, lang)}
      </h3>
      <ul className="mt-2 grid gap-3">
        {forms.map((f) => (
          <li key={f.id} className="border-t-2 border-dashed border-ink/20 pt-2 first:border-0 first:pt-0">
            <p className="font-display text-3xl font-black" lang="bn">
              {f.form}
            </p>
            {f.variants.length > 0 && (
              <p className="text-sm font-bold">
                {t(copy.variants, lang)}: <span lang="bn">{f.variants.join(", ")}</span>
              </p>
            )}
            {f.area && (
              <p className="text-sm font-bold">
                {t(copy.area, lang)}: {f.area}
              </p>
            )}
            {f.example && (
              <p className="mt-1 text-sm font-bold">
                {t(copy.example, lang)}: <span lang="bn">“{f.example}”</span>
              </p>
            )}
            <p className="mt-1 text-xs font-semibold text-ink-muted">
              {t(copy.source, lang)}:{" "}
              {f.sources.map((s, i) => (
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
            <p className="text-xs font-bold text-ink-muted">{t(f.verified ? copy.verified : copy.sourced, lang)}</p>
          </li>
        ))}
      </ul>
      <Link href={`/games/word-map/${region.id}`} className="mt-3 inline-block text-sm font-extrabold underline">
        {fmt(t(copy.regionPage, lang), { region: t(region.name, lang) })}
      </Link>
    </section>
  );
}
