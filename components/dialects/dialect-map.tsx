import { DISTRICT_SHAPES, MAP_ATTRIBUTION, MAP_VIEWBOX } from "@/data/dialects/map";
import { FADED_FILL, REGION_FILL, REGION_LABEL_AT, UNASSIGNED_FILL } from "@/lib/dialects/map-layout";

// Bangladesh drawn from its 64 districts, coloured by dialect region, with
// optional label pills. No directive: renders as a server component (region
// pages, no JS) or inside a client component when `onSelect` is passed.
// Keyboard/screen-reader users get the same choices from the list each page
// renders next to the map; the shapes themselves are presentational.

export type MapRegion = { id: string; districts: readonly string[] };
export type MapLabel = { region: string; text: string; strong?: boolean };

export function DialectMap({
  regions,
  labels = [],
  highlight = null,
  selected = null,
  onSelect,
  title,
  className = "",
}: {
  regions: readonly MapRegion[];
  labels?: readonly MapLabel[];
  /** Regions to keep in colour; all others fade. Null = every region in colour. */
  highlight?: readonly string[] | null;
  /** Region with a thick outline label (current selection). */
  selected?: string | null;
  onSelect?: (regionId: string) => void;
  title: string;
  className?: string;
}) {
  const regionOf = new Map<string, string>();
  for (const r of regions) for (const d of r.districts) regionOf.set(d, r.id);
  const ids = Object.keys(DISTRICT_SHAPES);
  const faded = (district: string) => highlight !== null && !highlight.includes(regionOf.get(district) ?? "");
  const fillFor = (district: string) => {
    const r = regionOf.get(district);
    if (faded(district)) return FADED_FILL;
    return r ? (REGION_FILL[r] ?? UNASSIGNED_FILL) : UNASSIGNED_FILL;
  };

  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`} role="img" aria-label={title} className="h-auto w-full select-none">
        {/* Thick ink coastline: every shape stroked wide underneath the fills. */}
        <g aria-hidden fill="#1a1325" stroke="#1a1325" strokeWidth={10} strokeLinejoin="round">
          {ids.map((id) => (
            <path key={id} d={DISTRICT_SHAPES[id]!.d} />
          ))}
        </g>
        <g aria-hidden stroke="#fffdf7" strokeWidth={1.4} strokeLinejoin="round">
          {ids.map((id) => {
            const region = regionOf.get(id);
            return (
              <path
                key={id}
                d={DISTRICT_SHAPES[id]!.d}
                fill={fillFor(id)}
                onClick={onSelect && region ? () => onSelect(region) : undefined}
                className={onSelect && region ? "cursor-pointer transition-opacity hover:opacity-80" : undefined}
              />
            );
          })}
        </g>
        {labels.map((l) => {
          const at = REGION_LABEL_AT[l.region];
          if (!at) return null;
          const isSel = l.region === selected;
          const pill = (
            <span
              lang="bn"
              className={`inline-block max-w-[340px] truncate rounded-full border-[3px] border-ink px-3 py-0.5 text-[40px] font-extrabold leading-tight shadow-[3px_3px_0_#1a1325] ${
                l.strong || isSel ? "bg-ink text-bg" : "bg-surface text-ink"
              }`}
            >
              {l.text}
            </span>
          );
          return (
            <foreignObject key={l.region} x={at[0] - 180} y={at[1] - 45} width={360} height={90}>
              <div className="flex h-full items-center justify-center">
                {onSelect ? (
                  <button type="button" tabIndex={-1} aria-hidden onClick={() => onSelect(l.region)} className="cursor-pointer">
                    {pill}
                  </button>
                ) : (
                  pill
                )}
              </div>
            </foreignObject>
          );
        })}
      </svg>
      <figcaption className="mt-1 text-right text-[10px] text-ink-muted">
        <a href={MAP_ATTRIBUTION.url} target="_blank" rel="noopener noreferrer" className="underline">
          {MAP_ATTRIBUTION.text}
        </a>
      </figcaption>
    </figure>
  );
}
