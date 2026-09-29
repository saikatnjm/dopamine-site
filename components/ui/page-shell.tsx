import type { ReactNode } from "react";

// Simple text page (About, Privacy, Terms). Styles plain HTML children
// without pulling in a typography plugin.
export function PageShell({
  emoji,
  title,
  intro,
  children,
}: {
  emoji: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-8 pt-6">
      <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
        <span aria-hidden>{emoji}</span> {title}
      </h1>
      {intro && <p className="mt-3 text-lg text-ink-muted">{intro}</p>}
      <div className="mt-8 rounded-card border-2 border-ink bg-surface p-6 shadow-pop sm:p-8 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2:first-child]:mt-0 [&_li]:mt-1 [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
