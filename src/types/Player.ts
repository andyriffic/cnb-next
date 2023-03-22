export type Player = {
  id: string;
  name: string;
  tags: string[];
  details?: PlayerDetails;
};

export type PlayerDetails = {
  gameMoves?: number;
  whosThatCount?: number;
};

export type PlayerNames = { [playerId: string]: string };
