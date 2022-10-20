import { A, O, pipe, R } from "@mobily/ts-belt";
import {
  RPSCreateGameProps,
  RPSGame,
  RPSMoveName,
  RPSRound,
  RPSRoundResult,
} from "./types";

export const createGame = (
  createGameProps: RPSCreateGameProps
): R.Result<RPSGame, string> => {
  return pipe(createGameProps, createBlankGame, R.flatMap(addRoundToGame));
};

function createBlankGame(createGameProps: RPSCreateGameProps): R.Ok<RPSGame> {
  return R.Ok({
    playerIds: [...createGameProps.playerIds],
    rounds: [],
  });
}

export const makeMoveForPlayer = (
  playerId: string,
  moveName: RPSMoveName
): ((rpsGame: RPSGame) => R.Result<RPSGame, string>) => {
  return (rpsGame) =>
    pipe(
      rpsGame,
      validatePlayerOnGame(playerId),
      R.map((game) => game.rounds),
      R.flatMap(findPlayersRound(playerId)),
      R.map(setPlayersMoveForRound(playerId, moveName)),
      R.map(updateRoundInRounds(rpsGame.rounds)),
      R.map((updatedRounds) => ({ ...rpsGame, rounds: updatedRounds }))
    );
};

export const resolveLastRound = (
  rpsGame: RPSGame
): R.Result<RPSGame, string> => {
  return pipe(
    rpsGame.rounds,
    A.last,
    O.toResult("No last round"),
    R.flatMap(resolveRound),
    R.map(updateRoundInRounds(rpsGame.rounds)),
    R.map((r) => ({ ...rpsGame, r }))
  );
};

function resolveRound(round: RPSRound): R.Result<RPSRound, string> {
  // return pipe(
  //   round,
  //   R.match((r) => r.moves.length === 2 )
  // );

  //TODO: determine result

  return R.Ok({ ...round, result: { draw: true } });
}

// function getResultForRound(
//   round: O.Option<RPSRound>
// ): R.Result<RPSRound, string> {
//   return pipe(round, validateBothPlayersMoved);
// }

export function addRoundToGame(rpsGame: RPSGame): R.Result<RPSGame, string> {
  return pipe(
    R.Ok(rpsGame),
    R.flatMap(canCreateNewRound),
    R.flatMap(() =>
      R.Ok({
        ...rpsGame,
        rounds: [
          ...rpsGame.rounds,
          { index: rpsGame.rounds.length, moves: [] },
        ],
      })
    )
  );
}

function canCreateNewRound(rpsGame: RPSGame): R.Result<RPSGame, string> {
  // return pipe(
  //   rpsGame.rounds,
  //   A.last,
  //   O.match(
  //     (round) =>
  //       pipe(
  //         R.Ok(round),
  //         R.flatMap(validateRoundIsComplete),
  //         R.match(
  //           () => R.fromNullable(rpsGame, ""),
  //           (error) => R.fromNullable(null, error)
  //         )
  //       ),
  //     () => R.Ok(rpsGame)
  //   )
  // );
  return pipe(
    rpsGame.rounds,
    A.last,
    O.match(
      (round) =>
        round.moves.length === 2
          ? R.Ok(rpsGame)
          : R.Error("Not all moves made on current round"),
      () => R.Ok(rpsGame)
    )
  );
}

function validateRoundIsComplete(round: RPSRound): R.Result<RPSRound, string> {
  return pipe(
    R.fromNullable(round, "must have a round!"),
    R.flatMap(validateBothPlayersMoved),
    R.flatMap(validateRoundHasResult)
  );
}

function validateBothPlayersMoved(round: RPSRound): R.Result<RPSRound, string> {
  return round.moves.length === 2
    ? R.Ok(round)
    : R.Error("Not all moves made on current round");
}

function validateRoundHasResult(round: RPSRound): R.Result<RPSRound, string> {
  return !!round.result
    ? R.Ok(round)
    : R.Error("Current round is not resolved");
}

function setPlayersMoveForRound(
  playerId: string,
  moveName: RPSMoveName
): (round: RPSRound) => RPSRound {
  return (round) => {
    return { ...round, moves: [...round.moves, { playerId, moveName }] };
  };
}

function updateRoundInRounds(
  rounds: RPSRound[]
): (updatedRound: RPSRound) => RPSRound[] {
  return (updatedRound) =>
    rounds.map((round) =>
      round.index === updatedRound.index ? updatedRound : round
    );
}

function findPlayersRound(
  playerId: string
): (rounds: RPSRound[]) => R.Result<RPSRound, string> {
  return (rounds) => {
    return pipe(
      rounds,
      A.last,
      O.flatMap((lastRound) =>
        lastRound.moves.find((m) => m.playerId === playerId)
          ? O.None
          : O.Some(lastRound)
      ),
      O.toResult(`Player "${playerId}" has already played last round`)
    );
  };
}

function validatePlayerOnGame(
  playerId: string
): (rpsGame: RPSGame) => R.Result<RPSGame, string> {
  return (rpsGame) =>
    rpsGame.playerIds.includes(playerId)
      ? R.Ok(rpsGame)
      : R.Error(`Player "${playerId}" not included in game`);
}
