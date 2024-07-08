import {
  DEFAULT_PACMAN_DETAILS,
  getPlayerPacManDetails,
} from "../../types/Player";
import { getPlayer, updatePlayer } from "../../utils/data/aws-dynamodb";
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

        updatePlayer(playerMoves.playerId, {
          ...player.details,
          pacmanPlayer: true,
          gameMoves: currentGameMoves + playerMoves.moves,
          pacmanDetails: {
            ...playerPacmanDetails,
            hasPowerPill: earnedPowerPill,
            jailTurnsRemaining: earnedPowerPill
              ? 0
              : playerPacmanDetails.jailTurnsRemaining,
          },
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
