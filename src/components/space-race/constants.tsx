import Image from "next/image";
import styled from "styled-components";
import { Attention } from "../animations/Attention";
import THEME from "../../themes";
import cnyGoldIngot from "./cny-gold-ingot.png";
import cnyRedLantern from "./cny-red-lantern.png";
import cnyFireCrackers from "./cny-fire-crackers.png";
import cnyGrandGate from "./cny-grand-gate.png";
import cnyWoodenGate from "./cny-wooden-hurdle.png";
import {
  SpaceRaceCoordinates,
  SpaceRaceEntity,
  SpaceRaceEntityBehaviour,
  SpaceRaceEntityType,
  SpaceRaceStarmap,
} from "./types";

export const STARMAP_WIDTH = 30;
export const STARMAP_HEIGHT = 9;

const Gate = styled.div`
  position: relative;
`;
const GateValue = styled.div`
  position: absolute;
  font-size: 1rem;
  font-family: ${THEME.tokens.fonts.numbers};
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: darkred;
  padding: 0.2rem;
  border-radius: 1rem;
`;
const GateIcon = styled.div``;

const EntityContainer = styled.div`
  position: relative;
`;
const EntityTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: -50%;
  font-size: 0.6rem;
  text-transform: uppercase;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.2rem 0.2rem;
  border-radius: 0.5rem;
  border: 2px solid darkred;
  text-align: center;
`;

export const STARMAP_CHART: SpaceRaceStarmap = {
  entities: [
    // createEntity("home-base", { x: 0, y: 4 }),
    createEntity("asteroid", { x: 2, y: 4 }),
    createEntity("asteroid", { x: 2, y: 6 }),
    createEntity("asteroid", { x: 2, y: 8 }),
    createEntity("asteroid", { x: 3, y: 0 }),
    createEntity("asteroid", { x: 3, y: 2 }),
    createEntity("planet", { x: 4, y: 3 }, "block", undefined, false),
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
    // createEntity("asteroid", { x: 8, y: 4 }),
    createEntity("satellite", { x: 8, y: 7 }, "block", undefined, false),
    createEntity("asteroid", { x: 10, y: 1 }),
    createEntity("asteroid", { x: 10, y: 1 }),
    createEntity("asteroid", { x: 10, y: 4 }),
    createEntity("asteroid", { x: 10, y: 5 }),
    createEntity("gate", { x: 10, y: 6 }, "block", 2),
    createEntity("asteroid", { x: 10, y: 8 }),
    createEntity("asteroid", { x: 11, y: 1 }),
    createEntity("planet", { x: 11, y: 2 }, "block", undefined, false),
    createEntity("asteroid", { x: 12, y: 4 }),
    createEntity("asteroid", { x: 12, y: 5 }),
    createEntity("asteroid", { x: 12, y: 8 }),
    createEntity("gate", { x: 13, y: 0 }, "block", 2),
    createEntity("asteroid", { x: 14, y: 1 }),
    createEntity("gate", { x: 14, y: 3 }, "block", 2),
    createEntity("asteroid", { x: 14, y: 4 }),
    createEntity("planet", { x: 14, y: 6 }, "block", undefined, false),
    createEntity("asteroid", { x: 14, y: 7 }),
    createEntity("asteroid", { x: 15, y: 1 }),
    createEntity("asteroid", { x: 16, y: 7 }),
    createEntity("gate", { x: 16, y: 8 }, "block", 2),
    createEntity("satellite", { x: 17, y: 1 }, "block", undefined, false),
    createEntity("gate", { x: 17, y: 2 }, "block", 2),
    createEntity("asteroid", { x: 17, y: 3 }),
    createEntity("asteroid", { x: 17, y: 5 }),
    createEntity("asteroid", { x: 19, y: 0 }),
    createEntity("satellite", { x: 19, y: 3 }, "block", undefined, false),
    createEntity("asteroid", { x: 19, y: 4 }),
    createEntity("gate", { x: 19, y: 6 }, "block", 2),
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
    createEntity("asteroid", { x: 25, y: 2 }),
    createEntity("asteroid", { x: 25, y: 7 }),
    createEntity("asteroid", { x: 27, y: 1 }),
    createEntity("asteroid", { x: 27, y: 2 }),
    createEntity("gate", { x: 27, y: 4 }, "block", 6),
    createEntity("asteroid", { x: 27, y: 5 }),
    createEntity("asteroid", { x: 27, y: 6 }),
    createEntity("asteroid", { x: 27, y: 8 }),
    createEntity("satellite", { x: 29, y: 0 }),
    createEntity("earth1", { x: 29, y: 1 }, "finish"),
    createEntity("satellite", { x: 29, y: 2 }),
    createEntity("satellite", { x: 29, y: 3 }),
    createEntity("earth2", { x: 29, y: 4 }, "finish"),
    createEntity("satellite", { x: 29, y: 5 }),
    createEntity("satellite", { x: 29, y: 6 }),
    createEntity("earth3", { x: 29, y: 7 }, "finish"),
    createEntity("satellite", { x: 29, y: 8 }),
  ],
};

export function createEntity(
  type: SpaceRaceEntityType,
  position: SpaceRaceCoordinates,
  behaviour: SpaceRaceEntityBehaviour = "block",
  initialValue = 0,
  removable = true,
  allowedPlayerIds: string[] = [],
) {
  return {
    type,
    position,
    display: getDisplayElement(type, initialValue),
    behaviour,
    removable,
    value: initialValue,
    allowedPlayerIds,
  };
}

export function renderEntity(entity: SpaceRaceEntity) {
  return getDisplayElement(entity.type, entity.value || 0);
}

function getDisplayElement(
  entityType: SpaceRaceEntityType,
  initialValue: number,
): JSX.Element {
  switch (entityType) {
    case "satellite":
      return (
        <Image src={cnyRedLantern} alt="Red lantern" width={60} height={60} />
      );
    case "planet":
      return (
        <Image src={cnyGoldIngot} alt="Gold ingot" width={60} height={60} />
      );

    case "asteroid":
      return (
        <Image
          src={cnyFireCrackers}
          alt="Fire crackers"
          width={45}
          height={45}
        />
      );
    case "gate":
      return (
        <Gate>
          <Image src={cnyWoodenGate} alt="Wooden gate" width={80} height={80} />
          <GateValue>{initialValue}</GateValue>
        </Gate>
      );
    case "earth1":
      return (
        <Attention animation="pulse">
          <Image src={cnyGrandGate} alt="Grand gate" width={80} height={80} />
        </Attention>
      );
    case "earth2":
      return (
        <Attention animation="pulse">
          <EntityContainer>
            <Image src={cnyGrandGate} alt="Grand gate" width={80} height={80} />
            <EntityTitle>Listing Visualisation</EntityTitle>
          </EntityContainer>
        </Attention>
      );
    case "earth3":
      return (
        <Attention animation="pulse">
          <Image src={cnyGrandGate} alt="Grand gate" width={100} height={100} />
        </Attention>
      );
    default:
      return <></>;
  }
}
