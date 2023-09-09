import { useCallback, useEffect, useState } from "react";
import { Player } from "../../types/Player";
import { ZombieRunGame, ZombieRunGameStatus } from "./types";
import { useZombieRunAutoTiming } from "./useZombieRunAutoTiming";

type UseZombieRun = {
  zombieGame: ZombieRunGame;
  run: () => void;
  moveOriginalZombie: () => void;
  moveBittenZombies: () => void;
};

const createZombieGame = (players: Player[]): ZombieRunGame => {
  return {
    gameStatus: ZombieRunGameStatus.READY_TO_START,
    survivors: players
      .filter((p) => !p.details?.zombieRun?.isZombie)
      .map((p) => ({
        id: p.id,
        totalMetresRun: p.details?.zombieRun?.totalMetresRun || 0,
        totalMetresToRun: p.details?.gameMoves || 0,
        isZombie: false,
        gotBitten: false,
      })),
    zombies: players
      .filter((p) => !!p.details?.zombieRun?.isZombie)
      .map((p) => ({
        id: p.id,
        totalMetresRun: p.details?.zombieRun?.totalMetresRun || 0,
        totalMetresToRun: Math.ceil((p.details?.gameMoves || 0) / 2),
        isZombie: true,
        gotBitten: false,
      })),
    originalZombie: {
      totalMetresRun: 0,
      totalMetresToRun: 2,
    },
  };
};

export const useZombieRun = (players: Player[]): UseZombieRun => {
  const [zombieGame, setZombieGame] = useState(createZombieGame(players));
  useZombieRunAutoTiming(zombieGame, setZombieGame);

  const run = useCallback(() => {
    setZombieGame({
      ...zombieGame,
      gameStatus: ZombieRunGameStatus.PLAYERS_RUNNING,
      survivors: zombieGame.survivors.map((s) => ({
        ...s,
        totalMetresRun: s.totalMetresRun + s.totalMetresToRun,
        totalMetresToRun: 0,
      })),
    });
  }, [zombieGame]);

  const moveOriginalZombie = useCallback(() => {
    const originalZombieNewTotalDistance =
      zombieGame.originalZombie.totalMetresRun +
      zombieGame.originalZombie.totalMetresToRun;

    const playersGonnaGetBitten = zombieGame.survivors
      .filter((p) => !p.gotBitten)
      .filter((p) => p.totalMetresRun <= originalZombieNewTotalDistance);

    setZombieGame({
      ...zombieGame,
      gameStatus: ZombieRunGameStatus.ORIGINAL_ZOMBIE_RUNNING,
      survivors: zombieGame.survivors.map((s) => ({
        ...s,
        gotBitten: !!playersGonnaGetBitten.find((p) => p.id === s.id),
      })),
      originalZombie: {
        ...zombieGame.originalZombie,
        totalMetresRun: originalZombieNewTotalDistance,
        totalMetresToRun: 0,
      },
    });
  }, [zombieGame]);

  const moveBittenZombies = useCallback(() => {
    const maxBittenZombieDistance = Math.max(
      ...zombieGame.zombies.map((z) => z.totalMetresRun + z.totalMetresToRun)
    );
    const playersGonnaGetBitten = zombieGame.survivors
      .filter((p) => !p.gotBitten)
      .filter((p) => p.totalMetresRun <= maxBittenZombieDistance);

    setZombieGame({
      ...zombieGame,
      gameStatus: ZombieRunGameStatus.BITTEN_ZOMBIES_RUNNING,
      survivors: zombieGame.survivors.map((s) => ({
        ...s,
        gotBitten: !!playersGonnaGetBitten.find((p) => p.id === s.id),
      })),
      zombies: zombieGame.zombies.map((z) => ({
        ...z,
        totalMetresRun: z.totalMetresRun + z.totalMetresToRun,
        totalMetresToRun: 0,
      })),
    });
  }, [zombieGame]);

  return { zombieGame, run, moveOriginalZombie, moveBittenZombies };
};
