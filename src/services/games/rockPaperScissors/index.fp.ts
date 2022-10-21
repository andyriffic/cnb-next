import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
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

function updateRoundInGame(round: RPSRound, game: RPSGame): RPSGame {
  return {
    ...game,
    rounds: game.rounds.map((r) => (r.index === round.index ? round : r)),
  };
}

function addRoundToGame(game: RPSGame): E.Either<string, RPSGame> {
  return E.of({
    ...game,
    rounds: [...game.rounds, { index: game.rounds.length, moves: [] }],
  });
}
