import { Player, SnakesAndLaddersDetails } from "../../types/Player";
import { BOARD_CELLS, createBoardPlayers, getLandingCellIndex } from "./game";

const player = (
  snakesAndLadders?: SnakesAndLaddersDetails,
  gameMoves?: number,
): Player => ({
  id: "player-1",
  name: "Test Player",
  tags: [],
  details: snakesAndLadders ? { snakesAndLadders, gameMoves } : undefined,
});

describe("snakes and ladders board", () => {
  it("contains 52 connected board spaces", () => {
    expect(BOARD_CELLS).toHaveLength(52);
    expect(BOARD_CELLS.every((cell, index) => cell.number === index)).toBe(
      true,
    );
  });

  it("loads participants and safely defaults malformed tag values", () => {
    expect(
      createBoardPlayers([
        player({ isParticipant: true, cellIndex: 12 }, 3),
        {
          ...player({ isParticipant: false, cellIndex: 5 }, 2),
          id: "not-playing",
        },
        {
          ...player({ isParticipant: true, cellIndex: -2 }, -3),
          id: "invalid",
        },
      ]),
    ).toEqual([
      {
        player: player({ isParticipant: true, cellIndex: 12 }, 3),
        cellIndex: 12,
        movesRemaining: 3,
        isMoving: false,
      },
      {
        player: {
          ...player(
            {
              isParticipant: true,
              cellIndex: -2,
            },
            -3,
          ),
          id: "invalid",
        },
        cellIndex: 0,
        movesRemaining: 0,
        isMoving: false,
      },
    ]);
  });

  it("resolves snakes, ladders, and random wormhole destinations", () => {
    expect(getLandingCellIndex(10)).toBe(24);
    expect(getLandingCellIndex(21)).toBe(13);
    expect(getLandingCellIndex(2, () => 0.75)).toBe(8);
    expect(getLandingCellIndex(1)).toBe(1);
  });
});
