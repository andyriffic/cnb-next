import { updatePlayerDetails } from "../../../utils/api";
import { useDoOnce } from "../../hooks/useDoOnce";
import { PacManUiState } from "./usePacman/reducer";

export function useSyncData(uiState: PacManUiState, disabled: boolean) {
  useDoOnce(() => {
    uiState.allPacPlayers.forEach((pacPlayer) => {
      updatePlayerDetails(pacPlayer.player.id, {
        gameMoves: pacPlayer.movesRemaining,
        pacmanDetails: {
          jailTurnsRemaining: pacPlayer.jailTurnsCount,
          index: pacPlayer.pathIndex,
          hasPowerPill: pacPlayer.powerPill,
        },
      });
    });
  }, uiState.status === "game-over" && !disabled);
}
