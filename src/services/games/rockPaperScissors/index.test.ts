import { A, O, pipe, R } from "@mobily/ts-belt";
import { buildASTSchema } from "graphql";
import {
  addRoundToGame,
  createGame,
  makeMoveForPlayer,
  resolveLastRound,
} from ".";

test("Create game successfully", () => {
  const game = createGame({ playerIds: ["p1", "p2"] });
  expect(R.isOk(game)).toBe(true);
});

test("Makes move for valid player is ok", () => {
  expect(
    pipe(
      { playerIds: ["p1", "p2"] },
      createGame,
      R.flatMap(makeMoveForPlayer("p1", "paper")),
      R.isOk
    )
  ).toEqual(true);
});

test("Makes move with invalid player is not ok", () => {
  const result = pipe(
    { playerIds: ["p1", "p2"] },
    createGame,
    R.flatMap(makeMoveForPlayer("p3", "paper"))
  );

  expect(pipe(result, R.isError)).toEqual(true);
  expect(
    pipe(
      result,
      R.match(
        () => "",
        (e) => e
      )
    )
  ).toEqual('Player "p3" not included in game');
});

test("Can add new round if all players have moved", () => {
  expect(
    pipe(
      { playerIds: ["p1", "p2"] },
      createGame,
      R.flatMap(makeMoveForPlayer("p1", "paper")),
      R.flatMap(makeMoveForPlayer("p2", "paper")),
      R.flatMap(addRoundToGame),
      R.isOk
    )
  ).toEqual(true);
});

test("Can't add new round if current round not resolved", () => {
  const result = pipe(
    { playerIds: ["p1", "p2"] },
    createGame,
    R.flatMap(makeMoveForPlayer("p1", "paper")),
    R.flatMap(makeMoveForPlayer("p2", "paper")),
    R.flatMap(addRoundToGame)
  );

  expect(R.isError(result)).toEqual(true);

  expect(
    pipe(
      result,
      R.match(
        () => "",
        (e) => e
      )
    )
  ).toEqual("Current round is not resolved");
});

test("Can't add new round if all players haven't moved", () => {
  const result = pipe(
    { playerIds: ["p1", "p2"] },
    createGame,
    R.flatMap(addRoundToGame)
  );

  expect(R.isError(result)).toEqual(true);
  expect(
    pipe(
      result,
      R.match(
        () => "",
        (e) => e
      )
    )
  ).toEqual("Not all moves made on current round");
});

test("Player can't move on same round twice", () => {
  const result = pipe(
    { playerIds: ["p1", "p2"] },
    createGame,
    R.flatMap(makeMoveForPlayer("p1", "paper")),
    R.flatMap(makeMoveForPlayer("p1", "paper"))
  );

  expect(R.isError(result)).toEqual(true);
  expect(
    pipe(
      result,
      R.match(
        () => "",
        (e) => e
      )
    )
  ).toEqual('Player "p1" has already played last round');
});

test("Round result correct for a paper draw", () => {
  const result = pipe(
    { playerIds: ["p1", "p2"] },
    createGame,
    R.flatMap(makeMoveForPlayer("p1", "paper")),
    R.flatMap(makeMoveForPlayer("p2", "paper")),
    R.flatMap(resolveLastRound)
  );

  expect(R.isOk(result)).toEqual(true);
  expect(
    pipe(
      result,
      R.map((g) => g.rounds),
      // R.recover([]),
      R.match(
        (r) => r,
        () => []
      ),
      A.last,
      O.match(
        (round) => round.result?.draw,
        () => undefined
      )
    )
  ).toEqual(true);
});
