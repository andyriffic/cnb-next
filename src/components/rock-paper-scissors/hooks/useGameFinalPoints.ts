import { useMemo } from "react";
import { GroupBettingGame } from "../../../services/betting/types";
import {
  createPoints,
  RockPaperScissorsPoints,
} from "../../../services/rock-paper-scissors/points";
import { WinningConditions } from "./useGameWinningConditions";

export const useGameFinalPoints = (
  bettingGame: GroupBettingGame | undefined,
  winningConditions: WinningConditions | undefined
): RockPaperScissorsPoints | undefined => {
  const rockPaperScissorsPoints = useMemo(() => {
    if (!(bettingGame && winningConditions && winningConditions.gameOver)) {
      return;
    }

    return createPoints(bettingGame, winningConditions);
  }, [winningConditions, bettingGame]);

  return rockPaperScissorsPoints;
};
