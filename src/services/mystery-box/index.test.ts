import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { Player } from "../../types/Player";
import {
  createMysteryBox,
  createMysteryBoxGame,
  newRound,
  playerSelectBox,
} from ".";

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
  const game = createMysteryBoxGame({
    id: "test",
    players: [testPlayer1, testPlayer2],
  });
  expect(game).toBeRight();
});

test("Player can select box on a round", () => {
  const result = pipe(
    createMysteryBoxGame({ id: "test", players: [testPlayer1, testPlayer2] }),
    E.chain(playerSelectBox("p1", 0, 0))
  );

  expect(result).toBeRight();
});

test("Player can not select box on invalid round", () => {
  const result = pipe(
    createMysteryBoxGame({ id: "test", players: [testPlayer1, testPlayer2] }),
    E.chain(playerSelectBox("p1", -1, 0))
  );

  expect(result).toEqualLeft("Round with id -1 not found");
});

test("Player can not select invalid box on valid round", () => {
  const result = pipe(
    createMysteryBoxGame({ id: "test", players: [testPlayer1, testPlayer2] }),
    E.chain(playerSelectBox("p1", 0, -1))
  );

  expect(result).toEqualLeft("Box with id -1 not found");
});

test("Can create new round when all players have moved and alive players", () => {
  const result = pipe(
    createMysteryBoxGame({ id: "test", players: [testPlayer1, testPlayer2] }),
    E.chain(playerSelectBox("p1", 0, 1)),
    E.chain(playerSelectBox("p2", 0, 2)),
    E.chain(newRound)
  );

  expect(result).toBeRight();
});

test("Cannot create new round when no players have selected a box", () => {
  const result = pipe(
    createMysteryBoxGame({ id: "test", players: [testPlayer1, testPlayer2] }),
    E.chain(newRound)
  );

  expect(result).toEqualLeft("Not all players have selected a box");
});

test("Cannot create new round when not all players have selected a box", () => {
  const result = pipe(
    createMysteryBoxGame({ id: "test", players: [testPlayer1, testPlayer2] }),
    E.chain(playerSelectBox("p1", 0, 1)),
    E.chain(newRound)
  );

  expect(result).toEqualLeft("Not all players have selected a box");
});

test("Cannot create new round when all players are out", () => {
  const createBombOnlyBoxes = () => {
    return [createMysteryBox(0, "bomb")];
  };

  const result = pipe(
    createMysteryBoxGame({
      id: "test",
      players: [testPlayer1, testPlayer2],
      mysteryBoxCreator: createBombOnlyBoxes,
    }),
    E.chain(playerSelectBox("p1", 0, 0)),
    E.chain(playerSelectBox("p2", 0, 0)),
    E.chain(newRound)
  );

  expect(result).toEqualLeft("All players have been eliminated");
});
