import { getPlayerSnakesAndLaddersDetails, Player } from "../../types/Player";

export type CellKind = "normal" | "snake" | "ladder" | "wormhole" | "end";

export type BoardCell = {
  number: number;
  /** [left, top] as percentages of the board image */
  coordinates: [number, number];
  kind: CellKind;
  destination?: number | number[];
};

export type BoardPlayer = {
  player: Player;
  cellIndex: number;
  movesRemaining: number;
  isMoving: boolean;
};

type BoardRow = [number, number, CellKind, (number | number[])?];

const boardLayout: BoardRow[] = [
  [46.4, 85.7, "normal"],
  [35.7, 88.4, "normal"],
  [29.5, 91.1, "wormhole", [4, 8]],
  [21.9, 91.1, "normal"],
  [14.3, 85.7, "wormhole", [8, 12, 15]],
  [15.2, 75, "normal"],
  [22.3, 69.7, "normal"],
  [29.5, 68.3, "normal"],
  [36.6, 68.3, "wormhole", [4, 12, 15]],
  [43.8, 69.7, "normal"],
  [50, 72.3, "ladder", 24],
  [57.1, 73.7, "normal"],
  [63.4, 73.7, "wormhole", [4, 8, 15, 22]],
  [70.5, 74.3, "normal"],
  [76.8, 74.3, "normal"],
  [83.9, 72.3, "wormhole", [4, 8, 12, 22]],
  [92, 69.7, "normal"],
  [95.5, 60.3, "normal"],
  [92, 50.9, "normal"],
  [86.6, 48.2, "wormhole", [15, 22]],
  [79.5, 45.5, "normal"],
  [72.3, 44.9, "snake", 13],
  [65.2, 44.2, "wormhole", [4, 8, 12, 15]],
  [58, 44.2, "normal"],
  [51.8, 45.5, "normal"],
  [45.5, 45.5, "normal"],
  [39.3, 42.9, "normal"],
  [33, 37.5, "normal"],
  [25.9, 38.8, "normal"],
  [21, 35.5, "snake", 5],
  [27.7, 28.1, "normal"],
  [33.9, 27.5, "wormhole", [4, 8, 12, 15, 22, 37]],
  [41.1, 26.8, "normal"],
  [47.3, 28.1, "normal"],
  [53.6, 29.5, "normal"],
  [59.8, 29.5, "wormhole", [31, 37]],
  [67, 31.5, "normal"],
  [73.2, 32.2, "wormhole", [4, 8, 12, 15, 22, 31]],
  [79.5, 32.2, "normal"],
  [84.8, 29.5, "normal"],
  [88.4, 22.8, "wormhole", [37, 31]],
  [87.1, 14.1, "snake", 11],
  [83.9, 8, "normal"],
  [75, 8, "wormhole", [40, 37, 31, 22, 19]],
  [67.9, 8, "normal"],
  [60.7, 8, "normal"],
  [51.8, 9.4, "normal"],
  [43.8, 9.4, "snake", 34],
  [36.6, 9.4, "wormhole", [43, 40, 37, 31, 22]],
  [29.5, 9.4, "normal"],
  [22.3, 12.1, "wormhole", [4, 8, 12, 15, 22]],
  [13.4, 12.1, "end"],
];

export const BOARD_CELLS: BoardCell[] = boardLayout.map(
  ([x, y, kind, destination], number) => ({
    number,
    coordinates: [x, y],
    kind,
    destination,
  }),
);

export const createBoardPlayers = (players: Player[]): BoardPlayer[] =>
  players
    .map((player) => ({
      player,
      details: getPlayerSnakesAndLaddersDetails(player),
      gameMoves: player.details?.gameMoves ?? 0,
    }))
    .filter(({ details }) => details.isParticipant)
    .map(({ player, details, gameMoves }) => ({
      player,
      cellIndex: Math.min(
        Math.max(
          Number.isInteger(details.cellIndex) ? details.cellIndex : 0,
          0,
        ),
        BOARD_CELLS.length - 1,
      ),
      movesRemaining:
        Number.isInteger(gameMoves) && gameMoves > 0 ? gameMoves : 0,
      isMoving: false,
    }));

export const getLandingCellIndex = (
  cellIndex: number,
  random = Math.random,
): number => {
  const cell = BOARD_CELLS[cellIndex];
  if (typeof cell?.destination === "number") {
    return cell.destination;
  }
  if (Array.isArray(cell?.destination) && cell.destination.length > 0) {
    const destinationIndex = Math.min(
      Math.floor(random() * cell.destination.length),
      cell.destination.length - 1,
    );
    return cell.destination[destinationIndex] ?? cellIndex;
  }
  return cellIndex;
};
