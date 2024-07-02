export type SpaceRaceGame = {
  starmap: SpaceRaceStarmap;
  spacePlayers: SpacePlayersById;
};

export type SpacePlayersById = { [id: string]: SpaceRacePlayer };
export type SpaceRaceEntityType =
  | "home-base"
  | "planet"
  | "asteroid"
  | "wormhole";

export type SpaceRaceEntity = {
  type: SpaceRaceEntityType;
  position: SpaceRaceCoordinates;
  display: JSX.Element;
};

export type SpaceRaceStarmap = {
  entities: SpaceRaceEntity[];
};

export type PlannedCourse = {
  up: number;
  right: number;
  lockedIn: boolean;
  movedVertically: boolean;
  movedHorizontally: boolean;
};

export type SpaceRacePlayer = {
  id: string;
  name: string;
  courseMovesRemaining: number;
  currentPosition: SpaceRaceCoordinates;
  plannedCourse: PlannedCourse;
};

export type SpaceRaceCoordinates = {
  x: number;
  y: number;
};
