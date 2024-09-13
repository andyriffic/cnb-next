export enum SpaceRaceGameState {
  WAITING = 0,
  PLAYERS_MOVING = 1,
}

export type SpaceRaceGame = {
  gameOver: boolean;
  starmap: SpaceRaceStarmap;
  spacePlayers: SpacePlayersById;
  uiState: SpaceRaceUiState;
};

export type SpaceRaceUiState = {
  showGridlines: boolean;
};

export type SpacePlayersById = { [id: string]: SpaceRacePlayer };
export type SpaceRaceEntityType =
  | "satellite"
  | "planet"
  | "asteroid"
  | "asteroid"
  | "wormhole"
  | "earth"
  | "out-of-bounds";

export type SpaceRaceEntityBehaviour = "block" | "finish";

export type SpaceRaceEntity = {
  type: SpaceRaceEntityType;
  behaviour: SpaceRaceEntityBehaviour;
  position: SpaceRaceCoordinates;
  display: JSX.Element;
  removable: boolean;
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
  positionOffset?: number;
  plannedCourse: PlannedCourse;
  collidedWith?: SpaceRaceEntity;
  color: string;
};

export type SpaceRaceCoordinates = {
  x: number;
  y: number;
};
