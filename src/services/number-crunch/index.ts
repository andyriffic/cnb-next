import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { Player } from "../../types/Player";
import { ErrorMessage } from "../../types/common";
import { selectRandomOneOf } from "../../utils/random";
import { NumberCrunchGame, NumberCrunchRound } from "./types";
import {
  getLatestRound,
  validatePlayerHasNotGuessedOnLatestRound,
} from "./validations";

type CreateNumberCrunchGameProps = {
  gameId: string;
  players: Player[];
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
  (players: Player[]): NumberCrunchGame => {
    return {
      id: gameId,
      players: players.map((p) => ({ id: p.id, name: p.name })),
      rounds: [
        {
          range: { low: 1, high: 100 },
          margin: 25,
          playerGuesses: [],
        },
      ],
    };
  };

export const createNumberCrunchGame = ({
  gameId,
  players,
}: CreateNumberCrunchGameProps): E.Either<ErrorMessage, NumberCrunchGame> => {
  return pipe(createGame(gameId)(players), E.right);
};

export const setPlayerGuessOnLatestRound =
  (playerId: string, guess: number) =>
  (game: NumberCrunchGame): E.Either<ErrorMessage, NumberCrunchGame> => {
    return pipe(
      validatePlayerHasNotGuessedOnLatestRound(game, playerId),
      E.chain(getLatestRound),
      E.map(setPlayerGuessOnRound(playerId, guess)),
      E.map(replaceLatestRound(game))
    );
  };

const setPlayerGuessOnRound =
  (playerId: string, guess: number) => (round: NumberCrunchRound) => {
    return {
      ...round,
      playerGuesses: [...round.playerGuesses, { id: playerId, guess }],
    };
  };

function replaceLatestRound(game: NumberCrunchGame) {
  return (round: NumberCrunchRound) => {
    return {
      ...game,
      rounds: [...game.rounds.slice(0, -1), round],
    };
  };
}
