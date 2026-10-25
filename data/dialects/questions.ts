import type { QuizQuestion } from "@/lib/dialects/types";

// Quiz questions for আঞ্চলিক ভাষার লড়াই. Every question points at one word
// (wordId). Only "published" questions whose word is "verified" are used in
// scored quizzes; the build fails if a published question points at an
// unreviewed word. Never rename or reuse a question id.

export const QUESTIONS: QuizQuestion[] = [];
