import { DISTRICT_SHAPES, MAP_ATTRIBUTION, MAP_VIEWBOX } from "@/data/dialects/map";

// All 64 districts, coloured by visited state (আমার বাংলাদেশ). Same paths and
// ink-coastline underlay as components/dialects/dialect-map.tsx, which colours
// by dialect region instead. The shapes are presentational (aria-hidden):
// small districts (Dhaka, Narayanganj…) are too small to tap on a phone, so
// pages pair this with an accessible checklist. Paths carry data-district so
// the page can animate a toggle.

export const VISITED_FILL = "#ffc53d"; // marigold
export const THEIRS_FILL = "#4fc3ff"; // sky — only the friend
export const BOTH_FILL = "#b8f13a"; // lime — both of you
export const EMPTY_FILL = "#fffaf0";

export function fillFor(id: string, visited: ReadonlySet<string>, compare?: ReadonlySet<string>): string {
  const mine = visited.has(id);
  const theirs = compare?.has(id) ?? false;
  if (mine && theirs) return BOTH_FILL;
  if (mine) return VISITED_FILL;
  if (theirs) return THEIRS_FILL;
  return EMPTY_FILL;
}

export function DistrictMap({
  visited,
  compare,
  onToggle,
  title,
  className = "",
  fills,
  anonymous = false,
}: {
  visited: ReadonlySet<string>;
  /** A second set (a friend's map): districts in both get a third colour. */
  compare?: ReadonlySet<string>;
  onToggle?: (districtId: string) => void;
  title: string;
  className?: string;
  /** Per-district colour overrides (e.g. a quiz reveal: answer lime, wrong pick chili). */
  fills?: Readonly<Record<string, string>>;
  /** Omit district ids from the DOM (quiz questions must not leak the answer). */
  anonymous?: boolean;
}) {
  const ids = Object.keys(DISTRICT_SHAPES);
  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`} role="img" aria-label={title} className="h-auto w-full touch-manipulation select-none">
        <g aria-hidden fill="#1a1325" stroke="#1a1325" strokeWidth={10} strokeLinejoin="round">
          {ids.map((id) => (
            <path key={id} d={DISTRICT_SHAPES[id]!.d} />
          ))}
        </g>
        <g aria-hidden stroke="#1a1325" strokeWidth={1.6} strokeLinejoin="round">
          {ids.map((id) => (
            <path
              key={id}
              data-district={anonymous ? undefined : id}
              d={DISTRICT_SHAPES[id]!.d}
              fill={fills?.[id] ?? fillFor(id, visited, compare)}
              onClick={onToggle ? () => onToggle(id) : undefined}
              className={onToggle ? "cursor-pointer transition-[fill] duration-150 [transform-box:fill-box] [transform-origin:center] hover:brightness-95" : undefined}
            />
          ))}
        </g>
      </svg>
      <figcaption className="mt-1 text-right text-[10px] text-ink-muted">
        <a href={MAP_ATTRIBUTION.url} target="_blank" rel="noopener noreferrer" className="underline">
          {MAP_ATTRIBUTION.text}
        </a>
      </figcaption>
    </figure>
  );
}
