import type { Text } from "@/lib/i18n/core";

// Copy for /games/words and /games/words/<id>. Words, meanings and example
// sentences stay in Bangla in both languages; the UI around them is translated.

export const wordsCopy = {
  title: { en: "আঞ্চলিক শব্দভান্ডার — Regional Dialect Words", bn: "আঞ্চলিক শব্দভান্ডার" },
  lead: {
    en: "Words from Bangladesh's regional dialects with their standard Bangla meaning. Every word here was checked by people before it was published — spellings can still vary from village to village.",
    bn: "বাংলাদেশের আঞ্চলিক ভাষার শব্দ আর তাদের প্রমিত বাংলা অর্থ। এখানের প্রতিটা শব্দ প্রকাশের আগে মানুষ যাচাই করেছে — তবু গ্রাম থেকে গ্রামে বানান আলাদা হতে পারে।",
  },
  search: { en: "Search a word or meaning", bn: "শব্দ বা অর্থ খুঁজুন" },
  searchPlaceholder: { en: "e.g. a word, a meaning or a district", bn: "যেমন: শব্দ, অর্থ বা জেলা" },
  district: { en: "District", bn: "জেলা" },
  allDistricts: { en: "All districts", bn: "সব জেলা" },
  go: { en: "Search", bn: "খুঁজুন" },
  clear: { en: "Clear", bn: "মুছুন" },
  count: { en: "{n} words", bn: "{n}টা শব্দ" },
  noMatch: { en: "No word matches that. Try a shorter search or another district.", bn: "এমন কোনো শব্দ পাওয়া গেল না। ছোট করে খুঁজুন বা অন্য জেলা দেখুন।" },
  emptyTitle: { en: "শব্দভান্ডার তৈরি হচ্ছে!", bn: "শব্দভান্ডার তৈরি হচ্ছে!" },
  emptyBody: {
    en: "We're collecting regional words and having real speakers check each one. Nothing goes up here until it's reviewed — no guesses, no made-up words.",
    bn: "আমরা আঞ্চলিক শব্দ জোগাড় করছি, আর প্রতিটা শব্দ এলাকার মানুষ দিয়ে যাচাই করাচ্ছি। যাচাই ছাড়া এখানে কিছুই উঠবে না — আন্দাজ না, বানানো শব্দও না।",
  },
  standard: { en: "Standard Bangla", bn: "প্রমিত বাংলা" },
  meaning: { en: "Meaning", bn: "অর্থ" },
  meaningEn: { en: "In English", bn: "ইংরেজিতে" },
  variants: { en: "Other spellings", bn: "অন্য বানান" },
  pronunciation: { en: "Pronunciation", bn: "উচ্চারণ" },
  example: { en: "Example", bn: "উদাহরণ" },
  source: { en: "Source", bn: "উৎস" },
  contributor: { en: "Contributed by", bn: "দিয়েছেন" },
  reviewed: { en: "✅ Reviewed by people", bn: "✅ মানুষ দিয়ে যাচাই করা" },
  details: { en: "Details →", bn: "বিস্তারিত →" },
  allWords: { en: "← All dialect words", bn: "← সব আঞ্চলিক শব্দ" },
  more: { en: "More words from {district}", bn: "{district}-এর আরও শব্দ" },
  playDistrict: { en: "▶ Play the {district} quiz", bn: "▶ {district}-এর কুইজ খেলো" },
  playQuiz: { en: "▶ Play the dialect quiz", bn: "▶ আঞ্চলিক ভাষার কুইজ খেলো" },
  variesNote: {
    en: "Dialects differ between villages and generations. Know a different spelling or meaning? Let us know via the contact link on the About page.",
    bn: "গ্রাম আর প্রজন্মভেদে ভাষা বদলায়। অন্য বানান বা অর্থ জানেন? About পেজের যোগাযোগ লিংকে জানান।",
  },
} satisfies Record<string, Text>;
