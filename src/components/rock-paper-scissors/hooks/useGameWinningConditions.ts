import { useMemo } from "react";
import { GroupBettingGame } from "../../../services/betting/types";
import { RPSSpectatorGameView } from "../../../services/rock-paper-scissors/types";

export type WinningConditions = {
  washout?: boolean;
  spectatorWinnerPlayerId?: string;
  playerWinnerPlayerId?: string;
  couldWinNextMovePlayerIds: string[];
  frontRunnerPlayerIds: string[];
  gameOver: boolean;
  hotPlayerIds: string[];
};

export const useGameWinningConditions = (
  rpsGame: RPSSpectatorGameView | undefined,
  bettingGame: GroupBettingGame | undefined
): WinningConditions | undefined => {
  const winningConditions = useMemo<WinningConditions | undefined>(() => {
    if (!(rpsGame && bettingGame)) {
      return;
    }

    console.log("useGameWinningConditions", rpsGame, bettingGame);

    const playersWhoHaventLostABet = bettingGame.playerWallets
      .filter((w) => w.value > 0)
      .filter(
        (w) =>
          w.value ===
          bettingGame.roundHistory.length +
            (rpsGame.currentRound.result ? 1 : 0)
      )
      .map((w) => w.playerId);

    const playersAtTargetScore = bettingGame.playerWallets.filter(
      (w) => w.value >= rpsGame.spectatorTargetGuesses
    );

    if (playersAtTargetScore.length === 1) {
      return {
        spectatorWinnerPlayerId: playersAtTargetScore[0]!.playerId,
        couldWinNextMovePlayerIds: [],
        frontRunnerPlayerIds: [],
        gameOver: true,
        hotPlayerIds: playersWhoHaventLostABet,
      };
    }

    if (playersAtTargetScore.length > 1) {
      //Find winner of the two players
      const player1Id = rpsGame.playerIds[0];
      const player2Id = rpsGame.playerIds[1];

      const player1Score =
        rpsGame.scores.find((s) => s.playerId === player1Id)?.score || 0;
      const player2Score =
        rpsGame.scores.find((s) => s.playerId === player2Id)?.score || 0;

      if (player1Score === player2Score) {
        return {
          washout: true,
          couldWinNextMovePlayerIds: [],
          frontRunnerPlayerIds: [],
          gameOver: true,
          hotPlayerIds: playersWhoHaventLostABet,
        };
      } else if (player1Score > player2Score) {
        return {
          playerWinnerPlayerId: player1Id,
          couldWinNextMovePlayerIds: [],
          frontRunnerPlayerIds: [],
          gameOver: true,
          hotPlayerIds: playersWhoHaventLostABet,
        };
      } else {
        return {
          playerWinnerPlayerId: player2Id,
          couldWinNextMovePlayerIds: [],
          frontRunnerPlayerIds: [],
          gameOver: true,
          hotPlayerIds: playersWhoHaventLostABet,
        };
      }
    }

    const highestScore = Math.max(
      ...bettingGame.playerWallets.map((w) => w.value)
    );

    const playerIdsWithHighestScore = bettingGame.playerWallets
      .filter((w) => w.value === highestScore)
      .map((w) => w.playerId);

    return {
      couldWinNextMovePlayerIds: bettingGame.playerWallets
        .filter((w) => w.value === rpsGame.spectatorTargetGuesses - 1)
        .map((w) => w.playerId),
      frontRunnerPlayerIds: playerIdsWithHighestScore,
      gameOver: false,
      hotPlayerIds: playersWhoHaventLostABet,
    };
  }, [rpsGame, bettingGame]);

  return winningConditions;
};
