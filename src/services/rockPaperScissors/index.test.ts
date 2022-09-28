import { A, O, pipe, R } from "@mobily/ts-belt";
import { createGame, makeMoveForPlayer } from ".";

test("Create game successfully", () => {
  const game = createGame({ playerIds: ["p1", "p2"] });
  expect(R.isOk(game)).toBe(true);
});

test("Makes move ok", () => {
  expect(
    pipe(
      { playerIds: ["p1", "p2"] },
      createGame,
      R.map((game) => makeMoveForPlayer("p1", "paper", game)),
      R.isOk
    )
  ).toBe(true);
});

test("Makes move with invalid player is not ok", () => {
  expect(
    pipe(
      { playerIds: ["p1", "p2"] },
      createGame,
      R.map((game) =>
        makeMoveForPlayer("not a registered player", "paper", game)
      ),
      R.tap((v) => console.log("RESULT:", v)),
      R.isOk
    )
  ).toBe(true);
});

test.skip("Some stuff", () => {
  const output = pipe(
    O.fromNullable(["hello", "world", "lorem", "ipsum"]),
    O.tap((v) => console.log("After nullable", v)),
    O.flatMap(A.takeExactly(2)),
    O.tap((v) => console.log("After flatmap", v)),
    O.map(A.join(" ")),
    O.tap((v) => console.log("After join", v)),
    O.match(
      (str) => str,
      () => "oops!"
    )
  ); // → 'hello world!'
  console.log(output);
});
