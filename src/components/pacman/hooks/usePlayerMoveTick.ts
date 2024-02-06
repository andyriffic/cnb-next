import { useEffect } from "react";
import { UsePacMan } from "./usePacman";

export function usePlayerAutoMove(
  {
    uiState,
    movePlayer,
    movePacmanOneSquare,
    startMovePacman,
    setUiStatus,
  }: UsePacMan,
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
    if (uiState.status !== "ready-to-move-pacman") {
      return;
    }

    const timeout = setTimeout(() => {
      startMovePacman();
    }, 500);
    return () => clearTimeout(timeout);
  }, [startMovePacman, uiState.status]);

  // useEffect(() => {
  //   if (uiState.status !== "show-pacman-moves") {
  //     return;
  //   }

  //   const timeout = setTimeout(() => {
  //     setUiStatus("ready-to-move-pacman");
  //   }, 2000);
  //   return () => clearTimeout(timeout);
  // }, [setUiStatus, startMovePacman, uiState.status]);
}
