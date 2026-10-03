import { Player, SnakesAndLaddersDetails } from "../../types/Player";
import {
  advanceTurn,
  BOARD_CELLS,
  BoardPlayer,
  createBoardPlayers,
  END_CELL_INDEX,
  getLandingCellIndex,
  startTurn,
} from "./game";

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
        phase: "idle",
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
        phase: "idle",
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

describe("snakes and ladders turns", () => {
  const boardPlayer = (overrides: Partial<BoardPlayer>): BoardPlayer => ({
    player: player({ isParticipant: true, cellIndex: 0 }),
    cellIndex: 0,
    movesRemaining: 0,
    phase: "idle",
    ...overrides,
  });

  const playTurn = (
    start: BoardPlayer,
    random = Math.random,
  ): BoardPlayer[] => {
    const steps = [startTurn(start)];
    while (steps[steps.length - 1]!.phase !== "idle") {
      steps.push(advanceTurn(steps[steps.length - 1]!, random));
    }
    return steps;
  };

  it("only starts a turn for idle players with moves who have not won", () => {
    expect(startTurn(boardPlayer({ movesRemaining: 2 })).phase).toBe("moving");
    expect(startTurn(boardPlayer({ movesRemaining: 0 })).phase).toBe("idle");
    expect(
      startTurn(boardPlayer({ cellIndex: END_CELL_INDEX, movesRemaining: 2 }))
        .phase,
    ).toBe("idle");
    expect(
      startTurn(boardPlayer({ movesRemaining: 2, phase: "sliding" })).phase,
    ).toBe("sliding");
  });

  it("moves one square at a time and stops on a normal square", () => {
    expect(
      playTurn(boardPlayer({ cellIndex: 5, movesRemaining: 2 })).map(
        ({ cellIndex, movesRemaining, phase }) => [
          cellIndex,
          movesRemaining,
          phase,
        ],
      ),
    ).toEqual([
      [5, 2, "moving"],
      [6, 1, "moving"],
      [7, 0, "landed"],
      [7, 0, "idle"],
    ]);
  });

  it("slides up a ladder after landing at the bottom", () => {
    expect(
      playTurn(boardPlayer({ cellIndex: 9, movesRemaining: 1 })).map(
        ({ cellIndex, phase }) => [cellIndex, phase],
      ),
    ).toEqual([
      [9, "moving"],
      [10, "landed"],
      [24, "sliding"],
      [24, "idle"],
    ]);
  });

  it("slides down a snake after landing on its head", () => {
    expect(
      playTurn(boardPlayer({ cellIndex: 19, movesRemaining: 2 })).map(
        ({ cellIndex, phase }) => [cellIndex, phase],
      ),
    ).toEqual([
      [19, "moving"],
      [20, "moving"],
      [21, "landed"],
      [13, "sliding"],
      [13, "idle"],
    ]);
  });

  it("only actions the final square, not squares passed over", () => {
    const steps = playTurn(boardPlayer({ cellIndex: 9, movesRemaining: 2 }));
    expect(steps[steps.length - 1]!.cellIndex).toBe(11);
    expect(steps.map(({ phase }) => phase)).not.toContain("sliding");
  });

  it("sends players through a wormhole to a random destination", () => {
    expect(
      playTurn(boardPlayer({ cellIndex: 1, movesRemaining: 1 }), () => 0.75).map(
        ({ cellIndex, phase }) => [cellIndex, phase],
      ),
    ).toEqual([
      [1, "moving"],
      [2, "landed"],
      [2, "wormhole-in"],
      [8, "wormhole-out"],
      [8, "idle"],
    ]);
  });

  it("stops at the finish and discards spare moves", () => {
    const steps = playTurn(
      boardPlayer({ cellIndex: END_CELL_INDEX - 1, movesRemaining: 4 }),
    );
    expect(steps[steps.length - 1]).toMatchObject({
      cellIndex: END_CELL_INDEX,
      movesRemaining: 0,
      phase: "idle",
    });
  });
});
