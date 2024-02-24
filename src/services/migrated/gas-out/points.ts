import { PlayerGameMoves } from "../../save-game-moves/types";
import { GasGame } from "./types";

const MOST_PRESSES_BONUS_POINTS = 2;

export const gasGameToPoints = (game: GasGame): PlayerGameMoves[] => {
  return game.allPlayers.map<PlayerGameMoves>((player) => {
    const isMostPresses = game.mvpPlayerIds?.mostPresses?.includes(
      player.player.id
    );
    const isMostGuesses = game.mvpPlayerIds?.mostCorrectGuesses?.includes(
      player.player.id
    );

    return {
      playerId: player.player.id,
      moves: player.points + (isMostPresses ? MOST_PRESSES_BONUS_POINTS : 0),
      winner:
        player.player.id === game.winningPlayerId ||
        isMostPresses ||
        isMostGuesses,
    };
  });
};
