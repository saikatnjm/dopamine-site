import type { Text } from "@/lib/i18n/core";

// Copy for শব্দের মানচিত্র (/games/word-map) and its region pages. Regional
// words stay in Bangla in both languages; everything around them is translated.

export const mapCopy = {
  title: { en: "Bangladesh Word Map", bn: "শব্দের মানচিত্র" },
  lead: {
    en: "Same thing, different name in every region. Pick a word and see what Bangladesh calls it.",
    bn: "একই জিনিস, এলাকা বদলালেই নাম বদলায়। একটা শব্দ বেছে নাও — দেখো বাংলাদেশের কোথায় একে কী বলে।",
  },
  pick: { en: "Pick a word", bn: "একটা শব্দ বেছে নাও" },
  count: { en: "{names} names in {regions} regions", bn: "{regions}টা এলাকায় {names}টা নাম" },
  mapAria: { en: "Map of Bangladesh: regional words for “{word}”", bn: "বাংলাদেশের মানচিত্র: “{word}”-এর আঞ্চলিক নাম" },
  regionsHeading: { en: "Region by region", bn: "এলাকা ধরে ধরে" },
  unknown: { en: "Not known yet", bn: "এখনো জানা নেই" },
  unknownHint: { en: "We haven't found a sourced word for this region yet.", bn: "এই এলাকার শব্দ এখনো সূত্রসহ পাইনি।" },
  variants: { en: "Other spellings", bn: "অন্য বানান" },
  example: { en: "Example", bn: "উদাহরণ" },
  area: { en: "Where", bn: "এলাকা" },
  source: { en: "Source", bn: "সূত্র" },
  sourced: { en: "📚 From sources, not yet checked by locals", bn: "📚 সূত্র থেকে নেওয়া, এলাকার মানুষ এখনো যাচাই করেননি" },
  verified: { en: "✅ Checked by people", bn: "✅ মানুষ দিয়ে যাচাই করা" },
  regionPage: { en: "All {region} words →", bn: "{region}-এর সব শব্দ →" },
  detectiveCta: { en: "🕵️ Now: which region are YOU from?", bn: "🕵️ এবার দেখো তুমি কোন এলাকার মানুষ" },
  posterKicker: { en: "🗺️ Bangladesh Word Map", bn: "🗺️ শব্দের মানচিত্র" },
  posterTitle: { en: "“{word}” — what does your region call it?", bn: "“{word}” — বাংলাদেশে কে কী বলে?" },
  posterSubtitle: { en: "Same thing, {names} names in {regions} regions", bn: "একই জিনিস, {regions} এলাকায় {names} নাম" },
  posterCta: { en: "What do you call it? Tell us in the comments 👇", bn: "তোমার এলাকায় কী বলে? কমেন্টে জানাও 👇" },
  shareText: { en: "See what “{word}” is called across Bangladesh! What do you call it? 👇", bn: "“{word}”-কে বাংলাদেশে কে কী বলে দেখো! তোমার এলাকায় কী বলে? 👇" },
  note: {
    en: "Words come from cited research (dictionaries, papers, government and newspaper pages). Spellings and usage vary between villages — spotted a mistake? Tell us via the About page.",
    bn: "শব্দগুলো সূত্রসহ গবেষণা থেকে নেওয়া (অভিধান, গবেষণাপত্র, সরকারি ও পত্রিকার পাতা)। গ্রামভেদে বানান আর ব্যবহার আলাদা হতে পারে — ভুল চোখে পড়লে About পেজের যোগাযোগে জানাও।",
  },
  // Region pages
  regionTitle: { en: "{region} dialect words", bn: "{region}-এর আঞ্চলিক শব্দ" },
  regionDistricts: { en: "Mainly spoken in", bn: "যেসব জেলায় বেশি বলা হয়" },
  regionCount: { en: "{n} sourced words", bn: "সূত্রসহ {n}টা শব্দ" },
  regionEmpty: { en: "No sourced words for this region yet.", bn: "এই এলাকার সূত্রসহ শব্দ এখনো নেই।" },
  backToMap: { en: "← Word map", bn: "← শব্দের মানচিত্র" },
  seeOnMap: { en: "Compare on the map →", bn: "মানচিত্রে তুলনা করো →" },
  borders: {
    en: "Dialect borders are fuzzy: neighbouring districts often mix, and one word can live in several regions.",
    bn: "ভাষার সীমানা ঝাপসা: পাশের জেলাগুলোর ভাষা মিশে যায়, আর একই শব্দ কয়েক এলাকায় চলে।",
  },
} satisfies Record<string, Text>;
