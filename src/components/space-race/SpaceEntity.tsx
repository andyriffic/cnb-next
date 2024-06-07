import styled from "styled-components";
import { STARMAP_HEIGHT, STARMAP_WIDTH } from "./constants";
import { SpaceRaceEntity } from "./types";

const Container = styled.div`
  font-size: 3rem;
  width: ${100 / STARMAP_WIDTH}vw;
  height: ${100 / STARMAP_HEIGHT}vh;
  border: 1px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  entity: SpaceRaceEntity;
};

export const SpaceEntity = ({ entity }: Props) => {
  return <Container>{entity.display}</Container>;
};
