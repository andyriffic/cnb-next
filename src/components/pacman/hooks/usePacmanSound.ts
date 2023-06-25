import { useEffect, useMemo } from "react";
import { useSound } from "../../hooks/useSound";
import { PacManUiState } from "./usePacman/reducer";

export function usePacmanSound(state: PacManUiState): void {
  const { play } = useSound();

  const currentPlayer = useMemo(() => {
    const player = state.allPacPlayers.find((p) => p.status === "moving");
    return player ? player.player.name : undefined;
  }, [state]);

  const playersInJailCount = useMemo(() => {
    return state.allPacPlayers.filter((p) => p.jailTurnsCount > 0).length;
  }, [state]);

  useEffect(() => {
    state.status === "moving-pacman" && play("pacman-move-pacman");
  }, [play, state.status]);

  useEffect(() => {
    currentPlayer && play("pacman-move-player");
  }, [currentPlayer, play]);

  useEffect(() => {
    state.status === "moving-pacman" &&
      playersInJailCount > 0 &&
      play("pacman-eat-player");
  }, [play, playersInJailCount, state.status]);
}
