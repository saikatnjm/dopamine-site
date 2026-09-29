import type { Category } from "@/lib/experience/types";

export const categories: Category[] = [
  { slug: "bangladesh", emoji: "🇧🇩", title: { en: "Bangladesh", bn: "বাংলাদেশ" }, description: { en: "Everyday Dhaka chaos, simulated.", bn: "ঢাকার প্রতিদিনের হট্টগোল, সিমুলেটেড।" } },
  { slug: "food", emoji: "🍔", title: { en: "Food", bn: "খাবার" }, description: { en: "Hunger, delivery apps and false hope.", bn: "ক্ষুধা, ডেলিভারি অ্যাপ আর মিথ্যা আশা।" } },
  { slug: "travel", emoji: "✈️", title: { en: "Travel", bn: "ভ্রমণ" }, description: { en: "Getting somewhere. Eventually. Maybe.", bn: "কোথাও পৌঁছানো। একদিন। হয়তো।" } },
  { slug: "work", emoji: "💼", title: { en: "Work", bn: "কাজ" }, description: { en: "Office life without the salary.", bn: "বেতন ছাড়া অফিস লাইফ।" } },
  { slug: "shopping", emoji: "🛍️", title: { en: "Shopping", bn: "শপিং" }, description: { en: "Spend nothing, regret everything.", bn: "কিছুই খরচ না, সবকিছুতে আফসোস।" } },
  { slug: "random", emoji: "😂", title: { en: "Random", bn: "র‍্যান্ডম" }, description: { en: "Things that defy categories.", bn: "যা কোনো ক্যাটাগরিতে পড়ে না।" } },
];
