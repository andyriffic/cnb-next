import { Player } from "../types/Player";
import {
  getPlayer,
  updatePlayer,
  updatePlayerLegacyTags,
} from "../utils/data/aws-dynamodb";

export type PlayerGameMoves = {
  playerId: string;
  moves: number;
};

const incrementIntegerTag = (
  tagPrefix: string,
  by: number,
  tags: string[]
): string[] => {
  const existingTag = tags.find((t) => t.startsWith(tagPrefix));

  if (!existingTag) {
    return [...tags, `${tagPrefix}${by}`];
  }

  const [tagName, tagValueStr] = existingTag.split(":");
  const existingValue = tagValueStr ? parseInt(tagValueStr, 10) : 0;

  return [
    ...tags.filter((t) => !t.startsWith(tagPrefix)),
    `${tagPrefix}${existingValue + by}`,
  ];
};

const updateLegacyMovesTag = (player: Player, moves: number): Promise<void> => {
  const newTags = [
    ...incrementIntegerTag("sl_moves:", moves, player.tags).filter(
      (t) => t !== "sl_participant"
    ),
    "sl_participant",
  ];
  return updatePlayerLegacyTags(player.id, newTags);
};

const updatePlayerGameMoves = (playerMoves: PlayerGameMoves): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPlayer(playerMoves.playerId)
      .then((player) => {
        if (!player) {
          reject(new Error(`Player with id ${playerMoves.playerId} not found`));
          return;
        }

        const currentGameMoves = player.details?.gameMoves || 0;

        updatePlayer(playerMoves.playerId, {
          gameMoves: currentGameMoves + playerMoves.moves,
        })
          .then(() => {
            updateLegacyMovesTag(player, playerMoves.moves)
              .then(() => resolve())
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

const updatedGameIds: string[] = [];

export const savePlayersGameMoves = (
  gameId: string,
  moves: PlayerGameMoves[]
): Promise<void[]> | Promise<void> => {
  if (updatedGameIds.includes(gameId)) {
    console.log(`Game ${gameId} already updated`, updatedGameIds);
    return Promise.resolve();
  }

  updatedGameIds.push(gameId);

  const promises = moves.map(updatePlayerGameMoves);

  return Promise.all(promises);
};
