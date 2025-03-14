import { platform } from "os";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { Player } from "../../types/Player";
import { ErrorMessage } from "../../types/common";
import {
  MysteryBoxGame,
  MysteryBoxGameRound,
  MysteryBox,
  MysteryBoxPlayer,
} from "./types";

type createGameProps = {
  id: string;
  players: Player[];
};

export const createGame = ({
  id,
  players,
}: createGameProps): E.Either<ErrorMessage, MysteryBoxGame> => {
  return E.right({
    id,
    players: players.map(createPlayer),
    rounds: [createNewGameLevel()],
  });
};

const playerSelectBox = (
  playerId: string,
  roundIndex: number,
  boxIndex: number,
  game: MysteryBoxGame
) => {
  return pipe(
    getRound(game, roundIndex),
    E.fromOption(() => "No active round found"),
    E.chain(validatePlayerHasNotSelectedPlatform(playerId)),
    E.fold((d) => O.none, getPlatformOnLevel(boxIndex)),
    O.map(addPlayerToPlatform(playerId, boxIndex))
  );
};

const getRound = (
  game: MysteryBoxGame,
  levelIndex: number
): O.Option<MysteryBoxGameRound> => {
  return O.fromNullable(game.rounds[levelIndex]);
};

const getAllPlayerIdsSelectedOnLevel = (
  level: MysteryBoxGameRound
): string[] => {
  return level.boxes.flatMap((slot) => slot.playerIds);
};

const createNewGameLevel = (): MysteryBoxGameRound => {
  return {
    boxes: [
      createMysteryBox(),
      createMysteryBox(),
      createMysteryBox(),
      createMysteryBox(),
    ],
  };
};

const createMysteryBox = (): MysteryBox => {
  return {
    contents: {},
    playerIds: [],
  };
};

const createPlayer = (player: Player): MysteryBoxPlayer => {
  return {
    id: player.id,
    name: player.name,
  };
};

const getPlatformOnLevel = (
  platformIndex: number
): ((level: MysteryBoxGameRound) => O.Option<MysteryBox>) => {
  return (level) => O.fromNullable(level.boxes[platformIndex]);
};

const addPlayerToPlatform = (playerId: string, platformIndex: number) => {
  return (platform: MysteryBox) => {
    return {
      ...platform,
      playerIds: [...platform.playerIds, playerId],
    };
  };
};

// Validations

const validatePlayerHasNotSelectedPlatform =
  (playerId: string) =>
  (level: MysteryBoxGameRound): E.Either<ErrorMessage, MysteryBoxGameRound> => {
    const allPlayerIdsOnActiveLevel = pipe(
      level,
      getAllPlayerIdsSelectedOnLevel
    );

    return allPlayerIdsOnActiveLevel.includes(playerId)
      ? E.left(`Player '${playerId}' has already selected a box for this round`)
      : E.right(level);
  };
