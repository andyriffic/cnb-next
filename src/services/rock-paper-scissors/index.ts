import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import {
  RPSCreateGameProps,
  RPSGame,
  RPSPlayerMove,
  RPSRound,
  RPSSpectatorGameView,
  RPSSpectatorRoundView,
} from "./types";

const DRAW_BONUS_POINTS = 2;

export function createGame(
  props: RPSCreateGameProps
): E.Either<string, RPSGame> {
  //TODO: could probably validate there's enough players 🤷‍♂️
  const newGame: RPSGame = {
    id: props.id,
    players: [...props.players],
    roundHistory: [],
    currentRound: getNewRound(0),
    spectatorTargetGuesses: props.spectatorTargetGuesses,
  };
  return E.right(newGame);
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
          g.currentRound,
          (currentRound) =>
            validatePlayerNotMovedInRound(move.playerId, currentRound),
          E.map((round) => addMoveToRound(round, move)),
          E.map((roundWithMove) => updateRoundInGame(roundWithMove, game))
        )
    )
  );
}

export function resolveRound(game: RPSGame): E.Either<string, RPSGame> {
  return pipe(
    game.currentRound,
    validateRoundCanBeResolved,
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
    return E.right({
      ...validatedRound,
      result: { draw: true },
      bonusPoints: validatedRound.bonusPoints + DRAW_BONUS_POINTS,
    });
  }

  switch (p1Move.moveName) {
    case "rock":
      return p2Move.moveName === "scissors"
        ? E.right({
            ...validatedRound,
            bonusPoints: validatedRound.bonusPoints,
            result: { draw: false, winningPlayerId: p1Move.playerId },
          })
        : E.right({
            ...validatedRound,
            bonusPoints: validatedRound.bonusPoints,
            result: { draw: false, winningPlayerId: p2Move.playerId },
          });
    case "paper":
      return p2Move.moveName === "rock"
        ? E.right({
            ...validatedRound,
            bonusPoints: validatedRound.bonusPoints,
            result: { draw: false, winningPlayerId: p1Move.playerId },
          })
        : E.right({
            ...validatedRound,
            bonusPoints: validatedRound.bonusPoints,
            result: { draw: false, winningPlayerId: p2Move.playerId },
          });
    case "scissors":
      return p2Move.moveName === "paper"
        ? E.right({
            ...validatedRound,
            bonusPoints: validatedRound.bonusPoints,
            result: { draw: false, winningPlayerId: p1Move.playerId },
          })
        : E.right({
            ...validatedRound,
            bonusPoints: validatedRound.bonusPoints,
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

  return ensureNoRoundResult(round);
}

function ensureNoRoundResult(round: RPSRound): E.Either<string, RPSRound> {
  return round.result ? E.left("Round already has a result") : E.right(round);
}
function ensureHasRoundResult(round: RPSRound): E.Either<string, RPSRound> {
  return round.result ? E.right(round) : E.left("Round does not have result");
}

function validatePlayerInGame(
  playerId: string,
  game: RPSGame
): E.Either<string, RPSGame> {
  return !!game.players.find((p) => p.id === playerId)
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
    currentRound: updatedRound,
  };
}

function getNewRound(bonusPoints: number): RPSRound {
  return { moves: [], bonusPoints };
}

export function addRoundToGame(game: RPSGame): E.Either<string, RPSGame> {
  const currentRound = game.currentRound;

  if (!currentRound.result) {
    return E.left("Round does not have result");
  }

  return E.right({
    ...game,
    currentRound: getNewRound(
      currentRound.result.draw ? currentRound.bonusPoints : 0
    ),
    roundHistory: [...game.roundHistory, currentRound],
  });
}

function createGameRoundView(round: RPSRound): RPSSpectatorRoundView {
  return {
    movedPlayerIds: round.moves.map((move) => move.playerId),
    bonusPoints: round.bonusPoints,
    result:
      round.result === undefined
        ? undefined
        : { moves: round.moves, ...round.result },
  };
}

export function createGameView(game: RPSGame): RPSSpectatorGameView {
  const allRounds = [{ ...game.currentRound }, ...game.roundHistory];
  return {
    id: game.id,
    players: [...game.players],
    scores: game.players.map((p) => ({
      playerId: p.id,
      score: allRounds
        .filter(
          (round) => round.result && round.result.winningPlayerId === p.id
        )
        .map((r) => r.bonusPoints || 1)
        .reduce((a, b) => a + b, 0),
    })),
    currentRound: createGameRoundView(game.currentRound),
    roundHistory: game.roundHistory.map(createGameRoundView),
    spectatorTargetGuesses: game.spectatorTargetGuesses,
  };
}
