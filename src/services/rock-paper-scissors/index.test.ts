import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { Player } from "../../types/Player";
import { addRoundToGame, createGame, makePlayerMove, resolveRound } from ".";

const testPlayer1: Player = {
  id: "p1",
  name: "Player 1",
  tags: [],
};
const testPlayer2: Player = {
  id: "p2",
  name: "Player 2",
  tags: [],
};

test("Can create game successfully", () => {
  const game = createGame({
    id: "test",
    players: [testPlayer1, testPlayer2],
    spectatorTargetGuesses: 1,
  });
  expect(game).toBeRight();
});

test("Can make player move for valid player", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    )
  );

  expect(result).toBeRight();
});

test("Can't make move for invalid player", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "xx", moveName: "paper" }, game)
    )
  );

  expect(result).toBeLeft();
  expect(result).toEqualLeft('Player "xx" is not in this game');
});

test("Can't make two moves for the same player in the same round", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    )
  );

  expect(result).toBeLeft();
  expect(result).toEqualLeft('Player "p1" has already moved this round');
});

test("Correct round result for draw with paper", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "paper" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: { result: { draw: true } },
  });
});

test("Correct round result for draw with rock", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "rock" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "rock" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: { result: { draw: true } },
  });
});

test("Correct round result for draw with scissors", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "scissors" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "scissors" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: { result: { draw: true } },
  });
});

test("Correct round result for player1 winning with rock", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "rock" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "scissors" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: { result: { draw: false, winningPlayerId: "p1" } },
  });
});

test("Correct round result for player1 winning with paper", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "rock" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: { result: { draw: false, winningPlayerId: "p1" } },
  });
});

test("Correct round result for player1 winning with scissors", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "scissors" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "paper" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: { result: { draw: false, winningPlayerId: "p1" } },
  });
});

test("Correct round result for player2 winning with rock", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "scissors" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "rock" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: { result: { draw: false, winningPlayerId: "p2" } },
  });
});

test("Correct round result for player2 winning with paper", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "rock" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "paper" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: { result: { draw: false, winningPlayerId: "p2" } },
  });
});

test("Correct round result for player2 winning with scissors", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "scissors" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: { result: { draw: false, winningPlayerId: "p2" } },
  });
});

test("Can't resolve round if no players have moved", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain(resolveRound)
  );

  expect(result).toBeLeft();
  expect(result).toEqualLeft("Not all players have moved");
});

test("Can't resolve round if only 1 player has moved", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    ),
    E.chain(resolveRound)
  );

  expect(result).toBeLeft();
  expect(result).toEqualLeft("Not all players have moved");
});

test("Can't resolve round if it already has a result", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "paper" }, game)
    ),
    E.chain(resolveRound),
    E.chain(resolveRound)
  );

  expect(result).toBeLeft();
  expect(result).toEqualLeft("Round already has a result");
});

test("Can add new round to game if last round has a result", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "paper" }, game)
    ),
    E.chain(resolveRound),
    E.chain(addRoundToGame)
  );

  expect(result).toBeRight();
});

test("Can't add new round to game if last round doesn't have result", () => {
  const result = pipe(
    createGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      spectatorTargetGuesses: 1,
    }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    ),
    E.chain((game) =>
      makePlayerMove({ playerId: "p2", moveName: "paper" }, game)
    ),
    E.chain(addRoundToGame)
  );

  expect(result).toBeLeft();
  expect(result).toEqualLeft("Round does not have result");
});
