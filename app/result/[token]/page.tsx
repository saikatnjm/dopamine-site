import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResultActions } from "@/components/result/result-actions";
import { ResultCard } from "@/components/share/result-card";
import { simulatorCard } from "@/lib/experience/result-card-data";
import { decodeResultToken } from "@/lib/experience/result-token";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ me?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const result = decodeResultToken(token);
  if (!result) return { title: "Result not found", robots: { index: false } };
  const { experience, outcome } = result;
  const title = `${outcome.emoji} ${t(outcome.title, "en")} — ${t(experience.title, "en")}`;
  const description = t(outcome.message, "en");
  // Results are infinite and personal: keep them out of search, but make
  // link previews rich (OG image comes from ./opengraph-image.tsx).
  return {
    title,
    description: t(outcome.shareText, "en"),
    robots: { index: false, follow: true },
    openGraph: { type: "website", url: `/result/${token}`, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ResultPage({ params, searchParams }: Props) {
  const [{ token }, { me }, { lang, d }] = await Promise.all([params, searchParams, getI18n()]);
  const result = decodeResultToken(token);
  if (!result) notFound();
  const { experience, outcome } = result;
  const mine = me === "1";
  const card = simulatorCard(result, lang);

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-16 pt-6">
      <p className="mb-3 text-center text-sm font-semibold text-ink-muted">{mine ? d.resultMine : d.resultFriend}</p>
      <ResultCard data={card} host={new URL(siteConfig.url).host} />
      <ResultActions
        slug={experience.slug}
        token={token}
        emoji={experience.emoji}
        accent={experience.accent}
        outcomeId={outcome.id}
        shareUrl={absoluteUrl(`/result/${token}`)}
        shareText={t(outcome.shareText, lang)}
        mine={mine}
        card={card}
      />
    </main>
  );
}
