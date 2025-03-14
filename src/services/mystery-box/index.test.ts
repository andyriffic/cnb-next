import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { Player } from "../../types/Player";
import { createGame } from ".";

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
  const game = createGame({ id: "test", players: [testPlayer1, testPlayer2] });
  expect(game).toBeRight();
});
