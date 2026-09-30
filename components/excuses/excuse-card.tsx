import Link from "next/link";
import { btnPrimary, card } from "@/components/ui/styles";
import { getI18n } from "@/lib/i18n/server";

/** Homepage teaser (server component, no client JS). */
export async function ExcuseCard() {
  const { d } = await getI18n();
  return (
    <article className={`${card} rotate-[0.5deg] overflow-hidden`} aria-labelledby="excuse-card-title">
      <div className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 id="excuse-card-title" className="font-display text-3xl font-extrabold sm:text-4xl">
            {d.excuseTitle}
          </h2>
          <p className="mt-1 max-w-md text-ink-muted">{d.excuseBody}</p>
        </div>
        <Link href="/excuses?go=1" className={`${btnPrimary} bg-marigold w-full shrink-0 sm:w-auto`}>
          {d.excuseCta}
        </Link>
      </div>
    </article>
  );
}
