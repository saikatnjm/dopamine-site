// Regional dialect content: the single source of types for districts, words
// and quiz questions (data in data/dialects/, checks in lib/dialects/validate.ts).
//
// Nothing here is checked for linguistic accuracy by code. A word is only
// "verified" when a person has reviewed it; only published questions about
// verified words are ever used in a scored quiz.

import type { Text } from "@/lib/i18n/core";

/** Bangladesh divisions that districts belong to (used as the word's region). */
export type DivisionId = "barishal" | "chattogram" | "dhaka" | "khulna" | "mymensingh" | "rajshahi" | "rangpur" | "sylhet";

export type District = {
  /** Official spelling, lowercase: "jashore", "chattogram". Never rename (share links + seeds). */
  id: string;
  name: Text;
  division: DivisionId;
  /** Older/common spellings that should also match ("jessore", "chittagong"). */
  aliases: readonly string[];
  emoji: string;
};

/** draft → needs_review → verified (by a person, never automatically). */
export type VerificationStatus = "draft" | "needs_review" | "verified";

export type DialectWord = {
  /** /^[a-z0-9-]{1,40}$/, also the URL slug of /games/words/<id>. Never rename or reuse. */
  id: string;
  /** Standard (প্রমিত) Bangla word, e.g. "ছেলে". */
  standardWord: string;
  /** The regional word as written by the source, e.g. "পোলা". Kept exactly as given. */
  localWord: string;
  meaningBn: string;
  /** Optional English gloss shown next to the Bangla in English mode. */
  meaningEn?: string;
  districtIds: readonly string[];
  region: DivisionId;
  /** Other spellings seen for the same word (never merged into localWord). */
  variants: readonly string[];
  pronunciation?: string;
  exampleSentence?: string;
  /** Where the entry came from, e.g. "Owner's Jashore dialect image (2026-10)". */
  source: string;
  contributor?: string;
  verificationStatus: VerificationStatus;
  /** Uncertainty, usage limits, reviewer remarks. */
  notes?: string;
};

export type Difficulty = "easy" | "medium" | "hard";

/** draft / verified (reviewed, not live yet) / published (used in scored quizzes). */
export type QuestionStatus = "draft" | "verified" | "published";

export type QuizOption = {
  /** Unique within the question, e.g. "a". */
  id: string;
  /** Option text exactly as shown (dialect words stay in Bangla in both languages). */
  text: string;
  /** Optional English gloss shown under the option in English mode. */
  gloss?: string;
};

export type QuizQuestion = {
  id: string;
  wordId: string;
  question: Text;
  /** Exactly four distinct options. */
  options: readonly QuizOption[];
  correctOptionId: string;
  explanation: Text;
  difficulty: Difficulty;
  districtIds: readonly string[];
  tags: readonly string[];
  status: QuestionStatus;
};

export type DialectContent = {
  districts: readonly District[];
  words: readonly DialectWord[];
  questions: readonly QuizQuestion[];
};
