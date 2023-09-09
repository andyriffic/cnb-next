import { useEffect } from "react";
import { ZombieRunGame, ZombieRunGameStatus } from "./types";

export const useZombieRunAutoTiming = (
  zombieGame: ZombieRunGame,
  setZombieGame: (status: ZombieRunGame) => void
) => {
  useEffect(() => {
    if (zombieGame.gameStatus === ZombieRunGameStatus.PLAYERS_RUNNING) {
      const timeout = setTimeout(() => {
        setZombieGame({
          ...zombieGame,
          gameStatus: ZombieRunGameStatus.READY_FOR_ORIGINAL_ZOMBIE,
        });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [zombieGame, setZombieGame]);

  useEffect(() => {
    if (zombieGame.gameStatus === ZombieRunGameStatus.ORIGINAL_ZOMBIE_RUNNING) {
      const timeout = setTimeout(() => {
        setZombieGame({
          ...zombieGame,
          gameStatus: ZombieRunGameStatus.READY_FOR_BITTEN_ZOMBIES,
        });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [zombieGame, setZombieGame]);

  useEffect(() => {
    if (zombieGame.gameStatus === ZombieRunGameStatus.BITTEN_ZOMBIES_RUNNING) {
      const timeout = setTimeout(() => {
        setZombieGame({
          ...zombieGame,
          gameStatus: ZombieRunGameStatus.GAME_OVER,
        });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [zombieGame, setZombieGame]);
};
