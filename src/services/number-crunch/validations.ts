import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import { ErrorMessage } from "../../types/common";
import { NumberCrunchGame, NumberCrunchRound } from "./types";

export const validatePlayerHasNotGuessedOnLatestRound = (
  game: NumberCrunchGame,
  playerId: string
): E.Either<ErrorMessage, NumberCrunchGame> => {
  return pipe(
    getLatestRound(game),
    E.map(playerHasGuessed(playerId)),
    E.fold(
      () => E.left("No latest round"),
      (hasGuessed) =>
        hasGuessed ? E.left("Player has already guessed") : E.right(game)
    )
  );
};

function playerHasGuessed(playerId: string) {
  return (round: NumberCrunchRound) =>
    !!round.playerGuesses.find((g) => g.id === playerId);
}

export const getLatestRound = (
  game: NumberCrunchGame
): E.Either<ErrorMessage, NumberCrunchRound> => {
  const latestRound = game.rounds[game.rounds.length - 1];
  return latestRound ? E.right(latestRound) : E.left("No latest round");
};
