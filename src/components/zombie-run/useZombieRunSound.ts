import { useEffect } from "react";
import { useSound } from "../hooks/useSound";
import { ZombieRunGame, ZombieRunGameStatus } from "./types";

export const useZombieRunSound = (zombieGame: ZombieRunGame) => {
  const { play } = useSound();

  // Game state sounds
  useEffect(() => {
    if (zombieGame.gameStatus === ZombieRunGameStatus.PLAYERS_RUNNING) {
      play("zombie-run-players-running");
    }
    if (zombieGame.gameStatus === ZombieRunGameStatus.ORIGINAL_ZOMBIE_RUNNING) {
      play("zombie-run-zombie-moving");
    }
  }, [zombieGame, play]);

  // Game action sounds
  useEffect(() => {
    if (
      zombieGame.gameStatus === ZombieRunGameStatus.ORIGINAL_ZOMBIE_RUNNING &&
      zombieGame.survivors.filter((p) => p.gotBitten).length > 0
    ) {
      play("zombie-run-player-bitten");
    }
  }, [zombieGame, play]);
};
