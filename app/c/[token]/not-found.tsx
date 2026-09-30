import Link from "next/link";
import { btnPrimary } from "@/components/ui/styles";
import { getI18n } from "@/lib/i18n/server";

// Malformed, edited or unknown challenge tokens land here (404), never crash.
export default async function ChallengeNotFound() {
  const { d } = await getI18n();
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 text-center">
      <p aria-hidden className="text-7xl">⚔️❓</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold">{d.chInvalidTitle}</h1>
      <p className="mt-3 text-lg text-ink-muted">{d.chInvalidBody}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/games" className={`${btnPrimary} bg-lime`}>
          🎮 {d.chPlayGames}
        </Link>
        <Link href="/" className={`${btnPrimary} bg-surface`}>
          {d.goHome}
        </Link>
      </div>
    </main>
  );
}
