import Link from "next/link";
import { btnPrimary } from "@/components/ui/styles";
import { getI18n } from "@/lib/i18n/server";

/** Homepage teaser (server component, no client JS). */
export async function DhakaPersonCard() {
  const { d } = await getI18n();
  return (
    <article className="-rotate-[0.5deg] overflow-hidden rounded-card border-2 border-ink bg-sky shadow-pop" aria-labelledby="dhaka-person-card-title">
      <div className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p aria-hidden className="text-3xl">
            🚕 🍛 🚦 💸 ☕
          </p>
          <h2 id="dhaka-person-card-title" className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
            {d.personTitle}
          </h2>
          <p className="mt-1 max-w-md font-semibold">{d.personBody}</p>
        </div>
        <Link href="/dhaka-person" className={`${btnPrimary} bg-surface w-full shrink-0 sm:w-auto`}>
          {d.personCta}
        </Link>
      </div>
    </article>
  );
}
