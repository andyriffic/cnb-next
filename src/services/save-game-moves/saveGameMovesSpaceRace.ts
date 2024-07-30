import { STARMAP_HEIGHT } from "../../components/space-race/constants";
import {
  getPlayerSpaceRaceDetails,
  SpaceRaceDetails,
} from "../../types/Player";
import { getPlayer, updatePlayer } from "../../utils/data/aws-dynamodb";
import { generateRandomInt } from "../../utils/random";
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

        const alreadyPlaying = !!player.details?.spaceRace;

        const spaceRaceDetails: SpaceRaceDetails = alreadyPlaying
          ? getPlayerSpaceRaceDetails(player)
          : {
              xCoordinate: 0,
              yCoordinate: generateRandomInt(0, STARMAP_HEIGHT - 1),
            };

        updatePlayer(playerMoves.playerId, {
          ...player.details,
          gameMoves: currentGameMoves + playerMoves.moves,
          spaceRace: spaceRaceDetails,
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
