import { GuessDistrictGame } from "@/components/games/guess-district-game";
import { scoredClues } from "@/data/district-clues";
import type { FriendChallenge } from "@/lib/challenge";

// Server wrapper for /c/<token>: the game needs the verified clue pool from
// the server (unverified clues never reach the browser).
export function GuessDistrictChallenge({ challenge }: { challenge: FriendChallenge | null }) {
  return <GuessDistrictGame clues={scoredClues()} challenge={challenge} />;
}
