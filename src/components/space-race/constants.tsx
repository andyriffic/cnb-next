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
    createEntity("asteroid", { x: 4, y: 3 }, <>🪐</>),
    createEntity("asteroid", { x: 5, y: 4 }, <>🪨</>),
    createEntity("asteroid", { x: 5, y: 1 }, <>🪨</>),
    createEntity("asteroid", { x: 5, y: 7 }, <>🪨</>),
    createEntity("asteroid", { x: 5, y: 8 }, <>🪨</>),
    createEntity("asteroid", { x: 10, y: 4 }, <>👾</>),
  ],
};

function createEntity(
  type: SpaceRaceEntityType,
  position: SpaceRaceCoordinates,
  display: JSX.Element
) {
  return { type, position, display };
}
