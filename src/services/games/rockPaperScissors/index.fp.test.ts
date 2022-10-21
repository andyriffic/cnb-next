import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { createGame, makePlayerMove } from "./index.fp";

test("Can create game successfully", () => {
  const game = createGame({ playerIds: ["p1", "p2"] });
  expect(game).toBeRight();
});

test("Can make player move for valid player", () => {
  const result = pipe(
    createGame({ playerIds: ["p1", "p2"] }),
    E.chain((game) =>
      makePlayerMove({ playerId: "p1", moveName: "paper" }, game)
    )
  );

  expect(result).toBeRight();
});

test("Can't make player move for invalid player", () => {
  const result = pipe(
    createGame({ playerIds: ["p1", "p2"] }),
    E.chain((game) =>
      makePlayerMove({ playerId: "xx", moveName: "paper" }, game)
    )
  );

  expect(result).toBeLeft();
  expect(result).toEqualLeft('Player "xx" is not in this game');
});

test("Can't make two moves for the same player in the same round", () => {
  const result = pipe(
    createGame({ playerIds: ["p1", "p2"] }),
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
