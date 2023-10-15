import { useCallback, useState } from "react";
import { Player } from "../../types/Player";
import {
  OriginalZombieDetails,
  ZOMBIE_RUNNING_TRACK_LENGTH_METRES,
  ZombieRunGame,
  ZombieRunGameStatus,
} from "./types";

export type UseZombieRun = {
  zombieGame: ZombieRunGame;
  run: () => void;
  checkForWinners: () => void;
  moveOriginalZombie: () => void;
  moveBittenZombies: () => void;
  setZombieGameStatus: (status: ZombieRunGameStatus) => void;
};

const createZombieGame = (
  players: Player[],
  originalZombie: OriginalZombieDetails
): ZombieRunGame => {
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
        finishPosition: p.details?.zombieRun?.finishPosition,
      })),
    zombies: players
      .filter((p) => !!p.details?.zombieRun?.isZombie)
      .map((p) => ({
        id: p.id,
        totalMetresRun: p.details?.zombieRun?.totalMetresRun || 0,
        totalMetresToRun: p.details?.gameMoves || 0,
        isZombie: true,
        gotBitten: false,
      })),
    originalZombie,
  };
};

export const useZombieRun = (
  players: Player[],
  originalZombie: OriginalZombieDetails
): UseZombieRun => {
  const [zombieGame, setZombieGame] = useState(
    createZombieGame(players, originalZombie)
  );

  const run = useCallback(() => {
    setZombieGame({
      ...zombieGame,
      gameStatus: ZombieRunGameStatus.PLAYERS_RUNNING,
      survivors: zombieGame.survivors.map((s) => ({
        ...s,
        totalMetresRun: Math.min(
          s.totalMetresRun + s.totalMetresToRun,
          ZOMBIE_RUNNING_TRACK_LENGTH_METRES
        ),
        totalMetresToRun: 0,
      })),
    });
  }, [zombieGame]);

  const checkForWinners = useCallback(() => {
    const lastFinishedPosition = Math.max(
      0,
      ...zombieGame.survivors.map((p) => p.finishPosition || 0)
    );

    const newlyFinishedPlayers = zombieGame.survivors.filter(
      (p) =>
        !p.gotBitten &&
        p.totalMetresRun === ZOMBIE_RUNNING_TRACK_LENGTH_METRES &&
        !p.finishPosition
    );

    setZombieGame({
      ...zombieGame,
      gameStatus: ZombieRunGameStatus.GAME_OVER,
      survivors: zombieGame.survivors.map((s) =>
        newlyFinishedPlayers.find((p) => p.id === s.id)
          ? { ...s, finishPosition: lastFinishedPosition + 1 }
          : s
      ),
    });
  }, [zombieGame]);

  const moveOriginalZombie = useCallback(() => {
    const originalZombieNewTotalDistance = Math.min(
      zombieGame.originalZombie.totalMetresRun +
        zombieGame.originalZombie.totalMetresToRun,
      ZOMBIE_RUNNING_TRACK_LENGTH_METRES - 1
    );

    const playersGonnaGetBitten = zombieGame.survivors
      .filter((p) => !p.gotBitten)
      .filter((p) => p.totalMetresRun <= originalZombieNewTotalDistance);

    setZombieGame({
      ...zombieGame,
      gameStatus: ZombieRunGameStatus.ORIGINAL_ZOMBIE_RUNNING,
      survivors: zombieGame.survivors.map((s) => ({
        ...s,
        gotBitten:
          s.gotBitten || !!playersGonnaGetBitten.find((p) => p.id === s.id),
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
        gotBitten:
          s.gotBitten || !!playersGonnaGetBitten.find((p) => p.id === s.id),
      })),
      zombies: zombieGame.zombies.map((z) => ({
        ...z,
        totalMetresRun: Math.min(
          z.totalMetresRun + z.totalMetresToRun,
          ZOMBIE_RUNNING_TRACK_LENGTH_METRES - 1
        ),
        totalMetresToRun: 0,
      })),
    });
  }, [zombieGame]);

  return {
    zombieGame,
    run,
    checkForWinners,
    moveOriginalZombie,
    moveBittenZombies,
    setZombieGameStatus: (status) =>
      setZombieGame({ ...zombieGame, gameStatus: status }),
  };
};
