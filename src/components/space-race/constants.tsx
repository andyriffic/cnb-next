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
    createEntity("planet", { x: 4, y: 3 }),
    createEntity("asteroid", { x: 5, y: 4 }),
    createEntity("asteroid", { x: 5, y: 1 }),
    createEntity("asteroid", { x: 5, y: 7 }),
    createEntity("asteroid", { x: 5, y: 8 }),
    createEntity("planet", { x: 10, y: 4 }),
  ],
};

function createEntity(
  type: SpaceRaceEntityType,
  position: SpaceRaceCoordinates,
  behaviour: SpaceRaceEntityBehaviour = "block"
) {
  return { type, position, display: getDisplayElement(type), behaviour };
}

function getDisplayElement(entityType: SpaceRaceEntityType): JSX.Element {
  switch (entityType) {
    case "home-base":
      return <>🛰️</>;
    case "planet":
      return <span style={{ transform: "scale(1.5)" }}>🪐</span>;
    case "asteroid":
      return <>🪨</>;
    case "wormhole":
      return <>🌀</>;
  }
}
