import type { Metadata } from "next";
import Link from "next/link";
import { AchievementList } from "@/components/achievements/achievement-list";
import { getI18n } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Your Hottogol achievements, saved on this device only. No accounts, no leaderboards.",
  alternates: { canonical: "/achievements" },
  // Personal, device-specific page.
  robots: { index: false, follow: true },
};

export default async function AchievementsPage() {
  const { d } = await getI18n();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6">
      <nav className="text-sm text-ink-muted">
        <Link href="/games" className="hover:text-ink">
          {d.backGames}
        </Link>
      </nav>
      <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
        {d.achTitle} <span aria-hidden>🏆</span>
      </h1>
      <p className="mb-6 mt-2 text-lg text-ink-muted">{d.achSub}</p>
      <AchievementList />
    </main>
  );
}
