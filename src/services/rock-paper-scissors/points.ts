import { WinningConditions } from "../../components/rock-paper-scissors/hooks/useGameWinningConditions";
import { GroupBettingGame, PlayerWallet } from "../betting/types";
import { PlayerGameMoves } from "../save-game-moves/types";
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
  return wallets.map((w) => ({ playerId: w.player.id, points: w.value }));
};

export const createPoints = (
  game: RPSSpectatorGameView,
  bettingGame: GroupBettingGame,
  winningConditions: WinningConditions
): RockPaperScissorsPoints => {
  if (winningConditions.washout) {
    //Give everyone the same points
    const allParticipatingPlayerIds = [
      ...bettingGame.playerWallets.map((w) => w.player.id),
      ...game.players.map((p) => p.id),
    ];
    return {
      middleOfThePack: allParticipatingPlayerIds.map((playerId) => ({
        playerId,
        points: WASHOUT_POINTS,
      })),
      zeroPointLosers: [],
    };
  }

  const winnerPoints = getWinnerPoints(winningConditions, WINNER_POINTS);

  if (winningConditions.spectatorWinnerPlayerId) {
  }

  const everyoneElsePoints = convertWalletsToPoints(
    bettingGame.playerWallets
  ).filter((p) => p.playerId !== winnerPoints?.playerId);

  if (winningConditions.spectatorWinnerPlayerId) {
    //If spectator wins, make sure both game players are added to points
    everyoneElsePoints.push({
      playerId: game.players[0].id,
      points:
        game.scores.find((s) => s.playerId === game.players[0].id)?.score || 0,
    });
    everyoneElsePoints.push({
      playerId: game.players[1].id,
      points:
        game.scores.find((s) => s.playerId === game.players[1].id)?.score || 0,
    });
  }

  if (winningConditions.playerWinnerPlayerId) {
    //If player wins, make sure the other player gets added to points
    const otherPlayerId = game.players.find(
      (p) => p.id !== winningConditions.playerWinnerPlayerId
    )!.id;
    if (otherPlayerId) {
      everyoneElsePoints.push({
        playerId: otherPlayerId,
        points:
          game.scores.find((s) => s.playerId === otherPlayerId)?.score || 0,
      });
    }
  }

  return {
    outrightWinner: winnerPoints,
    middleOfThePack: everyoneElsePoints.filter((p) => p.points > 0),
    zeroPointLosers: everyoneElsePoints.filter((p) => p.points === 0),
  };
};

export const toGameMoves = (
  rpsPoints: RockPaperScissorsPoints
): PlayerGameMoves[] => {
  const gameMoves: PlayerGameMoves[] = [];
  if (rpsPoints.outrightWinner) {
    gameMoves.push({
      playerId: rpsPoints.outrightWinner.playerId,
      moves: rpsPoints.outrightWinner.points,
      winner: true,
    });
  }
  rpsPoints.middleOfThePack.forEach((p) => {
    gameMoves.push({
      playerId: p.playerId,
      moves: p.points,
    });
  });
  rpsPoints.zeroPointLosers.forEach((p) => {
    gameMoves.push({
      playerId: p.playerId,
      moves: 0,
    });
  });
  return gameMoves;
};
