import type { DialectContent } from "@/lib/dialects/types";
import { DISTRICTS } from "./districts";
import { QUESTIONS } from "./questions";
import { barishalWords } from "./words/barishal";
import { chattogramWords } from "./words/chattogram";
import { jashoreWords } from "./words/jashore";
import { khulnaWords } from "./words/khulna";
import { noakhaliWords } from "./words/noakhali";
import { sylhetWords } from "./words/sylhet";

// All dialect content in one object. Server-only in practice: pages pass the
// published subset to the client, so drafts never reach the browser bundle.
// Read it through lib/dialects/content.ts (which validates it).

export const DIALECT_CONTENT: DialectContent = {
  districts: DISTRICTS,
  words: [...jashoreWords, ...khulnaWords, ...barishalWords, ...noakhaliWords, ...sylhetWords, ...chattogramWords],
  questions: QUESTIONS,
};
