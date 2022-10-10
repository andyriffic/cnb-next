import { A, O, pipe, R } from "@mobily/ts-belt";
import { addRoundToGame, createGame, makeMoveForPlayer } from ".";

test("Create game successfully", () => {
  const game = createGame({ playerIds: ["p1", "p2"] });
  expect(R.isOk(game)).toBe(true);
});

test("Makes move ok", () => {
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
  expect(
    pipe(
      { playerIds: ["p1", "p2"] },
      createGame,
      R.flatMap(makeMoveForPlayer("p3", "paper")),
      R.isError
    )
  ).toEqual(true);
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

test("Can't add new round if all players haven't moved", () => {
  expect(
    pipe(
      { playerIds: ["p1", "p2"] },
      createGame,
      R.flatMap(addRoundToGame),
      R.isError
    )
  ).toEqual(true);
});
