export type SpaceRaceGame = {};

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

export type SpaceRacePlayer = {
  id: string;
  name: string;
  courseMovesRemaining: number;
  currentPosition: SpaceRaceCoordinates;
  plannedCourse: {
    up: number;
    down: number;
    right: number;
  };
};

export type SpaceRaceCoordinates = {
  x: number;
  y: number;
};
