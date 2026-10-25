import type { Concept } from "@/lib/dialects/types";

// Concepts compared across regions ("same thing, many names"). The standard
// word is the prompt; regional forms live in data/dialects/forms/. Never
// rename or reuse an id (URLs + share links). Add freely.

export const CONCEPTS: readonly Concept[] = [
  // people & family
  { id: "boy", standard: "ছেলে", en: "boy / son", emoji: "👦", category: "people", kind: "word", difficulty: "easy" },
  { id: "girl", standard: "মেয়ে", en: "girl / daughter", emoji: "👧", category: "people", kind: "word", difficulty: "easy" },
  { id: "child", standard: "বাচ্চা", en: "child", emoji: "👶", category: "people", kind: "word", difficulty: "medium" },
  { id: "father", standard: "বাবা", en: "father", emoji: "👨", category: "people", kind: "word", difficulty: "easy" },
  { id: "father-in-law", standard: "শ্বশুর", en: "father-in-law", emoji: "👴", category: "people", kind: "word", difficulty: "medium" },
  { id: "mother-in-law", standard: "শাশুড়ি", en: "mother-in-law", emoji: "👵", category: "people", kind: "word", difficulty: "medium" },
  { id: "son-in-law", standard: "জামাই", en: "son-in-law", emoji: "🤵", category: "people", kind: "word", difficulty: "hard" },
  // animals
  { id: "cat", standard: "বিড়াল", en: "cat", emoji: "🐈", category: "animals", kind: "word", difficulty: "easy" },
  { id: "chicken", standard: "মুরগি", en: "chicken", emoji: "🐔", category: "animals", kind: "word", difficulty: "easy" },
  { id: "egg", standard: "ডিম", en: "egg", emoji: "🥚", category: "animals", kind: "word", difficulty: "medium" },
  { id: "crow", standard: "কাক", en: "crow", emoji: "🐦‍⬛", category: "animals", kind: "word", difficulty: "easy" },
  // home
  { id: "kitchen", standard: "রান্নাঘর", en: "kitchen", emoji: "🍳", category: "home", kind: "word", difficulty: "hard" },
  { id: "broom", standard: "ঝাড়ু", en: "broom", emoji: "🧹", category: "home", kind: "word", difficulty: "medium" },
  { id: "hand-fan", standard: "হাতপাখা", en: "hand fan", emoji: "🪭", category: "home", kind: "word", difficulty: "hard" },
  { id: "money", standard: "টাকা", en: "money (taka)", emoji: "💸", category: "home", kind: "word", difficulty: "easy" },
  // food
  { id: "water", standard: "পানি", en: "water", emoji: "💧", category: "food", kind: "word", difficulty: "easy" },
  { id: "areca-nut", standard: "সুপারি", en: "areca nut", emoji: "🌰", category: "food", kind: "word", difficulty: "medium" },
  { id: "guava", standard: "পেয়ারা", en: "guava", emoji: "🍐", category: "food", kind: "word", difficulty: "medium" },
  { id: "papaya", standard: "পেঁপে", en: "papaya", emoji: "🍈", category: "food", kind: "word", difficulty: "hard" },
  { id: "bottle-gourd", standard: "লাউ", en: "bottle gourd", emoji: "🥒", category: "food", kind: "word", difficulty: "medium" },
  { id: "curry", standard: "তরকারি", en: "curry", emoji: "🍛", category: "food", kind: "word", difficulty: "medium" },
  // nature & time
  { id: "rain", standard: "বৃষ্টি", en: "rain", emoji: "🌧️", category: "nature", kind: "word", difficulty: "medium" },
  { id: "cold", standard: "শীত / ঠান্ডা", en: "cold", emoji: "🥶", category: "nature", kind: "word", difficulty: "medium" },
  { id: "morning", standard: "সকাল", en: "morning", emoji: "🌅", category: "nature", kind: "word", difficulty: "medium" },
  { id: "evening", standard: "সন্ধ্যা", en: "evening", emoji: "🌆", category: "nature", kind: "word", difficulty: "hard" },
  // everyday words
  { id: "where", standard: "কোথায়", en: "where", emoji: "📍", category: "words", kind: "word", difficulty: "easy" },
  { id: "why", standard: "কেন", en: "why", emoji: "🤔", category: "words", kind: "word", difficulty: "easy" },
  { id: "what", standard: "কী", en: "what", emoji: "❓", category: "words", kind: "word", difficulty: "easy" },
  { id: "how", standard: "কেমন", en: "how", emoji: "🙂", category: "words", kind: "word", difficulty: "medium" },
  { id: "now", standard: "এখন", en: "now", emoji: "⏰", category: "words", kind: "word", difficulty: "medium" },
  { id: "a-lot", standard: "অনেক / খুব", en: "a lot, very", emoji: "💯", category: "words", kind: "word", difficulty: "medium" },
  { id: "good", standard: "ভালো", en: "good", emoji: "👍", category: "words", kind: "word", difficulty: "easy" },
  { id: "small", standard: "ছোট", en: "small", emoji: "🤏", category: "words", kind: "word", difficulty: "medium" },
  { id: "big", standard: "বড়", en: "big", emoji: "🐘", category: "words", kind: "word", difficulty: "medium" },
  { id: "quarrel", standard: "ঝগড়া", en: "quarrel", emoji: "😤", category: "words", kind: "word", difficulty: "medium" },
  { id: "quickly", standard: "তাড়াতাড়ি", en: "quickly", emoji: "⚡", category: "words", kind: "word", difficulty: "hard" },
  { id: "i", standard: "আমি", en: "I", emoji: "🙋", category: "words", kind: "word", difficulty: "easy" },
  { id: "our", standard: "আমাদের", en: "our", emoji: "🏡", category: "words", kind: "word", difficulty: "easy" },
  { id: "you-polite", standard: "আপনি", en: "you (polite)", emoji: "🫵", category: "words", kind: "word", difficulty: "easy" },
  // phrases
  { id: "where-going", standard: "কোথায় যাচ্ছ?", en: "Where are you going?", emoji: "🚶", category: "phrases", kind: "phrase", difficulty: "medium" },
  { id: "how-are-you", standard: "কেমন আছেন?", en: "How are you?", emoji: "👋", category: "phrases", kind: "phrase", difficulty: "medium" },
  { id: "have-you-eaten", standard: "ভাত খেয়েছ?", en: "Have you eaten?", emoji: "🍚", category: "phrases", kind: "phrase", difficulty: "hard" },
  { id: "two-sons", standard: "একজন লোকের দুটি ছেলে ছিল।", en: "A man had two sons.", emoji: "📜", category: "phrases", kind: "phrase", difficulty: "hard" },
];
