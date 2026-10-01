import type { Metadata } from "next";
import Link from "next/link";
import { DailyPlay } from "@/components/daily/daily-play";
import { getI18n } from "@/lib/i18n/server";
import { RelatedLinks } from "@/components/related/related-links";

export const metadata: Metadata = {
  title: "Daily Hottogol — One Challenge a Day",
  description: "One identical mini-game challenge for everyone, every day (Bangladesh time). Play, share your score, come back tomorrow. Free, no sign-up.",
  alternates: { canonical: "/daily" },
};

export default async function DailyPage() {
  const { d } = await getI18n();
  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <nav className="text-sm text-ink-muted">
        <Link href="/games" className="hover:text-ink">{d.backGames}</Link>
      </nav>
      <h1 className="mb-6 mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight">
        {d.dailyTitle} <span aria-hidden>📅</span>
      </h1>
      {/* The challenge is computed in the browser from today's Bangladesh date. */}
      <DailyPlay />
      <RelatedLinks pageKey="page:daily" sections={[{ id: "games", max: 4 }]} pool={(a) => a.mechanic === "reflex" && (a.durationSec ?? 99) <= 60} />
    </main>
  );
}
