import { PlayerGameMoves } from "../save-game-moves/types";
import { MysteryBoxGameView } from "./types";

export const MysteryBoxGameToPoints = (
  gameView: MysteryBoxGameView
): PlayerGameMoves[] => {
  if (!gameView.gameOverSummary) {
    throw "Cannot create points from non-finished Mystery Box game";
  }

  return gameView.players.map<PlayerGameMoves>((mbPlayer) => {
    return {
      playerId: mbPlayer.id,
      moves: mbPlayer.lootTotals.points?.total || 0,
      winner: gameView.gameOverSummary?.outrightWinnerPlayerId === mbPlayer.id,
    };
  });
};
