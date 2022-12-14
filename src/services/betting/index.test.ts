import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import {
  addNewBettingRound,
  applyBetResultToCurrentRound,
  createBettingGame,
  makePlayerBet,
} from ".";

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

test("Can't bet twice in same round for same player", () => {
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
  const STARTING_BALANCE = 1;
  const BETTING_VALUE = 2;

  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1 }],
      [{ playerId: "p1", value: STARTING_BALANCE }]
    ),
    E.chain((game) =>
      makePlayerBet(game, {
        playerId: "p1",
        betOptionId: "b1",
        betValue: BETTING_VALUE,
      })
    )
  );

  expect(result).toEqualLeft("Not enough in wallet");
});

test("Can apply result to current betting round", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1 }],
      [{ playerId: "p1", value: 1 }]
    ),
    E.chain((game) =>
      makePlayerBet(game, { playerId: "p1", betOptionId: "b1", betValue: 1 })
    ),
    E.chain((game) => applyBetResultToCurrentRound(game, "b1"))
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    rounds: [
      {
        index: 0,
        result: {
          winningOptionId: "b1",
          playerResults: [{ playerId: "p1", totalWinnings: 1 }],
        },
      },
    ],
  });
});

test("Can't apply result to current betting round for invalid winning option", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1 }],
      [{ playerId: "p1", value: 1 }]
    ),
    E.chain((game) =>
      makePlayerBet(game, { playerId: "p1", betOptionId: "b1", betValue: 1 })
    ),
    E.chain((game) => applyBetResultToCurrentRound(game, "invalid"))
  );

  expect(result).toEqualLeft('Winning option "invalid" not found');
});

test("Can add new betting round", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1 }],
      [{ playerId: "p1", value: 1 }]
    ),
    E.chain((game) => applyBetResultToCurrentRound(game, "b1")),
    E.chain((game) => addNewBettingRound(game))
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    rounds: [{ index: 0 }, { index: 1 }],
  });
});

test("Can't add new betting round if current round does not have a result", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1 }],
      [{ playerId: "p1", value: 1 }]
    ),
    E.chain((game) => addNewBettingRound(game))
  );

  expect(result).toEqualLeft("Current round does not have result");
});
