import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { Player } from "../../types/Player";
import { ErrorMessage } from "../../types/common";
import {
  MysteryMountainGame,
  MysteryMountainGameLevel,
  MysteryMountainGameLevelSlot,
  MysteryMountainPlayer,
} from "./types";

export const createMysteryMountainGame = (
  players: Player[],
  generateId: () => string
): E.Either<ErrorMessage, MysteryMountainGame> => {
  return E.right({
    id: generateId(),
    players: players.map(createMysteryMountainPlayer),
    levels: [createNewMysteryMountainGameLevel()],
  });
};

const playerSelectSlotOnActiveLevel = (
  playerId: string,
  game: MysteryMountainGame
) => {
  return pipe(
    getActiveLevel(game),
    E.fromOption(() => "No active level found"),
    E.chain(validatePlayerHasNotSelectedSlot(playerId)),
    E.map((level) => {})
  );
};

const getActiveLevel = (
  game: MysteryMountainGame
): O.Option<MysteryMountainGameLevel> => {
  return O.fromNullable(game.levels.find((level) => level.active));
};

const validatePlayerHasNotSelectedSlot =
  (playerId: string) =>
  (
    level: MysteryMountainGameLevel
  ): E.Either<ErrorMessage, MysteryMountainGameLevel> => {
    const allPlayerIdsOnActiveLevel = pipe(
      level,
      getAllPlayerIdsSelectedOnLevel
    );

    return allPlayerIdsOnActiveLevel.includes(playerId)
      ? E.left("Player has already selected a slot")
      : E.right(level);
  };

const getAllPlayerIdsSelectedOnLevel = (
  level: MysteryMountainGameLevel
): string[] => {
  return level.slots.flatMap((slot) => slot.playerIds);
};

const createNewMysteryMountainGameLevel = (): MysteryMountainGameLevel => {
  return {
    active: true,
    slots: [
      createNewMysteryMountainGameLevelSlot(),
      createNewMysteryMountainGameLevelSlot(),
      createNewMysteryMountainGameLevelSlot(),
      createNewMysteryMountainGameLevelSlot(),
    ],
  };
};

const createNewMysteryMountainGameLevelSlot =
  (): MysteryMountainGameLevelSlot => {
    return {
      state: "waiting",
      playerIds: [],
    };
  };

const createMysteryMountainPlayer = (player: Player): MysteryMountainPlayer => {
  return {
    id: player.id,
    name: player.name,
  };
};
