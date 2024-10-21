import { platform } from "os";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { Player } from "../../types/Player";
import { ErrorMessage } from "../../types/common";
import {
  CrazyClimbGame,
  CrazeyClimbGameLevel,
  CrazyClimbGameLevelPlatform,
  CrazyClimbPlayer,
} from "./types";

type createGameProps = {
  id: string;
  players: Player[];
};

export const createGame = ({
  id,
  players,
}: createGameProps): E.Either<ErrorMessage, CrazyClimbGame> => {
  return E.right({
    id,
    players: players.map(createPlayer),
    levels: [createNewGameLevel()],
  });
};

const playerSelectPlatformOnLevel = (
  playerId: string,
  levelIndex: number,
  platformIndex: number,
  game: CrazyClimbGame
) => {
  return pipe(
    getLevel(game, levelIndex),
    E.fromOption(() => "No active level found"),
    E.chain(validatePlayerHasNotSelectedPlatform(playerId)),
    E.fold((d) => O.none, getPlatformOnLevel(platformIndex)),
    O.fold(
      () => E.left("No active platform found"),
      addPlayerToPlatform(playerId, platformIndex)
    )
  );
};

const getLevel = (
  game: CrazyClimbGame,
  levelIndex: number
): O.Option<CrazeyClimbGameLevel> => {
  return O.fromNullable(game.levels[levelIndex]);
};

const getAllPlayerIdsSelectedOnLevel = (
  level: CrazeyClimbGameLevel
): string[] => {
  return level.platforms.flatMap((slot) => slot.playerIds);
};

const createNewGameLevel = (): CrazeyClimbGameLevel => {
  return {
    status: "open",
    platforms: [
      createNewGameLevelSlot(),
      createNewGameLevelSlot(),
      createNewGameLevelSlot(),
      createNewGameLevelSlot(),
    ],
  };
};

const createNewGameLevelSlot = (): CrazyClimbGameLevelPlatform => {
  return {
    state: "waiting",
    playerIds: [],
  };
};

const createPlayer = (player: Player): CrazyClimbPlayer => {
  return {
    id: player.id,
    name: player.name,
  };
};

const getPlatformOnLevel = (
  platformIndex: number
): ((level: CrazeyClimbGameLevel) => O.Option<CrazyClimbGameLevelPlatform>) => {
  return (level) => O.fromNullable(level.platforms[platformIndex]);
};

const addPlayerToPlatform = (playerId: string) => {
  return (platform: CrazyClimbGameLevelPlatform) => {
    return {
      ...platform,
      playerIds: [...platform.playerIds, playerId],
    };
  };
};

// Validations

const validatePlayerHasNotSelectedPlatform =
  (playerId: string) =>
  (
    level: CrazeyClimbGameLevel
  ): E.Either<ErrorMessage, CrazeyClimbGameLevel> => {
    const allPlayerIdsOnActiveLevel = pipe(
      level,
      getAllPlayerIdsSelectedOnLevel
    );

    return allPlayerIdsOnActiveLevel.includes(playerId)
      ? E.left(
          `Player '${playerId}' has already selected a platform on this level`
        )
      : E.right(level);
  };
