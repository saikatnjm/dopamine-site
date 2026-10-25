import type { DialectContent, DialectWord, Difficulty, QuizQuestion, VerificationStatus } from "@/lib/dialects/types";
import { DISTRICTS } from "@/data/dialects/districts";

// TEST-ONLY placeholder content. These are deliberately fake strings
// ("পরীক্ষা-শব্দ-…"), not dialect facts — they only exercise the structure.

export function word(id: string, district: string, status: VerificationStatus = "verified"): DialectWord {
  return {
    id,
    standardWord: `প্রমিত-${id}`,
    localWord: `পরীক্ষা-শব্দ-${id}`,
    meaningBn: `অর্থ-${id}`,
    districtIds: [district],
    region: "khulna",
    variants: [],
    source: "test fixture",
    verificationStatus: status,
  };
}

export function question(id: string, wordId: string, district: string, difficulty: Difficulty = "easy", status: QuizQuestion["status"] = "published"): QuizQuestion {
  return {
    id,
    wordId,
    question: { en: `Test question ${id}?`, bn: `পরীক্ষা প্রশ্ন ${id}?` },
    options: [
      { id: "a", text: `উত্তর-ক-${id}` },
      { id: "b", text: `উত্তর-খ-${id}` },
      { id: "c", text: `উত্তর-গ-${id}` },
      { id: "d", text: `উত্তর-ঘ-${id}` },
    ],
    correctOptionId: "b",
    explanation: { en: "Test explanation.", bn: "পরীক্ষার ব্যাখ্যা।" },
    difficulty,
    districtIds: [district],
    tags: [],
    status,
  };
}

/** n verified words + published questions per district, difficulties cycling easy/medium/hard. */
export function fixture(perDistrict = 12, districts = ["jashore", "sylhet"]): DialectContent {
  const levels: Difficulty[] = ["easy", "medium", "hard"];
  const words: DialectWord[] = [];
  const questions: QuizQuestion[] = [];
  for (const d of districts) {
    for (let i = 0; i < perDistrict; i++) {
      const id = `${d}-${i}`;
      words.push(word(`w-${id}`, d));
      questions.push(question(`q-${id}`, `w-${id}`, d, levels[i % 3]));
    }
  }
  return { districts: DISTRICTS, words, questions };
}
