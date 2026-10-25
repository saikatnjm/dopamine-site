import type { RegionalForm } from "@/lib/dialects/types";

// Imported from resources/2026-10-25-regional-dialect-research.md (Rajshahi and Rangpur report).
// Every entry needs review.
export const boguraForms: RegionalForm[] = [
  { id: "bogura-boy", conceptId: "boy", form: "ব্যাটা ছৈল", variants: ["byata chhail"], regions: ["bogura"], area: "Bogura", script: "bangla", sources: ["banglapedia-dialect"], confidence: "high", status: "needs_review", notes: "English Banglapedia spells it 'byata chhail'." },
  { id: "bogura-i", conceptId: "i", form: "হামি", variants: [], regions: ["bogura"], area: "Bogura", script: "bangla", sources: ["ekhon-bogura"], confidence: "medium", status: "needs_review", example: "বোগড়্যার মানুষ হামি বোগড়োতই জন্ম হামার, তাও এ ভাষাত কতা কওয়া হামার জন্য কষ্টকর।", notes: "The article writes in Bogura dialect but glosses nothing." },
  { id: "bogura-i-2", conceptId: "i", form: "মুই", variants: [], regions: ["bogura"], area: "Bogura", script: "bangla", sources: ["ekhon-bogura"], confidence: "medium", status: "needs_review", notes: "Listed with হামি in the research row; the article glosses nothing." },
  { id: "bogura-have-you-eaten", conceptId: "have-you-eaten", form: "তুই ভাত খালু?", variants: [], regions: ["bogura"], area: "Joypurhat Sadar, Panchbibi; Kalai", script: "bangla", sources: ["joypurhat-portal", "kalai-portal"], confidence: "medium", status: "needs_review" },
  { id: "bogura-where-going", conceptId: "where-going", form: "তুই কোটে যাচ্ছু বারে?", variants: [], regions: ["bogura"], area: "Akkelpur, Khetlal, Kalai (Bogura influence)", script: "bangla", sources: ["joypurhat-portal", "kalai-portal"], confidence: "medium", status: "needs_review" },
  { id: "bogura-two-sons", conceptId: "two-sons", form: "একজ়ন মানষের দুইকনা ব্যাটা/সাওয়াল/সোল সিলো।", variants: [], regions: ["bogura"], area: "Joypurhat", script: "bangla", sources: ["bn-wiki-barendri"], confidence: "medium", status: "needs_review", notes: "The Bangla Wikipedia article is rated medium-low overall; the research's phrase table rates the per-district sentences medium." },
];
