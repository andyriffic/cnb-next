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
};

export type PacmanDetails = {
  index: number;
  jailTurnsRemaining: number;
  hasPowerPill: boolean;
};

export type PlayerNames = { [playerId: string]: string };

export const DEFAULT_PACMAN_DETAILS: PacmanDetails = {
  index: 0,
  jailTurnsRemaining: 0,
  hasPowerPill: false,
};

export const getPlayerPacManDetails = (player: Player): PacmanDetails => {
  return {
    ...DEFAULT_PACMAN_DETAILS,
    ...player.details?.pacmanDetails,
  };
};
