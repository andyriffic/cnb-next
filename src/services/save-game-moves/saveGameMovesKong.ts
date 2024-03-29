import { Player } from "../../types/Player";
import {
  getPlayer,
  updatePlayer,
  updatePlayerLegacyTags,
} from "../../utils/data/aws-dynamodb";
import { PlayerGameMoves } from "./types";

export const incrementIntegerTag = (
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

const tagsWithKongImmunity = (
  tags: string[],
  hasImmunity: boolean
): string[] => {
  if (!hasImmunity || tags.includes("kong_immunity")) {
    return tags;
  }

  return [...tags, "kong_immunity"];
};

const updateLegacyMovesTag = (
  player: Player,
  playerMoves: PlayerGameMoves
): Promise<void> => {
  const newTags = tagsWithKongImmunity(
    [
      ...incrementIntegerTag(
        "sl_moves:",
        playerMoves.moves,
        player.tags
      ).filter((t) => t !== "sl_participant"),
      "sl_participant",
    ],
    !!playerMoves.winner
  );
  return updatePlayerLegacyTags(player.id, newTags);
};

const updatePlayerGameMoves = (
  playerMoves: PlayerGameMoves,
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

        updatePlayer(playerMoves.playerId, {
          ...player.details,
          gameMoves: currentGameMoves + playerMoves.moves,
        })
          .then(() => {
            updateLegacyMovesTag(player, playerMoves)
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
