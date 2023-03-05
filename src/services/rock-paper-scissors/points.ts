import { WinningConditions } from "../../components/rock-paper-scissors/hooks/useGameWinningConditions";
import { GroupBettingGame, PlayerWallet } from "../betting/types";
import { RPSSpectatorGameView } from "./types";

const WINNER_POINTS = 6;
const WASHOUT_POINTS = 2;

type PlayerPoints = { playerId: string; points: number };

export type RockPaperScissorsPoints = {
  outrightWinner?: PlayerPoints;
  middleOfThePack: PlayerPoints[];
  zeroPointLosers: PlayerPoints[];
};

const getWinnerPoints = (
  winningConditions: WinningConditions,
  points: number
): PlayerPoints | undefined => {
  const winningPlayerId =
    winningConditions.spectatorWinnerPlayerId ||
    winningConditions.playerWinnerPlayerId;
  if (winningPlayerId) {
    return { playerId: winningPlayerId, points };
  }

  return undefined;
};

const convertWalletsToPoints = (wallets: PlayerWallet[]): PlayerPoints[] => {
  return wallets.map((w) => ({ playerId: w.playerId, points: w.value }));
};

export const createPoints = (
  bettingGame: GroupBettingGame,
  winningConditions: WinningConditions
): RockPaperScissorsPoints => {
  if (winningConditions.washout) {
    //Give everyone the same points
    return {
      middleOfThePack: convertWalletsToPoints(bettingGame.playerWallets).map(
        (p) => ({ ...p, points: WASHOUT_POINTS })
      ),
      zeroPointLosers: [],
    };
  }

  const winnerPoints = getWinnerPoints(winningConditions, WINNER_POINTS);
  const everyoneElsePoints = convertWalletsToPoints(
    bettingGame.playerWallets
  ).filter((p) => p.playerId !== winnerPoints?.playerId);

  return {
    outrightWinner: winnerPoints,
    middleOfThePack: everyoneElsePoints.filter((p) => p.points > 0),
    zeroPointLosers: everyoneElsePoints.filter((p) => p.points === 0),
  };
};
