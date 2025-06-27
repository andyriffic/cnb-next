export const ZOMBIE_RUNNING_TRACK_LENGTH_METRES = 50;

export enum ZombieRunGameStatus {
  READY_TO_START = 0,
  PLAYERS_RUNNING = 1,
  READY_FOR_ORIGINAL_ZOMBIE = 3,
  ORIGINAL_ZOMBIE_RUNNING = 4,
  READY_FOR_BITTEN_ZOMBIES = 5,
  BITTEN_ZOMBIES_RUNNING = 6,
  CHECK_FOR_NEW_WINNERS = 7,
  GAME_OVER = 8,
}

export enum ZombieRunEndGameStatus {
  ZOMBIE_PARTY = 1,
}

export type ZombiePlayer = {
  id: string;
  totalMetresRun: number;
  totalMetresToRun: number;
  isZombie: boolean;
  gotBitten: boolean;
  finishPosition?: number;
  personalBestDistance?: number;
  obstacle?: ZombieObstacle;
};

export type OriginalZombieDetails = {
  totalMetresRun: number;
  totalMetresToRun: number;
};

export type ZombieRunGame = {
  endGameStatus?: ZombieRunEndGameStatus;
  gameStatus: ZombieRunGameStatus;
  zombies: ZombiePlayer[];
  survivors: ZombiePlayer[];
  originalZombie: OriginalZombieDetails;
  obstacles: ZombieObstacle[];
};

export type ZombieObstacle = {
  index: number;
  name: string;
  icon: string;
};
