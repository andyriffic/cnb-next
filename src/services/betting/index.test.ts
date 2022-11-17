import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { createBettingGame, makePlayerBet } from ".";

test("Can add bet to game if have enough in wallet", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1 }],
      [{ playerId: "p1", value: 1 }]
    ),
    E.chain((game) =>
      makePlayerBet(game, { playerId: "p1", betOptionId: "b1", betValue: 1 })
    )
  );

  expect(result).toBeRight();
});

test("Can't add bet for invalid betting option", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1 }],
      [{ playerId: "p1", value: 1 }]
    ),
    E.chain((game) =>
      makePlayerBet(game, { playerId: "p1", betOptionId: "b1", betValue: 1 })
    ),
    E.chain((game) =>
      makePlayerBet(game, { playerId: "p1", betOptionId: "b1", betValue: 1 })
    )
  );

  expect(result).toEqualLeft("Player has already bet this round");
});

test("Can't add bet for invalid betting option", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1 }],
      [{ playerId: "p1", value: 1 }]
    ),
    E.chain((game) =>
      makePlayerBet(game, {
        playerId: "p1",
        betOptionId: "invalid",
        betValue: 1,
      })
    )
  );

  expect(result).toEqualLeft("Invalid betting option");
});

test("Can't add bet if not enough in wallet", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1 }],
      [{ playerId: "p1", value: 1 }]
    ),
    E.chain((game) =>
      makePlayerBet(game, { playerId: "p1", betOptionId: "b1", betValue: 2 })
    )
  );

  expect(result).toEqualLeft("Not enough in wallet");
});
