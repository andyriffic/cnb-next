import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { getPlayerAvailableCoins, Player } from "../../types/Player";
import { ErrorMessage } from "../../types/common";
import { selectRandomOneOf } from "../../utils/random";
import {
  NumberCrunchFinalResultsView,
  NumberCrunchFinalRoundSummaryView,
  NumberCrunchGame,
  NumberCrunchGameView,
  NumberCrunchGuessResultRangeIndicator,
  NumberCrunchPlayerView,
  NumberCrunchRound,
  NumberCrunchRoundView,
} from "./types";
import {
  getLatestRound,
  validateLatestRoundIsComplete,
  validatePlayerHasNotGuessedOnLatestRound,
} from "./validations";

type CreateNumberCrunchGameProps = {
  gameId: string;
  players: Player[];
  getTarget: () => number;
};

type RandomPlayerSelection = {
  chosenPlayerId: string;
  otherPlayerIds: string[];
};

export type NumberCrunchBucketRange = {
  from: number;
  to: number;
  title: string;
  color: string;
  points: number;
};

export const NUMBER_CRUNCH_BUCKET_RANGES: NumberCrunchBucketRange[] = [
  { from: 0, to: 0, title: "Spot on!", color: "#00FF00", points: 6 },
  { from: 1, to: 5, title: "Within 5", color: "#009900", points: 4 },
  { from: 6, to: 10, title: "Within 10", color: "#FFFF00", points: 3 },
  { from: 11, to: 30, title: "Within 30", color: "#FFCC66", points: 2 },
  { from: 31, to: 50, title: "Within 50", color: "#FF6600", points: 1 },
  { from: 51, to: 100, title: "Over 50", color: "#FF3300", points: 0 },
];

export const getNumberCrunchRangeBucketIndex = (offBy: number): number => {
  return NUMBER_CRUNCH_BUCKET_RANGES.findIndex((bucket) => {
    return offBy >= bucket.from && offBy <= bucket.to;
  });
};

const createEmptyRound = (): NumberCrunchRound => ({
  range: { low: 1, high: 100 },
  playerGuesses: [],
});

const chooseRandomPlayer = (playerIds: string[]): RandomPlayerSelection => {
  const chosenPlayerId = selectRandomOneOf(playerIds);
  return {
    chosenPlayerId,
    otherPlayerIds: playerIds.filter((id) => id !== chosenPlayerId),
  };
};

const createGame =
  (gameId: string, getTarget: () => number) =>
  (players: Player[]): NumberCrunchGame => {
    return {
      id: gameId,
      target: getTarget(),
      players: players.map((p) => ({
        id: p.id,
        name: p.name,
        advantage: getPlayerAvailableCoins(p) > 0,
      })),
      rounds: [createEmptyRound()],
    };
  };

export const createNumberCrunchGame = ({
  gameId,
  players,
  getTarget,
}: CreateNumberCrunchGameProps): E.Either<ErrorMessage, NumberCrunchGame> => {
  return pipe(createGame(gameId, getTarget)(players), E.right);
};

export const setPlayerGuessOnLatestRound =
  (playerId: string, guess: number) =>
  (game: NumberCrunchGame): E.Either<ErrorMessage, NumberCrunchGame> => {
    return pipe(
      validatePlayerHasNotGuessedOnLatestRound(game, playerId),
      E.chain(getLatestRound),
      E.map(setPlayerGuessOnRound(playerId, guess, game.target)),
      E.map(replaceLatestRound(game))
    );
  };

const setPlayerGuessOnRound =
  (playerId: string, guess: number, target: number) =>
  (round: NumberCrunchRound) => {
    return {
      ...round,
      playerGuesses: [
        ...round.playerGuesses,
        {
          id: playerId,
          guess,
          offBy: Math.abs(target - guess),
        },
      ],
    };
  };

function getPlayerHintText(advantage: boolean, target: number) {
  if (!advantage) {
    return;
  }
  return target < 50 ? "It's < 50 🤫" : "It's >= 50 🤫";
}

function replaceLatestRound(game: NumberCrunchGame) {
  return (round: NumberCrunchRound) => {
    return {
      ...game,
      rounds: [...game.rounds.slice(0, -1), round],
    };
  };
}

function addRoundToGame(game: NumberCrunchGame): NumberCrunchGame {
  return {
    ...game,
    rounds: [...game.rounds, createEmptyRound()],
  };
}

export function newRound(
  game: NumberCrunchGame
): E.Either<ErrorMessage, NumberCrunchGame> {
  return pipe(validateLatestRoundIsComplete(game), E.map(addRoundToGame));
}

function createRoundView(
  game: NumberCrunchGame,
  round: NumberCrunchRound,
  roundNumber: number
): NumberCrunchRoundView {
  return {
    roundNumber,
    range: round.range,
    allPlayersGuessed: game.players.length === round.playerGuesses.length,
    playerGuesses: round.playerGuesses.map((pg) => ({
      playerId: pg.id,
      bucketRangeIndex: getNumberCrunchRangeBucketIndex(pg.offBy),
      guess: pg.guess,
    })),
  };
}

export function createGameView(
  game: NumberCrunchGame
): E.Either<ErrorMessage, NumberCrunchGameView> {
  const allGuessedNumbers = Array.from(
    new Set(
      game.rounds.map((r) => r.playerGuesses.map((pg) => pg.guess)).flat()
    )
  );
  return pipe(
    getLatestRound(game),
    E.map((round) => {
      const playerViews = game.players.map<NumberCrunchPlayerView>((p) => ({
        ...p,
        guessedThisRound: round.playerGuesses.some((pg) => pg.id === p.id),
        extraHint: getPlayerHintText(p.advantage, game.target),
      }));

      return {
        id: game.id,
        roundNumber: game.rounds.length,
        players: playerViews,
        previousRounds: game.rounds
          .slice(0, -1)
          .map((r, i) => createRoundView(game, r, i + 1)),
        currentRound: createRoundView(game, round, game.rounds.length),
        finalResults: createFinalResultsView(game, round),
        guessedNumbers: allGuessedNumbers,
        guessedInFirstRound: game.rounds.length === 1 && hasCorrectGuess(round),
      };
    })
  );
}

function hasCorrectGuess(round: NumberCrunchRound): boolean {
  return round.playerGuesses.some((pg) => pg.offBy === 0);
}

function createFinalResultsView(
  game: NumberCrunchGame,
  latestRound: NumberCrunchRound
): NumberCrunchFinalResultsView | undefined {
  const winningPlayers = latestRound.playerGuesses.filter(
    (pg) => getNumberCrunchRangeBucketIndex(pg.offBy) === 0
  );

  const allPlayersGuessed =
    game.players.length === latestRound.playerGuesses.length;

  if (!(winningPlayers.length && allPlayersGuessed)) {
    return;
  }

  return {
    winningPlayerIds: winningPlayers.map((pg) => pg.id),
    target: game.target,
    allRounds: game.rounds.map((round) => {
      return {
        playerGuesses: round.playerGuesses.map((pg) => {
          return {
            playerId: pg.id,
            guess: pg.guess,
            // bucketRangeIndex: getNumberCrunchRangeBucketIndex(pg.offBy),
          };
        }),
      };
    }),
    finalRoundSummary: createFinalRoundSummary(game, latestRound),
  };
}

function createFinalRoundSummary(
  game: NumberCrunchGame,
  latestRound: NumberCrunchRound
): NumberCrunchFinalRoundSummaryView[] {
  const allGuessedNumbers = Array.from(
    new Set(latestRound.playerGuesses.map((pg) => pg.guess))
  ).sort((a, b) => b - a);

  return allGuessedNumbers.map((guessNumber) => {
    return {
      guess: guessNumber,
      playerIds: latestRound.playerGuesses
        .filter((pg) => pg.guess === guessNumber)
        .map((pg) => pg.id),
      bucketRangeIndex: getNumberCrunchRangeBucketIndex(
        Math.abs(game.target - guessNumber)
      ),
    };
  });
}
