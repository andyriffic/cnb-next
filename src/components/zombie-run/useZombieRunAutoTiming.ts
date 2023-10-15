import { useEffect } from "react";
import { useDoOnce } from "../hooks/useDoOnce";
import { ZombieRunGameStatus } from "./types";
import { UseZombieRun } from "./useZombieRun";

export const useZombieRunAutoTiming = (useZombieGame: UseZombieRun) => {
  useEffect(() => {
    if (
      useZombieGame.zombieGame.gameStatus ===
      ZombieRunGameStatus.PLAYERS_RUNNING
    ) {
      const timeout = setTimeout(() => {
        useZombieGame.setZombieGameStatus(
          ZombieRunGameStatus.READY_FOR_ORIGINAL_ZOMBIE
        );
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [useZombieGame]);

  useEffect(() => {
    if (
      useZombieGame.zombieGame.gameStatus ===
      ZombieRunGameStatus.ORIGINAL_ZOMBIE_RUNNING
    ) {
      const timeout = setTimeout(() => {
        useZombieGame.setZombieGameStatus(
          ZombieRunGameStatus.READY_FOR_BITTEN_ZOMBIES
        );
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [useZombieGame]);

  useEffect(() => {
    if (
      useZombieGame.zombieGame.gameStatus ===
      ZombieRunGameStatus.BITTEN_ZOMBIES_RUNNING
    ) {
      const timeout = setTimeout(() => {
        useZombieGame.setZombieGameStatus(
          ZombieRunGameStatus.CHECK_FOR_NEW_WINNERS
        );
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [useZombieGame]);

  useEffect(() => {
    if (
      useZombieGame.zombieGame.gameStatus ===
      ZombieRunGameStatus.CHECK_FOR_NEW_WINNERS
    ) {
      useZombieGame.checkForWinners();
    }
  }, [useZombieGame]);

  useEffect(() => {
    if (
      useZombieGame.zombieGame.gameStatus ===
      ZombieRunGameStatus.READY_FOR_ORIGINAL_ZOMBIE
    ) {
      useZombieGame.moveOriginalZombie();
    }
  }, [useZombieGame]);

  useEffect(() => {
    if (
      useZombieGame.zombieGame.gameStatus ===
      ZombieRunGameStatus.READY_FOR_BITTEN_ZOMBIES
    ) {
      useZombieGame.moveBittenZombies();
    }
  }, [useZombieGame]);
};
