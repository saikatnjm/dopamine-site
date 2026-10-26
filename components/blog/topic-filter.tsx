"use client";

import { useState } from "react";
import { chip } from "@/components/ui/styles";

/**
 * Topic chips for /blog. Progressive enhancement: the server renders every card;
 * this only hides the ones outside the chosen topic (cards carry data-topic).
 */
export function TopicFilter({ topics, allLabel, listId }: { topics: readonly { id: string; label: string }[]; allLabel: string; listId: string }) {
  const [active, setActive] = useState<string | null>(null);

  function choose(topic: string | null) {
    setActive(topic);
    for (const el of document.querySelectorAll<HTMLElement>(`#${listId} [data-topic]`)) {
      el.parentElement!.hidden = topic !== null && el.dataset.topic !== topic;
    }
  }

  return (
    <div role="group" className="mt-6 flex flex-wrap gap-2">
      {[{ id: null, label: allLabel }, ...topics].map((tp) => (
        <button
          key={tp.id ?? "all"}
          type="button"
          aria-pressed={active === tp.id}
          onClick={() => choose(tp.id)}
          className={`${active === tp.id ? chip.replace("bg-surface", "bg-ink text-bg") : chip} min-h-11`}
        >
          {tp.label}
        </button>
      ))}
    </div>
  );
}
