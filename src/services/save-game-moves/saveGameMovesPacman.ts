import {
  DEFAULT_PACMAN_DETAILS,
  getPlayerPacManDetails,
} from "../../types/Player";
import { getPlayer, updatePlayer } from "../../utils/data/aws-dynamodb";
import { addToMonthlyCoinTotal } from "../../utils/player";
import { PlayerGameMoves } from "./types";

const updatePlayerGameMoves = (
  playerMoves: PlayerGameMoves,
  team?: string
): Promise<void> => {
  console.log("Updating player moves", playerMoves, team);
  return new Promise((resolve, reject) => {
    getPlayer(playerMoves.playerId)
      .then((player) => {
        if (!player) {
          reject(new Error(`Player with id ${playerMoves.playerId} not found`));
          return;
        }

        if (team && player.details?.team !== team) {
          console.log(
            "Skipping player",
            playerMoves.playerId,
            "not on team",
            team
          );
          return;
        }

        const currentGameMoves = player.details?.gameMoves || 0;

        const earnedPowerPill = !!playerMoves.winner;

        const playerPacmanDetails = getPlayerPacManDetails(player);

        const totalCoinsWon = !!playerMoves.winner ? 1 : 0;
        const availableCoins =
          (player.details?.availableCoins || 0) + totalCoinsWon;
        const totalCoins = (player.details?.totalCoins || 0) + totalCoinsWon;
        const monthlyCoinTotals = addToMonthlyCoinTotal(
          player.details?.monthlyCoinTotals,
          totalCoinsWon
        );

        updatePlayer(playerMoves.playerId, {
          ...player.details,
          pacmanPlayer: true,
          gameMoves: currentGameMoves + playerMoves.moves,
          pacmanDetails: {
            ...playerPacmanDetails,
            hasPowerPill: earnedPowerPill || playerPacmanDetails.hasPowerPill,
            jailTurnsRemaining: earnedPowerPill
              ? 0
              : playerPacmanDetails.jailTurnsRemaining,
          },
          totalCoins,
          availableCoins,
          monthlyCoinTotals,
        }).then(() => resolve());
      })
      .catch((err) => reject(err));
  });
};

const updatedGameIds: string[] = [];

export const savePlayersGameMoves = (
  gameId: string,
  moves: PlayerGameMoves[],
  team?: string
): Promise<void[]> | Promise<void> => {
  if (updatedGameIds.includes(gameId)) {
    console.log(`Game ${gameId} already updated`, updatedGameIds);
    return Promise.resolve();
  }

  updatedGameIds.push(gameId);

  const promises = moves.map((move) => updatePlayerGameMoves(move, team));

  return Promise.all(promises);
};
