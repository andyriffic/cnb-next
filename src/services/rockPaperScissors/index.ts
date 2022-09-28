import { A, O, pipe, R } from "@mobily/ts-belt";
import { RPSCreateGameProps, RPSGame, RPSMoveName, RPSRound } from "./types";

export const createGame = (
  createGameProps: RPSCreateGameProps
): R.Result<RPSGame, string> => {
  return pipe(createGameProps, createBlankGame, addRoundToGame);
};

function createBlankGame(createGameProps: RPSCreateGameProps): R.Ok<RPSGame> {
  return R.Ok({
    playerIds: [...createGameProps.playerIds],
    rounds: [],
  });
}

export const makeMoveForPlayer = (
  playerId: string,
  moveName: RPSMoveName,
  rpsGame: RPSGame
): R.Result<RPSGame, string> => {
  return pipe(
    rpsGame.rounds,
    findPlayersRound(playerId),
    R.map(setPlayersMoveForRound(playerId, moveName)),
    R.map(updateRoundInRounds(rpsGame.rounds)),
    R.map((updatedRounds) => ({ ...rpsGame, rounds: updatedRounds }))
  );
};

export function addRoundToGame(
  rpsGame: R.Result<RPSGame, string>
): R.Result<RPSGame, string> {
  //TODO: validate all current rounds are complete
  return pipe(
    rpsGame,
    R.flatMap((game) =>
      R.Ok({
        ...game,
        rounds: [...game.rounds, { index: game.rounds.length, moves: [] }],
      })
    )
  );
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

    const nextRound = rounds.find(
      (round) => !round.moves.find((move) => move.playerId === playerId)
    );

    return R.fromNullable(
      nextRound,
      `Player "${playerId}" has played all rounds`
    );
  };
}

function validatePlayerOnGame(
  playerId: string
): (rpsGame: RPSGame) => R.Result<string, string> {
  return (rpsGame) =>
    rpsGame.playerIds.includes(playerId)
      ? R.Ok(playerId)
      : R.Error(`Player "${playerId}" not included in game`);
}
