import type { Metadata } from "next";
import Link from "next/link";
import { DhakaPersonQuiz, type Shared } from "@/components/dhaka-person/dhaka-person-quiz";
import { quizCopy as copy } from "@/data/dhaka-person";
import { decodeAnswers, isResultId, resultFor } from "@/lib/dhaka-person";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { absoluteUrl } from "@/lib/site";

type Props = { searchParams: Promise<{ a?: string | string[]; r?: string | string[] }> };

const title = "What Kind of Dhaka Person Are You? — Funny Quiz";
const description =
  "10 quick questions about CNG fares, traffic, biryani, rain and salary day. Find out your Dhaka personality and share it with friends. Free, no sign-up.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/dhaka-person" },
  openGraph: { type: "website", url: "/dhaka-person", title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default async function DhakaPersonPage({ searchParams }: Props) {
  const [params, { lang }] = await Promise.all([searchParams, getI18n()]);

  // Shared link: ?a=<answer letters>&r=<result id>. The stored result id wins
  // (so later tuning never changes a shared result); invalid links are ignored.
  const answers = decodeAnswers(params.a);
  const r = Array.isArray(params.r) ? params.r[0] : params.r;
  const friend: Shared | null = answers ? { answers, result: isResultId(r) ? r : resultFor(answers) } : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "What Kind of Dhaka Person Are You?",
    url: absoluteUrl("/dhaka-person"),
    about: "A just-for-fun personality quiz about everyday life in Dhaka",
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">
          {t(copy.home, lang)}
        </Link>
      </nav>
      <header className="mb-6 mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">🏙️ {t(copy.title, lang)}</h1>
        <p className="mt-2 text-lg text-ink-muted">{t(copy.lead, lang)}</p>
      </header>
      <DhakaPersonQuiz friend={friend} />
    </main>
  );
}
