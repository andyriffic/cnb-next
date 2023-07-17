import { SETTINGS_PLAYER_ID } from "../../../constants";
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
    updatePlayerDetails(SETTINGS_PLAYER_ID, {
      pacmanDetails: {
        index: uiState.pacMan.pathIndex,
        hasPowerPill: false,
        jailTurnsRemaining: 0,
      },
    });
  }, uiState.status === "game-over" && !disabled);
}
