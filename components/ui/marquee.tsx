// Infinite ticker, pure CSS. Content is duplicated once; the copy is hidden
// from assistive tech. Stops under prefers-reduced-motion (global rule).
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 gap-8 pr-8">
      {items.map((item) => (
        <li key={item} className="whitespace-nowrap">{item}</li>
      ))}
    </ul>
  );
  return (
    <div className="-ml-[2%] w-[104%] -rotate-1 overflow-hidden border-y-2 border-ink bg-ink py-3 font-display text-lg font-bold text-lime">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
