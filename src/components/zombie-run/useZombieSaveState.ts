import { updatePlayerDetails } from "../../utils/api";
import { useDoOnce } from "../hooks/useDoOnce";
import { ZombieRunGame, ZombieRunGameStatus } from "./types";

export const useZombieSaveState = (zombieGame: ZombieRunGame) => {
  useDoOnce(() => {
    // Saving Zombie Run state
    zombieGame.survivors.forEach((z) => {
      updatePlayerDetails(z.id, {
        gameMoves: 0,
        zombieRun: { isZombie: z.gotBitten, totalMetresRun: z.totalMetresRun },
      });
    });
    zombieGame.zombies.forEach((z) => {
      updatePlayerDetails(z.id, {
        gameMoves: 0,
        zombieRun: { isZombie: true, totalMetresRun: z.totalMetresRun },
      });
    });
  }, zombieGame.gameStatus === ZombieRunGameStatus.GAME_OVER);
};
