import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { Player } from "../../types/Player";
import {
  addNewBettingRound,
  applyBetResultToCurrentRound,
  createBettingGame,
  makePlayerBet,
} from ".";

const testPlayer1: Player = {
  id: "p1",
  name: "Player 1",
  tags: [],
};

test("Can add bet to game if have enough in wallet", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1, betReturn: "multiply" }],
      [{ player: testPlayer1, value: 1 }]
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
      [{ id: "b1", name: "Bet1", odds: 1, betReturn: "multiply" }],
      [{ player: testPlayer1, value: 1 }]
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
      [{ id: "b1", name: "Bet1", odds: 1, betReturn: "multiply" }],
      [{ player: testPlayer1, value: 1 }]
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
      [{ id: "b1", name: "Bet1", odds: 1, betReturn: "multiply" }],
      [{ player: testPlayer1, value: STARTING_BALANCE }]
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

test("Can bet 0", () => {
  const STARTING_BALANCE = 0;
  const BETTING_VALUE = 0;

  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1, betReturn: "oddsOnly" }],
      [{ player: testPlayer1, value: STARTING_BALANCE }]
    ),
    E.chain((game) =>
      makePlayerBet(game, {
        playerId: "p1",
        betOptionId: "b1",
        betValue: BETTING_VALUE,
      })
    )
  );

  expect(result).toBeRight();
});

test("Can apply result to current betting round for multiply bets", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 3, betReturn: "multiply" }],
      [{ player: testPlayer1, value: 2 }]
    ),
    E.chain((game) =>
      makePlayerBet(game, { playerId: "p1", betOptionId: "b1", betValue: 2 })
    ),
    E.chain((game) => applyBetResultToCurrentRound(game, "b1"))
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: {
      result: {
        winningOptionId: "b1",
        playerResults: [{ playerId: "p1", totalWinnings: 6 }],
      },
    },
  });
});

test("Can apply result to current betting round for oddsOnly bets", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 2, betReturn: "oddsOnly" }],
      [{ player: testPlayer1, value: 3 }]
    ),
    E.chain((game) =>
      makePlayerBet(game, { playerId: "p1", betOptionId: "b1", betValue: 3 })
    ),
    E.chain((game) => applyBetResultToCurrentRound(game, "b1"))
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: {
      result: {
        winningOptionId: "b1",
        playerResults: [{ playerId: "p1", totalWinnings: 2 }],
      },
    },
  });
});

test("Can bet 0 and get a return on oddsOnly bet", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 2, betReturn: "oddsOnly" }],
      [{ player: testPlayer1, value: 0 }]
    ),
    E.chain((game) =>
      makePlayerBet(game, { playerId: "p1", betOptionId: "b1", betValue: 0 })
    ),
    E.chain((game) => applyBetResultToCurrentRound(game, "b1"))
  );

  expect(result).toBeRight();
  expect(result).toSubsetEqualRight({
    currentRound: {
      result: {
        winningOptionId: "b1",
        playerResults: [{ playerId: "p1", totalWinnings: 2 }],
      },
    },
  });
});

test("Can't apply result to current betting round for invalid winning option", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1, betReturn: "multiply" }],
      [{ player: testPlayer1, value: 1 }]
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
      [{ id: "b1", name: "Bet1", odds: 1, betReturn: "multiply" }],
      [{ player: testPlayer1, value: 1 }]
    ),
    E.chain((game) => applyBetResultToCurrentRound(game, "b1")),
    E.chain((game) => addNewBettingRound(game))
  );

  expect(result).toBeRight();
});

test("Can't add new betting round if current round does not have a result", () => {
  const result = pipe(
    createBettingGame(
      "game1",
      [{ id: "b1", name: "Bet1", odds: 1, betReturn: "multiply" }],
      [{ player: testPlayer1, value: 1 }]
    ),
    E.chain((game) => addNewBettingRound(game))
  );

  expect(result).toEqualLeft("Current round does not have result");
});
