import Link from "next/link";
import { btnPrimary } from "@/components/ui/styles";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { d } = await getI18n();
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 text-center">
      <p aria-hidden className="text-7xl">🛺💨</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold">
        {d.nfTitle} &ldquo;ওইদিকে যাবো না&rdquo;
      </h1>
      <p className="mt-3 text-lg text-ink-muted">{d.nfBody}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/" className={`${btnPrimary} bg-lime`}>
          {d.takeHome}
        </Link>
        <Link href="/experiences" className={`${btnPrimary} bg-surface`}>
          {d.browseExp}
        </Link>
      </div>
    </main>
  );
}
