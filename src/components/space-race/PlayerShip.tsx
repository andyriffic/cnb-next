import styled from "styled-components";
import { STARMAP_HEIGHT, STARMAP_WIDTH } from "./constants";
import { SpaceRaceEntity, SpaceRacePlayer } from "./types";

const Container = styled.div`
  font-size: 3rem;
  width: ${100 / STARMAP_WIDTH}vw;
  height: ${100 / STARMAP_HEIGHT}vh;
  // border: 1px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayerShipContainer = styled.div`
  transform: rotate(45deg);
`;

type Props = {
  player: SpaceRacePlayer;
};

export const PlayerShip = ({ player }: Props) => {
  return (
    <Container>
      <PlayerShipContainer>🚀</PlayerShipContainer>
    </Container>
  );
};
