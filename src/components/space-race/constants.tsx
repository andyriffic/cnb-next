import {
  SpaceRaceCoordinates,
  SpaceRaceEntityBehaviour,
  SpaceRaceEntityType,
  SpaceRaceStarmap,
} from "./types";

export const STARMAP_WIDTH = 30;
export const STARMAP_HEIGHT = 9;

export const STARMAP_CHART: SpaceRaceStarmap = {
  entities: [
    // createEntity("home-base", { x: 0, y: 4 }),
    createEntity("asteroid", { x: 2, y: 4 }),
    createEntity("asteroid", { x: 2, y: 6 }),
    createEntity("asteroid", { x: 2, y: 8 }),
    createEntity("asteroid", { x: 3, y: 0 }),
    createEntity("asteroid", { x: 3, y: 2 }),
    createEntity("planet", { x: 4, y: 3 }),
    createEntity("asteroid", { x: 5, y: 1 }),
    // createEntity("asteroid", { x: 5, y: 4 }),
    createEntity("asteroid", { x: 5, y: 7 }),
    createEntity("asteroid", { x: 5, y: 8 }),
    createEntity("asteroid", { x: 6, y: 5 }),
    createEntity("asteroid", { x: 6, y: 8 }),
    createEntity("asteroid", { x: 7, y: 0 }),
    createEntity("asteroid", { x: 7, y: 2 }),
    createEntity("asteroid", { x: 7, y: 3 }),
    createEntity("asteroid", { x: 7, y: 6 }),
    createEntity("asteroid", { x: 8, y: 4 }),
    createEntity("satellite", { x: 8, y: 7 }),
    createEntity("asteroid", { x: 10, y: 1 }),
    createEntity("asteroid", { x: 10, y: 1 }),
    createEntity("asteroid", { x: 10, y: 4 }),
    createEntity("asteroid", { x: 10, y: 5 }),
    createEntity("asteroid", { x: 10, y: 6 }),
    createEntity("asteroid", { x: 10, y: 8 }),
    createEntity("asteroid", { x: 11, y: 1 }),
    createEntity("planet", { x: 11, y: 2 }),
    createEntity("asteroid", { x: 12, y: 4 }),
    createEntity("asteroid", { x: 12, y: 5 }),
    createEntity("asteroid", { x: 12, y: 8 }),
    createEntity("asteroid", { x: 13, y: 0 }),
    createEntity("asteroid", { x: 14, y: 1 }),
    createEntity("asteroid", { x: 14, y: 3 }),
    createEntity("asteroid", { x: 14, y: 4 }),
    createEntity("planet", { x: 14, y: 6 }),
    createEntity("asteroid", { x: 14, y: 7 }),
    createEntity("asteroid", { x: 15, y: 1 }),
    createEntity("asteroid", { x: 16, y: 7 }),
    createEntity("asteroid", { x: 16, y: 8 }),
    createEntity("satellite", { x: 17, y: 1 }),
    createEntity("asteroid", { x: 17, y: 2 }),
    createEntity("asteroid", { x: 17, y: 3 }),
    createEntity("asteroid", { x: 17, y: 5 }),
    createEntity("asteroid", { x: 19, y: 0 }),
    createEntity("satellite", { x: 19, y: 3 }),
    createEntity("asteroid", { x: 19, y: 4 }),
    createEntity("asteroid", { x: 19, y: 6 }),
    createEntity("asteroid", { x: 19, y: 7 }),
    createEntity("asteroid", { x: 21, y: 1 }),
    createEntity("asteroid", { x: 21, y: 2 }),
    createEntity("asteroid", { x: 21, y: 5 }),
    createEntity("asteroid", { x: 22, y: 8 }),
    createEntity("asteroid", { x: 23, y: 0 }),
    createEntity("asteroid", { x: 23, y: 1 }),
    createEntity("asteroid", { x: 23, y: 3 }),
    createEntity("asteroid", { x: 23, y: 4 }),
    createEntity("asteroid", { x: 23, y: 5 }),
    createEntity("asteroid", { x: 23, y: 6 }),
    createEntity("asteroid", { x: 23, y: 8 }),
    createEntity("asteroid", { x: 29, y: 0 }),
    createEntity("asteroid", { x: 29, y: 1 }),
    createEntity("asteroid", { x: 29, y: 2 }),
    createEntity("asteroid", { x: 29, y: 3 }),
    createEntity("asteroid", { x: 29, y: 4 }),
    createEntity("asteroid", { x: 29, y: 5 }),
    createEntity("asteroid", { x: 29, y: 6 }),
    createEntity("asteroid", { x: 29, y: 7 }),
    createEntity("asteroid", { x: 29, y: 8 }),
  ],
};

export function createEntity(
  type: SpaceRaceEntityType,
  position: SpaceRaceCoordinates,
  behaviour: SpaceRaceEntityBehaviour = "block"
) {
  return { type, position, display: getDisplayElement(type), behaviour };
}

function getDisplayElement(entityType: SpaceRaceEntityType): JSX.Element {
  switch (entityType) {
    case "satellite":
      return <>🛰️</>;
    case "planet":
      return <span style={{ transform: "scale(1.5)" }}>🪐</span>;
    case "asteroid":
      return <>🪨</>;
    case "wormhole":
      return <>🌀</>;
    default:
      return <></>;
  }
}
