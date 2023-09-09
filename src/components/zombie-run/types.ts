export const ZOMBIE_RUNNING_TRACK_LENGTH_METRES = 50;

export enum ZombieRunGameStatus {
  READY_TO_START = 0,
  PLAYERS_RUNNING = 1,
  READY_FOR_ORIGINAL_ZOMBIE = 3,
  ORIGINAL_ZOMBIE_RUNNING = 4,
  READY_FOR_BITTEN_ZOMBIES = 5,
  BITTEN_ZOMBIES_RUNNING = 6,
  GAME_OVER = 7,
}

export type ZombiePlayer = {
  id: string;
  totalMetresRun: number;
  totalMetresToRun: number;
  isZombie: boolean;
  gotBitten: boolean;
};

export type ZombieRunGame = {
  gameStatus: ZombieRunGameStatus;
  zombies: ZombiePlayer[];
  survivors: ZombiePlayer[];
  originalZombie: {
    totalMetresRun: number;
    totalMetresToRun: number;
  };
};
