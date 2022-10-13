import { A, O, pipe, R } from "@mobily/ts-belt";
import { RPSCreateGameProps, RPSGame, RPSMoveName, RPSRound } from "./types";

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

// export const resolveCurrentRound = (
//   rpsGame: RPSGame
// ): R.Result<RPSGame, string> => {
//   return pipe(rpsGame.rounds, A.last);
// };

// function getResultForRound(
//   round: O.Option<RPSRound>
// ): R.Result<RPSRound, string> {
//   return pipe(round, validateBothPlayersMoved);
// }

export function addRoundToGame(rpsGame: RPSGame): R.Result<RPSGame, string> {
  return pipe(
    rpsGame,
    canCreateNewRound,
    R.flatMap((game) =>
      R.Ok({
        ...game,
        rounds: [...game.rounds, { index: game.rounds.length, moves: [] }],
      })
    )
  );
}

function canCreateNewRound(rpsGame: RPSGame): R.Result<RPSGame, string> {
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

  // return pipe(
  //   rpsGame.rounds,
  //   A.last,
  //   O.map(validateBothPlayersMoved),
  //   O.toResult()
  // );
}

function validateBothPlayersMoved(round: RPSRound): R.Result<RPSRound, string> {
  return round.moves.length === 2
    ? R.Ok(round)
    : R.Error("Not all moves made on current round");
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
