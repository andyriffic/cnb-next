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
  position: relative;
`;

const PlayerShipContainer = styled.div`
  transform: rotate(45deg);
`;

const PlayerStatusIndicator = styled.div`
  font-size: 1rem;
  position: absolute;
`;

type Props = {
  player: SpaceRacePlayer;
};

export const PlayerShip = ({ player }: Props) => {
  return (
    <Container>
      <PlayerShipContainer>🚀</PlayerShipContainer>
      <PlayerStatusIndicator>
        {player.plannedCourse.lockedIn ? (
          <span
            style={{ backgroundColor: "black" }}
          >{`${player.plannedCourse.up},${player.plannedCourse.right}`}</span>
        ) : (
          "❌"
        )}
      </PlayerStatusIndicator>
    </Container>
  );
};
