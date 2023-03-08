import { useMemo } from "react";
import { GroupBettingGame } from "../../../services/betting/types";
import {
  createPoints,
  RockPaperScissorsPoints,
} from "../../../services/rock-paper-scissors/points";
import { RPSSpectatorGameView } from "../../../services/rock-paper-scissors/types";
import { WinningConditions } from "./useGameWinningConditions";

export const useGameFinalPoints = (
  rpsGame: RPSSpectatorGameView | undefined,
  bettingGame: GroupBettingGame | undefined,
  winningConditions: WinningConditions | undefined
): RockPaperScissorsPoints | undefined => {
  const rockPaperScissorsPoints = useMemo(() => {
    if (
      !(
        bettingGame &&
        rpsGame &&
        winningConditions &&
        winningConditions.gameOver
      )
    ) {
      return;
    }

    return createPoints(rpsGame, bettingGame, winningConditions);
  }, [winningConditions, rpsGame, bettingGame]);

  return rockPaperScissorsPoints;
};
