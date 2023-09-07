import * as E from "fp-ts/Either";
import { ErrorMessage } from "../../types/common";
import { NumberCrunchGame, NumberCrunchRound } from "./types";

export const validatePlayerIsMainPlayer = (
  game: NumberCrunchGame,
  playerId: string
): E.Either<ErrorMessage, NumberCrunchGame> => {
  return game.mainPlayer.id === playerId
    ? E.right(game)
    : E.left("Not main player");
};

export const validatePlayerHasNotGuessed = (
  game: NumberCrunchGame,
  playerId: string
): E.Either<ErrorMessage, NumberCrunchGame> => {
  const guess = game.rounds[game.rounds.length - 1]?.guessingPlayers.find(
    (g) => g.id === playerId
  );
  return guess && !guess.guess
    ? E.right(game)
    : E.left("Player already guessed");
};

export const getLatestRound = (
  game: NumberCrunchGame
): E.Either<ErrorMessage, NumberCrunchRound> => {
  const latestRound = game.rounds[game.rounds.length - 1];
  return latestRound ? E.right(latestRound) : E.left("No latest round");
};
