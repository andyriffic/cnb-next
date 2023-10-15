export type Player = {
  id: string;
  name: string;
  tags: string[];
  details?: PlayerDetails;
};

export type PlayerDetails = {
  gameMoves?: number;
  colourHex?: string;
  retired?: boolean;
  whosThatCount?: number;
  pacmanPlayer?: boolean;
  team?: string;
  pacmanDetails?: PacmanDetails;
  zombieRun?: ZombieRunDetails;
};

export type PacmanDetails = {
  index: number;
  jailTurnsRemaining: number;
  hasPowerPill: boolean;
};

export type ZombieRunDetails = {
  totalMetresRun: number;
  isZombie: boolean;
  finishPosition?: number;
  // playersBitten: string[];
};

export type PlayerNames = { [playerId: string]: string };

export const DEFAULT_PACMAN_DETAILS: PacmanDetails = {
  index: 0,
  jailTurnsRemaining: 0,
  hasPowerPill: false,
};

const DEFAULT_ZOMBIE_RUN_DETAILS: ZombieRunDetails = {
  totalMetresRun: 0,
  isZombie: false,
  // playersBitten: [],
};

export const getPlayerPacManDetails = (player: Player): PacmanDetails => {
  return {
    ...DEFAULT_PACMAN_DETAILS,
    ...player.details?.pacmanDetails,
  };
};

export const getPlayerZombieRunDetails = (player: Player): ZombieRunDetails => {
  return {
    ...DEFAULT_ZOMBIE_RUN_DETAILS,
    ...player.details?.zombieRun,
  };
};
