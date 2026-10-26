import { JsonLd } from "@/components/seo/json-ld";
import { card } from "@/components/ui/styles";
import { HOW_TO } from "@/data/how-to";
import { fmt, t } from "@/lib/i18n/core";
import { getI18n } from "@/lib/i18n/server";

/**
 * "How to play" + tips + FAQ under an activity (Phase 49 step C). Server-rendered,
 * no client JS; FAQPage JSON-LD matches the visible questions.
 */
export async function HowToPlay({ activity, name }: { activity: string; name: string }) {
  const h = HOW_TO[activity];
  if (!h) return null;
  const { lang, d } = await getI18n();
  const id = `how-${activity.replace(/[^a-z0-9]/g, "-")}`;
  return (
    <section aria-labelledby={id} className="mt-12">
      <JsonLd
        ld={{
          "@type": "FAQPage",
          mainEntity: h.faq.map((f) => ({ "@type": "Question", name: t(f.q, lang), acceptedAnswer: { "@type": "Answer", text: t(f.a, lang) } })),
        }}
      />
      <h2 id={id} className="font-display text-2xl font-extrabold sm:text-3xl">
        {fmt(d.howToTitle, { name })}
      </h2>
      <ol className={`${card} mt-4 grid list-decimal gap-2 p-5 pl-10 marker:font-black`}>
        {h.steps.map((s, i) => (
          <li key={i} className="pl-1 leading-relaxed">
            {t(s, lang)}
          </li>
        ))}
      </ol>
      <h3 className="mt-6 font-display text-xl font-extrabold">💡 {d.howToTips}</h3>
      <ul className="mt-2 grid list-disc gap-1.5 pl-6 text-ink-muted">
        {h.tips.map((s, i) => (
          <li key={i} className="leading-relaxed">
            {t(s, lang)}
          </li>
        ))}
      </ul>
      <h2 className="mt-10 font-display text-2xl font-extrabold sm:text-3xl">{d.guideFaq}</h2>
      <div className="mt-4 grid gap-3">
        {h.faq.map((f, i) => (
          <div key={i} className={`${card} p-5`}>
            <h3 className="font-display text-xl font-extrabold">{t(f.q, lang)}</h3>
            <p className="mt-1 text-ink-muted">{t(f.a, lang)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
