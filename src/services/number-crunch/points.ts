import { PlayerGameMoves } from "../save-game-moves/types";
import { NumberCrunchGameView } from "./types";
import {
  NUMBER_CRUNCH_BUCKET_RANGES,
  NumberCrunchBucketRange,
  getNumberCrunchRangeBucketIndex,
} from ".";

export const FIRST_GUESS_BONUS_POINTS = 5;

export const getPointsTotalForRange = (
  ranges: NumberCrunchBucketRange[],
  rangeIndex: number,
  firstGuess: boolean
): number => {
  return (
    ranges[rangeIndex]!.points +
    (rangeIndex === 0 && firstGuess ? FIRST_GUESS_BONUS_POINTS : 0)
  );
};

export const numberCrunchGameToPoints = (
  gameView: NumberCrunchGameView
): PlayerGameMoves[] => {
  if (!gameView.finalResults) {
    throw "Cannot create points from non-finished Number Crunch game";
  }

  return gameView.currentRound.playerGuesses.map<PlayerGameMoves>(
    (playerGuess) => {
      return {
        playerId: playerGuess.playerId,
        moves: getPointsTotalForRange(
          NUMBER_CRUNCH_BUCKET_RANGES,
          playerGuess.bucketRangeIndex,
          gameView.guessedInFirstRound
        ),
        winner: playerGuess.bucketRangeIndex === 0,
      };
    }
  );
};
