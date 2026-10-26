import Link from "@/components/i18n/link";
import { ActivityCard } from "@/components/experience/activity-card";
import { DistrictMap } from "@/components/games/district-map";
import { card } from "@/components/ui/styles";
import { DIVISIONS } from "@/data/divisions";
import type { Activity } from "@/lib/activities";
import { LINK_RE, type Block } from "@/lib/blog";
import type { Lang } from "@/lib/i18n/core";

// Renders an article's blocks (server only). Paragraph text supports
// `[link text](/path)` internal links; nothing else is parsed (no HTML).

/** One colour per division for the map block (sticker-zine accents + one soft extra). */
const DIVISION_FILLS = ["#ffc53d", "#4fc3ff", "#ff8a3d", "#b8f13a", "#9b7bff", "#ff5c93", "#3ddc84", "#ffe7a8"];

export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    if (m.index! > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link key={m.index} href={m[2]!} className="font-bold underline decoration-2 underline-offset-4 hover:text-ink-muted">
        {m[1]}
      </Link>,
    );
    last = m.index! + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

export function PostBody({ blocks, lang, activities, mapTitle }: { blocks: readonly Block[]; lang: Lang; activities: readonly Activity[]; mapTitle: string }) {
  return (
    <div className="grid gap-4 text-lg leading-relaxed">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h2":
            return (
              <h2 key={i} className="mt-6 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                {b.text[lang]}
              </h2>
            );
          case "p":
            return (
              <p key={i}>
                <RichText text={b.text[lang]} />
              </p>
            );
          case "list": {
            const List = b.ordered ? "ol" : "ul";
            return (
              <List key={i} className={`grid gap-1.5 pl-6 ${b.ordered ? "list-decimal marker:font-black" : "list-disc"}`}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <RichText text={it[lang]} />
                  </li>
                ))}
              </List>
            );
          }
          case "table":
            // Tables scroll inside their own box on phones, never the page.
            return (
              <div key={i} className="overflow-x-auto rounded-2xl border-2 border-ink bg-surface shadow-pop">
                <table className="w-full min-w-max border-collapse text-left text-base">
                  <thead className="bg-ink text-bg">
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} scope="col" className="px-4 py-2 font-extrabold">
                          {h[lang]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="border-t border-ink/15 odd:bg-bg/60">
                        {row.map((c, j) => (
                          <td key={j} className="px-4 py-2">
                            {c[lang]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout":
            return (
              <p key={i} className={`${card} p-4 ${b.tone === "tip" ? "bg-lime/40" : "bg-surface-2"}`}>
                <span aria-hidden>{b.tone === "tip" ? "💡 " : "📌 "}</span>
                <RichText text={b.text[lang]} />
              </p>
            );
          case "activity": {
            const a = activities.find((x) => x.key === b.key);
            return a ? (
              <div key={i} className="max-w-sm">
                <ActivityCard activity={a} lang={lang} />
              </div>
            ) : null;
          }
          case "map": {
            const fills: Record<string, string> = {};
            DIVISIONS.forEach((d, n) => d.districts.forEach((id) => (fills[id] = DIVISION_FILLS[n % DIVISION_FILLS.length]!)));
            const only = b.districts && b.districts.length ? new Set(b.districts) : null;
            if (only) for (const id of Object.keys(fills)) if (!only.has(id)) fills[id] = "#fff8e7";
            return (
              <div key={i} className={`${card} p-3`}>
                <DistrictMap visited={new Set()} fills={fills} title={mapTitle} />
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm font-bold">
                  {DIVISIONS.map((d, n) => (
                    <span key={d.id} className="inline-flex items-center gap-1.5">
                      <span aria-hidden className="inline-block size-3 rounded-full border border-ink" style={{ background: DIVISION_FILLS[n % DIVISION_FILLS.length] }} />
                      {typeof d.name === "string" ? d.name : d.name[lang]}
                    </span>
                  ))}
                </p>
              </div>
            );
          }
        }
      })}
    </div>
  );
}
