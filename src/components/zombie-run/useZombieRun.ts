import { useCallback, useState } from "react";
import { Player } from "../../types/Player";
import { calculateMedian } from "../../utils/number";
import {
  OriginalZombieDetails,
  ZOMBIE_RUNNING_TRACK_LENGTH_METRES,
  ZombieObstacle,
  ZombiePlayer,
  ZombieRunEndGameStatus,
  ZombieRunGame,
  ZombieRunGameStatus,
} from "./types";

const MIN_PLAYER_MOVES = 1;
const MAX_ZOMBIE_MOVES = 3;
const ZOMBIE_BOOST_MOVES = 3;

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
  originalZombie: OriginalZombieDetails,
): ZombieRunGame => {
  const survivorsWithMoves = players
    .filter((p) => !p.details?.zombieRun?.isZombie)
    .filter((p) => (p.details?.gameMoves || 0) > 0);

  const minSurvivorMoves =
    survivorsWithMoves.length > 0
      ? Math.min(...survivorsWithMoves.map((p) => p.details?.gameMoves || 0))
      : 0;

  // const medianSurvivorMoves =
  //   calculateMedian(survivorsWithMoves.map((p) => p.details?.gameMoves || 0)) ||
  //   0;

  // const zombieMoves = Math.max(medianSurvivorMoves, 1);

  // const zombiePlayersWithMoves = players
  //   .filter((p) => !!p.details?.zombieRun?.isZombie)
  //   .filter((p) => (p.details?.gameMoves || 0) > 0);

  // const minZombiePlayerMoves =
  //   zombiePlayersWithMoves.length > 0
  //     ? Math.min(
  //         ...zombiePlayersWithMoves.map(
  //           (p) => p.details?.gameMoves || originalZombie.totalMetresToRun,
  //         ),
  //       )
  //     : originalZombie.totalMetresToRun;

  const maxSurvivorMetresRun = Math.max(
    ...players
      .filter((p) => !p.details?.zombieRun?.isZombie)
      .map((p) => p.details?.zombieRun?.totalMetresRun || 0),
  );

  const activeObstacles: ZombieObstacle[] = [
    {
      action: "zombie-boost",
      index: 10,
      name: "Brains",
      icon: "🧠",
    } as const,
    {
      action: "zombie-boost",
      index: 15,
      name: "Brains",
      icon: "🧠",
    } as const,
    {
      action: "player-stop",
      index: 22,
      name: "Banana",
      icon: "🍌",
    } as const,
    {
      action: "zombie-boost",
      index: 24,
      name: "Brains",
      icon: "🧠",
    } as const,
    {
      action: "zombie-boost",
      index: 30,
      name: "Brains",
      icon: "🧠",
    } as const,
    {
      action: "player-stop",
      index: 35,
      name: "Banana",
      icon: "🍌",
    } as const,
    {
      action: "zombie-boost",
      index: 40,
      name: "Brains",
      icon: "🧠",
    } as const,

    {
      action: "player-stop",
      index: 44,
      name: "Banana",
      icon: "🍌",
    } as const,
  ].map((o) => ({
    ...o,
    enabled:
      (o.action === "player-stop" && o.index > maxSurvivorMetresRun) ||
      o.action === "zombie-boost",
  }));

  return {
    gameStatus: ZombieRunGameStatus.READY_TO_START,
    survivors: players
      .filter((p) => !p.details?.zombieRun?.isZombie)
      .map((p) => ({
        id: p.id,
        totalMetresRun: p.details?.zombieRun?.totalMetresRun || 0,
        totalMetresToRun:
          p.details?.gameMoves || minSurvivorMoves || MIN_PLAYER_MOVES,
        isZombie: false,
        gotBitten: false,
        finishPosition: p.details?.zombieRun?.finishPosition,
        nerfedPoints: 0,
      })),
    zombies: players
      .filter((p) => !!p.details?.zombieRun?.isZombie)
      .map((p) => ({
        id: p.id,
        totalMetresRun: p.details?.zombieRun?.totalMetresRun || 0,
        totalMetresToRun: Math.min(p.details?.gameMoves || 0, MAX_ZOMBIE_MOVES),
        isZombie: true,
        gotBitten: false,
        nerfedPoints: Math.max(
          0,
          (p.details?.gameMoves || 0) - MAX_ZOMBIE_MOVES,
        ),
      })),
    originalZombie,
    obstacles: activeObstacles,
  };
};

type MovePlayerResult = {
  finalIndex: number;
  hitObstacle?: ZombieObstacle;
};

const getMovePlayerResult = (
  player: ZombiePlayer,
  game: ZombieRunGame,
): MovePlayerResult => {
  const startingIndex = player.totalMetresRun;
  const finalIndex = Math.min(
    player.totalMetresRun + player.totalMetresToRun,
    ZOMBIE_RUNNING_TRACK_LENGTH_METRES,
  );
  const hitObstacle = game.obstacles.find(
    (o) =>
      o.enabled == true &&
      o.action === "player-stop" &&
      o.index > startingIndex &&
      o.index <= finalIndex,
  );

  return {
    finalIndex: hitObstacle ? hitObstacle.index : finalIndex,
    hitObstacle,
  };
};

export const useZombieRun = (
  players: Player[],
  originalZombie: OriginalZombieDetails,
): UseZombieRun => {
  const [zombieGame, setZombieGame] = useState(
    createZombieGame(players, originalZombie),
  );

  const run = useCallback(() => {
    setZombieGame({
      ...zombieGame,
      gameStatus: ZombieRunGameStatus.PLAYERS_RUNNING,
      survivors: zombieGame.survivors.map((s) => {
        const moveResult = getMovePlayerResult(s, zombieGame);

        return {
          ...s,
          totalMetresRun: moveResult.finalIndex,
          obstacle: moveResult.hitObstacle,
          totalMetresToRun: 0,
        };
      }),
    });
  }, [zombieGame]);

  const checkForWinners = useCallback(() => {
    const lastFinishedPosition = Math.max(
      0,
      ...zombieGame.survivors.map((p) => p.finishPosition || 0),
    );

    const newlyFinishedPlayers = zombieGame.survivors.filter(
      (p) =>
        !p.gotBitten &&
        p.totalMetresRun === ZOMBIE_RUNNING_TRACK_LENGTH_METRES &&
        !p.finishPosition,
    );

    const allPlayersAreZombies =
      zombieGame.survivors.every((p) => p.gotBitten) ||
      zombieGame.survivors.length === 0;

    setZombieGame({
      ...zombieGame,
      endGameStatus: allPlayersAreZombies
        ? ZombieRunEndGameStatus.ZOMBIE_PARTY
        : undefined,
      gameStatus: ZombieRunGameStatus.GAME_OVER,
      survivors: zombieGame.survivors.map((s) =>
        newlyFinishedPlayers.find((p) => p.id === s.id)
          ? { ...s, finishPosition: lastFinishedPosition + 1 }
          : s,
      ),
    });
  }, [zombieGame]);

  const moveOriginalZombie = useCallback(() => {
    const originalZombieNewTotalDistance = Math.min(
      zombieGame.originalZombie.totalMetresRun +
        zombieGame.originalZombie.totalMetresToRun,
      ZOMBIE_RUNNING_TRACK_LENGTH_METRES - 1,
    );

    const playersGonnaGetBitten = zombieGame.survivors
      .filter((p) => !p.gotBitten)
      .filter((p) => p.totalMetresRun <= originalZombieNewTotalDistance);

    const zombieBoost = zombieGame.obstacles.find(
      (o) =>
        o.enabled == true &&
        o.action === "zombie-boost" &&
        o.index > zombieGame.originalZombie.totalMetresRun &&
        o.index <= originalZombieNewTotalDistance,
    );

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
        totalMetresRun: !!zombieBoost
          ? originalZombieNewTotalDistance + ZOMBIE_BOOST_MOVES
          : originalZombieNewTotalDistance,
        totalMetresToRun: 0,
        boost: !!zombieBoost,
      },
    });
  }, [zombieGame]);

  const moveBittenZombies = useCallback(() => {
    const maxBittenZombieDistance = Math.max(
      ...zombieGame.zombies.map((z) => z.totalMetresRun + z.totalMetresToRun),
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
          ZOMBIE_RUNNING_TRACK_LENGTH_METRES - 1,
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
