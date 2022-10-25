import * as E from "fp-ts/Either";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { RPSCreateGameProps, RPSGame, RPSPlayerMove, RPSRound } from "./types";

export function createGame(
  props: RPSCreateGameProps
): E.Either<string, RPSGame> {
  const newGame: RPSGame = { playerIds: [...props.playerIds], rounds: [] };
  return pipe(newGame, addRoundToGame);
}

export function makePlayerMove(
  move: RPSPlayerMove,
  game: RPSGame
): E.Either<string, RPSGame> {
  return pipe(
    validatePlayerInGame(move.playerId, game),
    E.match(
      (e) => E.left(e),
      (g) =>
        pipe(
          g.rounds,
          A.last,
          E.fromOption(() => "no last round"),
          E.chain((lastRound) =>
            validatePlayerNotMovedInRound(move.playerId, lastRound)
          ),
          E.map((lastRound) => addMoveToRound(lastRound, move)),
          E.map((roundWithMove) => updateRoundInGame(roundWithMove, game))
        )
    )
  );
}

export function resolveRound(game: RPSGame): E.Either<string, RPSGame> {
  return pipe(
    game.rounds,
    A.last,
    E.fromOption(() => "No round to resolve"),
    E.chain(validateRoundCanBeResolved),
    E.chain(addResultToRound),
    E.map((round) => updateRoundInGame(round, game))
  );
}

function addResultToRound(
  validatedRound: RPSRound
): E.Either<string, RPSRound> {
  const p1Move = validatedRound.moves[0]!;
  const p2Move = validatedRound.moves[1]!;

  if (p1Move.moveName === p2Move.moveName) {
    return E.right({ ...validatedRound, result: { draw: true } });
  }

  switch (p1Move.moveName) {
    case "rock":
      return p2Move.moveName === "scissors"
        ? E.right({
            ...validatedRound,
            result: { draw: false, winningPlayerId: p1Move.playerId },
          })
        : E.right({
            ...validatedRound,
            result: { draw: false, winningPlayerId: p2Move.playerId },
          });
    case "paper":
      return p2Move.moveName === "rock"
        ? E.right({
            ...validatedRound,
            result: { draw: false, winningPlayerId: p1Move.playerId },
          })
        : E.right({
            ...validatedRound,
            result: { draw: false, winningPlayerId: p2Move.playerId },
          });
    case "scissors":
      return p2Move.moveName === "paper"
        ? E.right({
            ...validatedRound,
            result: { draw: false, winningPlayerId: p1Move.playerId },
          })
        : E.right({
            ...validatedRound,
            result: { draw: false, winningPlayerId: p2Move.playerId },
          });
  }
}

function validateRoundCanBeResolved(
  round: RPSRound
): E.Either<string, RPSRound> {
  if (round.moves.length < 2) {
    return E.left("Not all players have moved");
  }

  if (round.result) {
    return E.left("Round already has a result");
  }

  return E.right(round);
}

function validatePlayerInGame(
  playerId: string,
  game: RPSGame
): E.Either<string, RPSGame> {
  return game.playerIds.includes(playerId)
    ? E.right(game)
    : E.left(`Player "${playerId}" is not in this game`);
}

function validatePlayerNotMovedInRound(
  playerId: string,
  round: RPSRound
): E.Either<string, RPSRound> {
  return !round.moves.find((m) => m.playerId === playerId)
    ? E.right(round)
    : E.left(`Player "${playerId}" has already moved this round`);
}

function addMoveToRound(round: RPSRound, move: RPSPlayerMove): RPSRound {
  return { ...round, moves: [...round.moves, move] };
}

function updateRoundInGame(updatedRound: RPSRound, game: RPSGame): RPSGame {
  return {
    ...game,
    rounds: game.rounds.map((r) =>
      r.index === updatedRound.index ? updatedRound : r
    ),
  };
}

function addRoundToGame(game: RPSGame): E.Either<string, RPSGame> {
  return E.of({
    ...game,
    rounds: [...game.rounds, { index: game.rounds.length, moves: [] }],
  });
}
