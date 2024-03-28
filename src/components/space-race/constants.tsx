import {
  SpaceRaceCoordinates,
  SpaceRaceEntityType,
  SpaceRaceStarmap,
} from "./types";

export const STARMAP_WIDTH = 20;
export const STARMAP_HEIGHT = 9;

export const STARMAP_CHART: SpaceRaceStarmap = {
  entities: [
    createEntity("home-base", { x: 0, y: 4 }, <>🛰️</>),
    createEntity("home-base", { x: 4, y: 3 }, <>🪐</>),
    createEntity("home-base", { x: 16, y: 7 }, <>☄️</>),
    createEntity("home-base", { x: 10, y: 4 }, <>👾</>),
  ],
};

function createEntity(
  type: SpaceRaceEntityType,
  position: SpaceRaceCoordinates,
  display: JSX.Element
) {
  return { type, position, display };
}
