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
  position: SpaceRaceCoordinates;
};

export type SpaceRaceCoordinates = {
  x: number;
  y: number;
};
