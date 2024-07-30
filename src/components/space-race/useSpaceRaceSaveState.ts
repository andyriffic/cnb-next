import { updatePlayerDetails } from "../../utils/api";
import { useDoOnce } from "../hooks/useDoOnce";
import { SpacePlayersById, SpaceRaceGame } from "./types";

export const useSpaceRaceSaveState = (
  spaceRaceGame: SpaceRaceGame,
  disabled: boolean
) => {
  disabled && console.warn("Saving Space Race state is disabled 🚀");
  useDoOnce(() => {
    if (disabled) {
      console.info("Not saving Space Race state as disabled");
      return;
    }

    Object.keys(spaceRaceGame.spacePlayers).forEach((playerId) => {
      const spaceRacePlayer = spaceRaceGame.spacePlayers[playerId];
      if (!spaceRacePlayer) return;

      updatePlayerDetails(spaceRacePlayer.id, {
        gameMoves: spaceRacePlayer.courseMovesRemaining,
        spaceRace: {
          xCoordinate: spaceRacePlayer.currentPosition.x,
          yCoordinate: spaceRacePlayer.currentPosition.y,
        },
      });
    });
  }, allPlayersMoved(spaceRaceGame.spacePlayers));
};

function allPlayersMoved(spacePlayers: SpacePlayersById): boolean {
  return Object.values(spacePlayers).every(
    (player) =>
      player.plannedCourse.lockedIn &&
      player.plannedCourse.movedVertically &&
      player.plannedCourse.movedHorizontally
  );
}
