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
  hasGameAdvantage?: boolean;
  totalCoins?: number;
  availableCoins?: number;
  role?: string;
  whosThatCount?: number;
  pacmanPlayer?: boolean;
  team?: string;
  pacmanDetails?: PacmanDetails;
  zombieRun?: ZombieRunDetails;
  achievements?: PlayerAchievements;
  spaceRace?: SpaceRaceDetails;
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
export type SpaceRaceDetails = {
  xCoordinate: number;
  yCoordinate: number;
};

export type PlayerAchievements = {
  blah: string;
  pacman: {
    totalWins: number;
  };
  zombieRun: {
    totalWins: number;
    timesBitten: number;
  };
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

const DEFAULT_SPACE_RACE_DETAILS: SpaceRaceDetails = {
  xCoordinate: 0,
  yCoordinate: 0,
};

export const getPlayerAchievements = (player: Player): PlayerAchievements => {
  return {
    blah: "blah",
    pacman: {
      totalWins: 0,
    },
    zombieRun: {
      totalWins: 0,
      timesBitten: 0,
    },
    ...player.details?.achievements,
  };
};

export const getPlayerAvailableCoins = (player: Player): number =>
  player.details?.availableCoins || 0;

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

export const getPlayerSpaceRaceDetails = (player: Player): SpaceRaceDetails => {
  return {
    ...DEFAULT_SPACE_RACE_DETAILS,
    ...player.details?.spaceRace,
  };
};
