import { Player } from "../../types/Player";
import { getPlayerSnakesAndLaddersDetails } from "../../types/Player";
import {
  getPlayer,
  updatePlayer,
  updatePlayerLegacyTags,
} from "../../utils/data/aws-dynamodb-players";
import { PlayerGameMoves } from "./types";

export const incrementIntegerTag = (
  tagPrefix: string,
  by: number,
  tags: string[],
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
  hasImmunity: boolean,
): string[] => {
  if (!hasImmunity || tags.includes("kong_immunity")) {
    return tags;
  }

  return [...tags, "kong_immunity"];
};

const updatePlayerGameMoves = async (
  player: Player,
  playerMoves: PlayerGameMoves,
  team?: string,
): Promise<void> => {
  if (team && player.details?.team?.toLowerCase() !== team.toLowerCase()) {
    console.log("Skipping player", player.id, "not on team", team);
    return;
  }

  const currentGameMoves = player.details?.gameMoves || 0;
  const snakesAndLadders = getPlayerSnakesAndLaddersDetails(player);
  const updates: Promise<void>[] = [
    updatePlayer(player.id, {
      ...player.details,
      gameMoves: currentGameMoves + playerMoves.moves,
      snakesAndLadders: {
        ...snakesAndLadders,
        isParticipant: true,
        movesRemaining: snakesAndLadders.movesRemaining + playerMoves.moves,
      },
    }),
  ];

  if (playerMoves.winner && !player.tags.includes("kong_immunity")) {
    updates.push(
      updatePlayerLegacyTags(
        player.id,
        tagsWithKongImmunity(player.tags, true),
      ),
    );
  }

  await Promise.all(updates);
};

const updatedGameIds: string[] = [];

export const savePlayersGameMoves = (
  gameId: string,
  moves: PlayerGameMoves[],
  team?: string,
): Promise<void[]> | Promise<void> => {
  if (updatedGameIds.includes(gameId)) {
    console.log(`Game ${gameId} already updated`, updatedGameIds);
    return Promise.resolve();
  }

  updatedGameIds.push(gameId);

  const promises = moves.map(async (move) => {
    const player = await getPlayer(move.playerId);
    if (!player) {
      throw new Error(`Player with id ${move.playerId} not found`);
    }
    await updatePlayerGameMoves(player, move, team);
  });

  return Promise.all(promises);
};
