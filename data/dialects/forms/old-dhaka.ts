import type { RegionalForm } from "@/lib/dialects/types";

// Imported from resources/2026-10-25-regional-dialect-research.md (Old Dhaka, Dhaka region, Mymensingh report).
// Every entry needs review.
export const oldDhakaForms: RegionalForm[] = [
  { id: "old-dhaka-boy", conceptId: "boy", form: "পোলা", variants: [], regions: ["old-dhaka"], area: "Dhakaiya Kutti", script: "bangla", sources: ["wiki-dhakaiya-kutti", "bn-wiki-kutti", "banglapedia-dialect"], confidence: "high", status: "needs_review", notes: "Banglapedia says 'in Dhaka pola'." },
  { id: "old-dhaka-girl", conceptId: "girl", form: "মাইয়া", variants: [], regions: ["old-dhaka"], area: "Dhakaiya Kutti", script: "bangla", sources: ["wiki-dhakaiya-kutti", "bn-wiki-kutti"], confidence: "high", status: "needs_review" },
  { id: "old-dhaka-why", conceptId: "why", form: "ক্যালা", variants: [], regions: ["old-dhaka"], area: "Dhakaiya Kutti", script: "bangla", sources: ["wiki-dhakaiya-kutti", "bn-wiki-kutti"], confidence: "medium", status: "needs_review", notes: "Research rates this medium-high." },
  { id: "old-dhaka-how", conceptId: "how", form: "কেমতে", variants: [], regions: ["old-dhaka"], area: "Dhakaiya Kutti", script: "bangla", sources: ["wiki-dhakaiya-kutti", "bn-wiki-kutti"], confidence: "medium", status: "needs_review", notes: "Given as 'how', not as in 'কেমন আছ'." },
  { id: "old-dhaka-bottle-gourd", conceptId: "bottle-gourd", form: "কদ্দু", variants: [], regions: ["old-dhaka"], area: "Dhakaiya Kutti", script: "bangla", sources: ["wiki-dhakaiya-kutti", "dailysangram-dhakar-bhasha"], confidence: "high", status: "needs_review", example: "বাজার থন কী কিন্ছস্? কল্লা আর কদ্দু?", notes: "Doubled consonant. wiki-dhakaiya-kutti lists কদু in the standard column." },
];
