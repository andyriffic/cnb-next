export const ZOMBIE_RUNNING_TRACK_LENGTH_METRES = 50;

export type ZombiePlayer = {
  id: string;
  totalMetresRun: number;
  totalMetresToRun: number;
  isZombie: boolean;
  gotBitten: boolean;
};

export type ZombieRunGame = {
  zombies: ZombiePlayer[];
  survivors: ZombiePlayer[];
  originalZombie: {
    totalMetresRun: number;
    totalMetresToRun: number;
  };
};
