import { useEffect } from "react";
import { UsePacMan } from "./usePacman";

export function usePlayerAutoMove(
  { uiState, movePlayer, movePacmanOneSquare, startMovePacman }: UsePacMan,
  moveSpeedMilliseconds: number = 250
): void {
  useEffect(() => {
    if (uiState.status !== "moving-players") {
      return;
    }

    const interval = setInterval(() => {
      console.log("Tick-player");

      movePlayer();
    }, moveSpeedMilliseconds);
    return () => clearInterval(interval);
  }, [movePlayer, moveSpeedMilliseconds, uiState.status]);

  useEffect(() => {
    if (uiState.status !== "moving-pacman") {
      return;
    }

    const interval = setInterval(() => {
      console.log("Tick-pacman");

      movePacmanOneSquare();
    }, moveSpeedMilliseconds);
    return () => clearInterval(interval);
  }, [movePacmanOneSquare, moveSpeedMilliseconds, uiState.status]);

  useEffect(() => {
    if (uiState.status !== "moving-players-done") {
      return;
    }

    const timeout = setTimeout(() => {
      console.log("Tick-init-pacman");

      startMovePacman();
    }, 500);
    return () => clearInterval(timeout);
  }, [startMovePacman, uiState.status]);
}
