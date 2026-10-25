import { AncholikQuizGame } from "@/components/games/ancholik-quiz-game";
import type { FriendChallenge } from "@/lib/challenge";
import { listRegions, quizPool } from "@/lib/dialects/content";

// Server wrapper for /c/<token>: the quiz needs the published pool from the
// server (drafts never reach the browser), which the other games don't.
export function AncholikQuizChallenge({ challenge }: { challenge: FriendChallenge | null }) {
  const districts = listRegions().map(({ id, name, emoji }) => ({ id, name, emoji }));
  return <AncholikQuizGame pool={quizPool()} districts={districts} initial={{ scope: null, level: null, config: null }} challenge={challenge} />;
}
