import { DhakaPersonQuiz, type Shared } from "@/components/dhaka-person/dhaka-person-quiz";
import { quizCopy as copy } from "@/data/dhaka-person";
import { decodeAnswers, isResultId, resultFor } from "@/lib/dhaka-person";
import { t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";
import { RelatedLinks } from "@/components/related/related-links";
import { staticPageMetadata } from "@/lib/seo-pages";
import { pageSeo } from "@/lib/seo-text";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { activityLd } from "@/lib/seo";
import { HowToPlay } from "@/components/seo/how-to";

type Props = { searchParams: Promise<{ a?: string | string[]; r?: string | string[] }> };

export const generateMetadata = () => staticPageMetadata("dhaka-person", "/dhaka-person");

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
    description: pageSeo("dhaka-person", lang).description,
    about: "A just-for-fun personality quiz about everyday life in Dhaka",
    isAccessibleForFree: true,
    inLanguage: ["en", "bn"],
  };

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-6">
      <JsonLd ld={activityLd("/dhaka-person", jsonLd, lang)} />
      <Breadcrumbs items={[{ name: t(copy.title, lang) }]} />
      <header className="mb-6 mt-4">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight">🏙️ {t(copy.title, lang)}</h1>
        <p className="mt-2 text-lg text-ink-muted">{t(copy.lead, lang)}</p>
      </header>
      <DhakaPersonQuiz friend={friend} />
      <HowToPlay activity="p:dhaka-person" name={t(copy.title, lang)} />
      <RelatedLinks current="p:dhaka-person" />
    </main>
  );
}
