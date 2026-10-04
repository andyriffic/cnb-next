import { useEffect, useRef } from "react";
import { useSound } from "../../hooks/useSound";
import { BoardPlayer } from "../game";

export function useBoardTokenSound({ cellIndex, phase }: BoardPlayer): void {
  const { play } = useSound();
  const previousCellIndex = useRef(cellIndex);

  useEffect(() => {
    const fromCellIndex = previousCellIndex.current;
    previousCellIndex.current = cellIndex;
    const changedCell = cellIndex !== fromCellIndex;

    if (changedCell && (phase === "moving" || phase === "landed")) {
      play("snakes-and-ladders-move");
    } else if (changedCell && phase === "sliding") {
      play(
        cellIndex > fromCellIndex
          ? "snakes-and-ladders-ladder"
          : "snakes-and-ladders-snake",
      );
    } else if (phase === "wormhole-in") {
      play("snakes-and-ladders-wormhole-in");
    } else if (phase === "wormhole-out") {
      play("snakes-and-ladders-wormhole-out");
    }
  }, [cellIndex, phase, play]);
}
