import { SETTINGS_PLAYER_ID } from "../../constants";
import { updatePlayerDetails } from "../../utils/api";
import { useDoOnce } from "../hooks/useDoOnce";
import { ZombieRunGame, ZombieRunGameStatus } from "./types";

export const useZombieSaveState = (
  zombieGame: ZombieRunGame,
  disabled: boolean
) => {
  disabled && console.warn("Saving Zombie state is disabled 🧟");
  useDoOnce(() => {
    if (disabled) {
      console.info("Not saving Zombie state as disabled");
      return;
    }

    // Saving Zombie Run state
    zombieGame.survivors.forEach((z) => {
      updatePlayerDetails(z.id, {
        gameMoves: 0,
        zombieRun: {
          isZombie: z.gotBitten,
          totalMetresRun: z.totalMetresRun,
          finishPosition: z.finishPosition,
        },
      });
    });
    zombieGame.zombies.forEach((z) => {
      updatePlayerDetails(z.id, {
        gameMoves: 0,
        zombieRun: { isZombie: true, totalMetresRun: z.totalMetresRun },
      });
    });
    updatePlayerDetails(SETTINGS_PLAYER_ID, {
      zombieRun: {
        isZombie: true,
        totalMetresRun: zombieGame.originalZombie.totalMetresRun,
      },
    });
  }, zombieGame.gameStatus === ZombieRunGameStatus.GAME_OVER);
};
