import { PlayerGameMoves } from "../save-game-moves/saveGameMovesPacman";
import { NumberCrunchGameView } from "./types";
import {
  NUMBER_CRUNCH_BUCKET_RANGES,
  getNumberCrunchRangeBucketIndex,
} from ".";

const MOST_PRESSES_BONUS_POINTS = 2;

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
        moves:
          NUMBER_CRUNCH_BUCKET_RANGES[playerGuess.bucketRangeIndex]!.points,
        winner: playerGuess.bucketRangeIndex === 0,
      };
    }
  );
};
