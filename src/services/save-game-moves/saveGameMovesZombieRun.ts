import { SETTINGS_PLAYER_ID } from "../../constants";
import {
  ZombieRunDetails,
  getPlayerZombieRunDetails,
} from "../../types/Player";
import { getPlayer, updatePlayer } from "../../utils/data/aws-dynamodb";
import { PlayerGameMoves } from "./types";

const STARTING_DISTANCE_FROM_ZOMBIE = 4;

const updatePlayerGameMoves = (
  playerMoves: PlayerGameMoves,
  zombieCurrentPosition: number,
  team?: string
): Promise<void> => {
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

        const zombieRunDetails: ZombieRunDetails = !player.details?.zombieRun
          ? {
              totalMetresRun:
                zombieCurrentPosition + STARTING_DISTANCE_FROM_ZOMBIE,
              isZombie: false,
            }
          : player.details.zombieRun;

        updatePlayer(playerMoves.playerId, {
          ...player.details,
          gameMoves: currentGameMoves + playerMoves.moves,
          zombieRun: zombieRunDetails,
        })
          .then(resolve)
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const updatedGameIds: string[] = [];

export const savePlayersGameMoves = (
  gameId: string,
  moves: PlayerGameMoves[],
  team?: string
): Promise<void> => {
  if (updatedGameIds.includes(gameId)) {
    console.log(`Game ${gameId} already updated`, updatedGameIds);
    return Promise.resolve();
  }

  updatedGameIds.push(gameId);

  return new Promise((resolve, reject) => {
    getPlayer(SETTINGS_PLAYER_ID)
      .then((settingsPlayer) => {
        const zombieCurrentPosition = settingsPlayer
          ? getPlayerZombieRunDetails(settingsPlayer).totalMetresRun
          : 0;

        const promises = moves.map((move) =>
          updatePlayerGameMoves(move, zombieCurrentPosition, team)
        );

        Promise.all(promises)
          .then(() => resolve())
          .catch(reject);
      })
      .catch(reject);
  });
};
