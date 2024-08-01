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
    createEntity("asteroid", { x: 4, y: 3 }),
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
    createEntity("asteroid", { x: 8, y: 7 }),
    createEntity("asteroid", { x: 10, y: 1 }),
    createEntity("asteroid", { x: 10, y: 1 }),
    createEntity("asteroid", { x: 10, y: 4 }),
    createEntity("asteroid", { x: 10, y: 5 }),
    createEntity("asteroid", { x: 10, y: 6 }),
    createEntity("asteroid", { x: 10, y: 8 }),
    createEntity("asteroid", { x: 11, y: 1 }),
    createEntity("asteroid", { x: 11, y: 2 }),
    createEntity("asteroid", { x: 12, y: 4 }),
    createEntity("asteroid", { x: 12, y: 5 }),
    createEntity("asteroid", { x: 12, y: 8 }),
    createEntity("asteroid", { x: 14, y: 0 }),
    createEntity("asteroid", { x: 14, y: 1 }),
    createEntity("asteroid", { x: 14, y: 3 }),
    createEntity("asteroid", { x: 14, y: 4 }),
    createEntity("asteroid", { x: 14, y: 6 }),
    createEntity("asteroid", { x: 14, y: 7 }),
    createEntity("asteroid", { x: 17, y: 2 }),
    createEntity("asteroid", { x: 17, y: 3 }),
    createEntity("asteroid", { x: 17, y: 5 }),
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
