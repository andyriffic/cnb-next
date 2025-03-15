import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { Player } from "../../types/Player";
import { ErrorMessage } from "../../types/common";
import { shuffleArrayJestSafe } from "../../utils/array";
import {
  MysteryBox,
  MysteryBoxGame,
  MysteryBoxGameRound,
  MysteryBoxGameWithRound,
  MysteryBoxPlayer,
  MysteryBoxType,
} from "./types";

type createGameProps = {
  id: string;
  players: Player[];
};

export const createGame = ({
  id,
  players,
}: createGameProps): E.Either<ErrorMessage, MysteryBoxGame> => {
  const game = {
    id,
    currentRoundId: 0,
    players: players.map(createPlayer),
    rounds: [createNewGameRound(0)],
  };
  return E.right(game);
};

export const playerSelectBox = (
  playerId: string,
  roundIndex: number,
  boxIndex: number
) => {
  return (game: MysteryBoxGame): E.Either<ErrorMessage, MysteryBoxGame> => {
    return pipe(
      getRound(game, roundIndex),
      E.fromOption(() => `Round with id ${roundIndex} not found`),
      E.chain(validatePlayerHasNotSelectedThisRound(playerId)),
      E.chain(addPlayerToBox(playerId, boxIndex))
      //E.fold(() => )
    );
  };
};

export const getLatestRound = (
  game: MysteryBoxGame
): O.Option<MysteryBoxGameRound> => {
  return O.fromNullable(game.rounds[game.rounds.length - 1]);
};

export const getLatestRoundIndex = (
  game: MysteryBoxGame
): { game: MysteryBoxGame; roundIndex: number } => {
  return { game, roundIndex: game.rounds.length - 1 };
};

const getRound = (
  game: MysteryBoxGame,
  levelIndex: number
): O.Option<MysteryBoxGameWithRound> => {
  const round = game.rounds[levelIndex];
  if (!round) {
    return O.none;
  }
  return O.some({ game, round });
};

const getAllPlayerIdsSelectedOnLevel = (
  level: MysteryBoxGameRound
): string[] => {
  return level.boxes.flatMap((slot) => slot.playerIds);
};

const createNewGameRound = (id: number): MysteryBoxGameRound => {
  const randomOrderBoxes = shuffleArrayJestSafe([
    createMysteryBox(0, "coin"),
    createMysteryBox(1, "empty"),
    createMysteryBox(2, "bomb"),
    createMysteryBox(3, "points"),
  ]);

  return {
    id,
    boxes: randomOrderBoxes,
  };
};

const createMysteryBox = (id: number, type: MysteryBoxType): MysteryBox => {
  return {
    id,
    contents: { type, value: 0 },
    playerIds: [],
  };
};

const createPlayer = (player: Player): MysteryBoxPlayer => {
  return {
    id: player.id,
    name: player.name,
  };
};

const getBoxForRound = (
  boxIndex: number
): ((level: MysteryBoxGameRound) => O.Option<MysteryBox>) => {
  return (level) => O.fromNullable(level.boxes[boxIndex]);
};

const addPlayerToBox = (playerId: string, boxId: number) => {
  return (
    gameWithRound: MysteryBoxGameWithRound
  ): E.Either<ErrorMessage, MysteryBoxGame> => {
    const box = gameWithRound.round.boxes.find((b) => b.id === boxId);

    if (!box) {
      return E.left(`Box with id ${boxId} not found`);
    }

    const updatedBox = {
      ...box,
      playerIds: [...box.playerIds, playerId],
    };

    const updatedRound = updateBoxOnRound(updatedBox, gameWithRound.round);
    const updatedGame = updateRoundOnGame(updatedRound, gameWithRound.game);
    return E.right(updatedGame);
  };
};

// Utility functions

function updateRoundOnGame(
  round: MysteryBoxGameRound,
  game: MysteryBoxGame
): MysteryBoxGame {
  return {
    ...game,
    rounds: game.rounds.map((r) => (r.id === round.id ? round : r)),
  };
}

function updateBoxOnRound(
  box: MysteryBox,
  round: MysteryBoxGameRound
): MysteryBoxGameRound {
  return {
    ...round,
    boxes: round.boxes.map((b) => (b.id === box.id ? box : b)),
  };
}

// Validations

const validatePlayerHasNotSelectedThisRound =
  (playerId: string) =>
  ({
    game,
    round,
  }: MysteryBoxGameWithRound): E.Either<
    ErrorMessage,
    MysteryBoxGameWithRound
  > => {
    const allPlayerIdsOnActiveLevel = pipe(
      round,
      getAllPlayerIdsSelectedOnLevel
    );

    return allPlayerIdsOnActiveLevel.includes(playerId)
      ? E.left(`Player '${playerId}' has already selected a box for this round`)
      : E.right({ game, round });
  };
