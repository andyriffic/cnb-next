import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { getPlayerAvailableCoins, Player } from "../../types/Player";
import { ErrorMessage } from "../../types/common";
import { shuffleArrayJestSafe } from "../../utils/array";
import {
  MysteryBox,
  MysteryBoxCreator,
  MysteryBoxGame,
  MysteryBoxGameRound,
  MysteryBoxGameWithRound,
  MysteryBoxPlayer,
  MysteryBoxContentsType,
  MysteryBoxGameView,
  MysteryBoxPlayerView,
  MysteryBoxPlayerStatus,
  MysteryBoxGameRoundView,
  MysteryBoxContents,
  MysteryBoxGameOverSummary,
} from "./types";

type createGameProps = {
  id: string;
  players: Player[];
  mysteryBoxCreator?: (id: number) => {
    boxes: MysteryBox[];
    specialInfo?: string;
  };
};

export const createMysteryBoxGame = ({
  id,
  players,
  mysteryBoxCreator = randomBoxCreator,
}: createGameProps): E.Either<ErrorMessage, MysteryBoxGame> => {
  const game = {
    id,
    currentRoundId: 0,
    players: players.map(createPlayer),
    rounds: [createNewGameRound(0, mysteryBoxCreator)],
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
      game,
      validatePlayerIsNotEliminated(playerId),
      E.chain(getRound(roundIndex)),
      E.chain(validatePlayerHasNotSelectedThisRound(playerId)),
      E.chain(addPlayerToBox(playerId, boxIndex))
    );
  };
};

export const newRound = (
  game: MysteryBoxGame
): E.Either<ErrorMessage, MysteryBoxGame> => {
  return pipe(
    game,
    validatePlayersRemainingInGame,
    E.chain(validateGameHasNoWinner),
    E.chain(validateAllPlayersHaveSelectedBoxOnCurrentRound),
    E.chain(addNewRoundToGame)
  );
};

function eliminatePlayersOnCurrentRound() {}

function addNewRoundToGame(
  game: MysteryBoxGame,
  mysteryBoxCreator: MysteryBoxCreator = randomBoxCreator
): E.Either<ErrorMessage, MysteryBoxGame> {
  const newRound = createNewGameRound(game.rounds.length, mysteryBoxCreator);
  const updatedGame: MysteryBoxGame = {
    ...game,
    currentRoundId: newRound.id,
    rounds: [...game.rounds, newRound],
  };
  return E.right(updatedGame);
}

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
  levelIndex: number
): ((
  game: MysteryBoxGame
) => E.Either<ErrorMessage, MysteryBoxGameWithRound>) => {
  return (game) => {
    const round = game.rounds[levelIndex];
    if (!round) {
      return E.left(`Round with id ${levelIndex} not found`);
    }
    return E.right({ game, round });
  };
};

const getAllPlayerIdsSelectedOnLevel = (
  level: MysteryBoxGameRound
): string[] => {
  return level.boxes.flatMap((slot) => slot.playerIds);
};

function getCustomRoundBoxContents(roundNumber: number): {
  boxes: MysteryBoxContents[];
  specialInfo?: string;
} {
  switch (roundNumber) {
    case 0: {
      return {
        specialInfo: "Free round - no bombs!",
        boxes: [
          createBoxContents("points", 1),
          createBoxContents("points", 2),
          createBoxContents("empty"),
          createBoxContents("empty"),
        ],
      };
    }
    case 4: {
      return {
        specialInfo: "2 bombs this round! - choose wisely!",
        boxes: [
          createBoxContents("bomb"),
          createBoxContents("bomb"),
          createBoxContents("points", 1),
          createBoxContents("empty"),
        ],
      };
    }

    case 10: {
      return {
        specialInfo: "3 bombs this round! 💀",
        boxes: [
          createBoxContents("bomb"),
          createBoxContents("bomb"),
          createBoxContents("points", 2),
          createBoxContents("bomb"),
        ],
      };
    }

    default: {
      return {
        boxes: [
          createBoxContents("bomb"),
          createBoxContents("points", 1),
          createBoxContents("points", 2),
          createBoxContents("empty"),
        ],
      };
    }
  }
}

const randomBoxCreator = (
  roundId: number
): { boxes: MysteryBox[]; specialInfo?: string } => {
  const roundWithBoxes = getCustomRoundBoxContents(roundId);
  const randomBoxContents = shuffleArrayJestSafe(roundWithBoxes.boxes);

  return {
    specialInfo: roundWithBoxes.specialInfo,
    boxes: [
      createMysteryBox(0, randomBoxContents[0]!),
      createMysteryBox(1, randomBoxContents[1]!),
      createMysteryBox(2, randomBoxContents[2]!),
      createMysteryBox(3, randomBoxContents[3]!),
    ],
  };
};

export const createBoxContents = (
  contentsType: MysteryBoxContentsType,
  value?: number
): MysteryBoxContents => {
  switch (contentsType) {
    case "coin":
      return { type: "coin", value: value ?? 0 };
    case "empty":
      return { type: "empty", value: value ?? 0 };
    case "bomb":
      return { type: "bomb", value: value ?? 0 };
    case "points":
      return { type: "points", value: value ?? 0 };
    default:
      throw new Error("Invalid box contents type");
  }
};

const createNewGameRound = (
  id: number,
  mysteryBoxCreator: MysteryBoxCreator
): MysteryBoxGameRound => {
  const boxContents = mysteryBoxCreator(id);
  return {
    id,
    specialInfo: boxContents.specialInfo,
    boxes: boxContents.boxes,
  };
};

export const createMysteryBox = (
  id: number,
  contents: MysteryBoxContents
): MysteryBox => {
  return {
    id,
    isOpen: false,
    contents,
    playerIds: [],
  };
};

const createPlayer = (player: Player): MysteryBoxPlayer => {
  return {
    id: player.id,
    name: player.name,
    advantage: getPlayerAvailableCoins(player) > 0,
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

function getAllEliminatedPlayerIds(game: MysteryBoxGame): string[] {
  const allExplodedBoxes = game.rounds.flatMap((round) =>
    round.boxes.filter((box) => box.contents.type === "bomb")
  );

  const eliminatedPlayers = allExplodedBoxes.flatMap((box) => box.playerIds);
  return eliminatedPlayers;
}

function getAllActivePlayerIds(game: MysteryBoxGame): string[] {
  const eliminatedPlayerIds = getAllEliminatedPlayerIds(game);
  return game.players
    .filter((player) => !eliminatedPlayerIds.includes(player.id))
    .map((player) => player.id);
}

function isPlayerEliminated(playerId: string, game: MysteryBoxGame): boolean {
  return getAllEliminatedPlayerIds(game).includes(playerId);
}

// Validations

const validatePlayerIsNotEliminated = (
  playerId: string
): ((game: MysteryBoxGame) => E.Either<ErrorMessage, MysteryBoxGame>) => {
  return (game) =>
    getAllEliminatedPlayerIds(game).includes(playerId)
      ? E.left(`Player '${playerId}' is already eliminated`)
      : E.right(game);
};

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

const validatePlayersRemainingInGame = (
  game: MysteryBoxGame
): E.Either<ErrorMessage, MysteryBoxGame> => {
  if (getAllEliminatedPlayerIds(game).length === game.players.length) {
    return E.left("All players have been eliminated");
  }

  return E.right(game);
};

const validateGameHasNoWinner = (
  game: MysteryBoxGame
): E.Either<ErrorMessage, MysteryBoxGame> => {
  if (getAllActivePlayerIds(game).length === 1) {
    return E.left("Game already has a winner");
  }

  return E.right(game);
};

const haveAllPlayersSelectedBoxOnRound = (
  round: MysteryBoxGameRound,
  game: MysteryBoxGame
): { valid: boolean; unselectedPlayers: string[] } => {
  const allPlayersSelectedBoxOnRound = round.boxes.flatMap(
    (box) => box.playerIds
  );
  const allActivePlayers = getAllActivePlayerIds(game);

  const unselectedPlayers = allActivePlayers.filter(
    (p) => !allPlayersSelectedBoxOnRound.includes(p)
  );

  return {
    valid: unselectedPlayers.length === 0,
    unselectedPlayers,
  };
};

const validateAllPlayersHaveSelectedBoxOnCurrentRound = (
  game: MysteryBoxGame
): E.Either<ErrorMessage, MysteryBoxGame> => {
  return pipe(
    getLatestRound(game),
    O.fold(
      () => E.left("No active round found"),
      (round) => {
        const result = haveAllPlayersSelectedBoxOnRound(round, game);
        return result.valid
          ? E.right(game)
          : E.left(
              `Players ${result.unselectedPlayers.join(
                ","
              )} have not selected a box`
            );
      }
    )
  );
};

function createGameOverSummary(
  game: MysteryBoxGame
): MysteryBoxGameOverSummary | undefined {
  const allActivePlayers = getAllActivePlayerIds(game);

  if (allActivePlayers.length > 1) {
    // Game still going
    return;
  }

  if (allActivePlayers.length === 0) {
    // No one won 😢
    return {
      maxRoundId: game.currentRoundId,
      bonusPointsAwarded: 0,
    };
  } else if (allActivePlayers.length === 1) {
    // One winner 🎉
    return {
      outrightWinnerPlayerId: allActivePlayers[0],
      maxRoundId: game.currentRoundId,
      bonusPointsAwarded: 5,
    };
  }
}

export function createMysteryBoxGameView(
  game: MysteryBoxGame
): MysteryBoxGameView {
  const currentRound = game.rounds.find(
    (round) => round.id === game.currentRoundId
  )!;

  const gameOverSummary = createGameOverSummary(game);

  return {
    id: game.id,
    players: game.players.map((p) =>
      createPlayerView(p, currentRound, game, gameOverSummary)
    ),
    currentRound: createMysteryBoxRoundView(currentRound, game),
    previousRounds: game.rounds
      .filter((round) => !!gameOverSummary || round.id < game.currentRoundId)
      .map((r) => createMysteryBoxRoundView(r, game)),
    gameOverSummary,
  };
}

function createMysteryBoxRoundView(
  round: MysteryBoxGameRound,
  game: MysteryBoxGame
): MysteryBoxGameRoundView {
  const allPlayersSelectedBoxResult = haveAllPlayersSelectedBoxOnRound(
    round,
    game
  );
  return {
    id: round.id,
    specialInfo: round.specialInfo,
    status:
      round.id !== game.currentRoundId
        ? "complete"
        : allPlayersSelectedBoxResult.valid
        ? "ready"
        : "in-progress",
    boxes: round.boxes.map((box) => ({
      ...box,
      playerIds: box.playerIds,
    })),
  };
}

function createPlayerView(
  player: MysteryBoxPlayer,
  currentRound: MysteryBoxGameRound,
  game: MysteryBoxGame,
  gameOverSummary: MysteryBoxGameOverSummary | undefined
): MysteryBoxPlayerView {
  const selectedBox = currentRound.boxes.find((box) =>
    box.playerIds.includes(player.id)
  );

  const chosenBoxContentsInPreviousRounds = game.rounds
    .filter((round) => round.id < currentRound.id)
    .flatMap((round) => round.boxes)
    .filter((box) => box.playerIds.includes(player.id))
    .map((box) => box.contents);

  const lootTotalsSoFar = chosenBoxContentsInPreviousRounds.reduce(
    (acc, content) => {
      const existing = acc[content.type];
      if (existing) {
        existing.total += content.value;
      } else {
        acc[content.type] = {
          title: content.type,
          total: content.value,
        };
      }
      return acc;
    },
    {} as { [key in MysteryBoxContentsType]: { title: string; total: number } }
  );

  return {
    id: player.id,
    name: player.name,
    status: getPlayerStatus(player.id, selectedBox, game, gameOverSummary),
    lootTotals: lootTotalsSoFar,
    currentlySelectedBoxId: selectedBox ? selectedBox.id : undefined,
    // eliminatedRoundId: undefined,
    advantage: player.advantage,
  };
}

function getPlayerStatus(
  playerId: string,
  currentlySelectedBox: MysteryBox | undefined,
  game: MysteryBoxGame,
  gameOverSummary: MysteryBoxGameOverSummary | undefined
): MysteryBoxPlayerStatus {
  if (gameOverSummary && gameOverSummary.outrightWinnerPlayerId === playerId) {
    return "winner";
  }

  if (currentlySelectedBox) {
    return "selected";
  }

  if (isPlayerEliminated(playerId, game)) {
    return "eliminated";
  }

  return "waiting";
}
