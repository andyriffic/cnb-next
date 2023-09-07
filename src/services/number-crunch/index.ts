import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { ErrorMessage } from "../../types/common";
import { selectRandomOneOf } from "../../utils/random";
import { NumberCrunchGame, NumberCrunchRound } from "./types";
import {
  validatePlayerHasNotGuessed,
  validatePlayerIsMainPlayer,
} from "./validations";

type CreateNumberCrunchGameProps = {
  gameId: string;
  playerIds: string[];
};

type RandomPlayerSelection = {
  chosenPlayerId: string;
  otherPlayerIds: string[];
};

const chooseRandomPlayer = (playerIds: string[]): RandomPlayerSelection => {
  const chosenPlayerId = selectRandomOneOf(playerIds);
  return {
    chosenPlayerId,
    otherPlayerIds: playerIds.filter((id) => id !== chosenPlayerId),
  };
};

const createGame =
  (gameId: string) =>
  (randomPlayerSelection: RandomPlayerSelection): NumberCrunchGame => {
    return {
      id: gameId,
      mainPlayer: {
        id: randomPlayerSelection.chosenPlayerId,
      },
      rounds: [
        {
          range: { low: 0, high: 100 },
          margin: 25,
          guessingPlayers: randomPlayerSelection.otherPlayerIds.map((id) => ({
            id,
            guesses: [],
          })),
        },
      ],
    };
  };

export const createNumberCrunchGame = ({
  gameId,
  playerIds,
}: CreateNumberCrunchGameProps): E.Either<ErrorMessage, NumberCrunchGame> => {
  return pipe(chooseRandomPlayer(playerIds), createGame(gameId), E.right);
};

const updateMainPlayerTarget =
  (target: number) =>
  (game: NumberCrunchGame): NumberCrunchGame => {
    return {
      ...game,
      mainPlayer: {
        ...game.mainPlayer,
        targetNumber: target,
      },
    };
  };

export const setPlayerGuessOnLatestRound =
  (playerId: string, guess: number) =>
  (game: NumberCrunchGame): NumberCrunchGame => {
    return {
      ...game,
      rounds: game.rounds.map((round, index) =>
        index === game.rounds.length - 1
          ? setPlayerGuessOnRound(round)(playerId, guess)
          : round
      ),
    };
  };

export const setPlayerGuessOnRound =
  (round: NumberCrunchRound) =>
  (playerId: string, guess: number): NumberCrunchRound => {
    return {
      ...round,
      guessingPlayers: round.guessingPlayers.map((pg) =>
        pg.id === playerId ? { ...pg, guess } : pg
      ),
    };
  };

export const mainPlayerChooseTarget = (
  game: NumberCrunchGame,
  target: number
): E.Either<ErrorMessage, NumberCrunchGame> => {
  return pipe(
    validatePlayerIsMainPlayer(game, game.mainPlayer.id),
    E.map(updateMainPlayerTarget(target))
  );
};

export const guessingPlayerGuess = (
  game: NumberCrunchGame,
  playerId: string,
  guess: number
): E.Either<ErrorMessage, NumberCrunchGame> => {
  return pipe(
    validatePlayerHasNotGuessed(game, game.mainPlayer.id),
    E.map(setPlayerGuessOnLatestRound(playerId, guess))
  );
};
