// Read access to dialect content. Validated once at import: structural errors
// fail the dev server and the production build (like validateExperience()).
// Server-side use only — pages hand the client just the published pool.

import { DIALECT_CONTENT } from "@/data/dialects";
import type { DialectContent, DialectWord, District } from "@/lib/dialects/types";
import { assertValidDialectContent } from "@/lib/dialects/validate";
import type { PoolQuestion } from "@/lib/games/ancholik-quiz";

assertValidDialectContent(DIALECT_CONTENT);

/** /games/words is only indexed once it has this many verified words (no thin pages). */
export const WORDS_INDEX_MIN = 10;

export function listDistricts(): readonly District[] {
  return DIALECT_CONTENT.districts;
}

export function getDistrict(id: string): District | undefined {
  return DIALECT_CONTENT.districts.find((d) => d.id === id);
}

/** Reviewed words only — the only ones ever shown to visitors. */
export function verifiedWords(): DialectWord[] {
  return DIALECT_CONTENT.words.filter((w) => w.verificationStatus === "verified");
}

export function getVerifiedWord(id: string): DialectWord | undefined {
  return verifiedWords().find((w) => w.id === id);
}

/** A word page is worth indexing only with a reviewed meaning and a real example. */
export function wordIsIndexable(w: DialectWord): boolean {
  return w.verificationStatus === "verified" && Boolean(w.exampleSentence?.trim());
}

/** Published questions about verified words, shaped for the client (no drafts, no notes). */
export function quizPool(): PoolQuestion[] {
  return buildQuizPool(DIALECT_CONTENT);
}

/** Pure version of quizPool() for any content (tests). */
export function buildQuizPool(content: DialectContent): PoolQuestion[] {
  const words = new Map(content.words.filter((w) => w.verificationStatus === "verified").map((w) => [w.id, w]));
  return content.questions.flatMap((q) => {
    const w = words.get(q.wordId);
    if (q.status !== "published" || !w) return [];
    return [
      {
        id: q.id,
        question: q.question,
        options: q.options,
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
        difficulty: q.difficulty,
        districtIds: q.districtIds,
        word: {
          id: w.id,
          localWord: w.localWord,
          standardWord: w.standardWord,
          meaningBn: w.meaningBn,
          ...(w.meaningEn ? { meaningEn: w.meaningEn } : {}),
        },
      },
    ];
  });
}

/** Counts by status — for the CLI report and the "coming soon" copy. */
export function contentStats() {
  const words = DIALECT_CONTENT.words;
  const qs = DIALECT_CONTENT.questions;
  return {
    words: words.length,
    verifiedWords: words.filter((w) => w.verificationStatus === "verified").length,
    reviewWords: words.filter((w) => w.verificationStatus === "needs_review").length,
    questions: qs.length,
    publishedQuestions: quizPool().length,
  };
}
