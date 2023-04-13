import { WinningConditions } from "./hooks/useGameWinningConditions";

export const playerHasSpecialAdvantage = (
  winningConditions: WinningConditions | undefined,
  playerId: string
): boolean => {
  const noOneIsLeadingYet =
    winningConditions?.couldWinNextMovePlayerIds.length === 0 &&
    winningConditions?.frontRunnerPlayerIds.length === 0;

  const playerCouldWinNextRound =
    !!winningConditions?.couldWinNextMovePlayerIds.includes(playerId);

  const playerIsFrontRunner =
    winningConditions?.couldWinNextMovePlayerIds.length === 0 &&
    winningConditions.frontRunnerPlayerIds.includes(playerId);

  const specialAdvantage =
    noOneIsLeadingYet || playerCouldWinNextRound || playerIsFrontRunner;

  return specialAdvantage;
};
