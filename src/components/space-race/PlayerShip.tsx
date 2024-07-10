import styled from "styled-components";
import { fadeInOutRight } from "../animations/keyframes/fade";
import { STARMAP_HEIGHT, STARMAP_WIDTH } from "./constants";
import { SpaceRacePlayer } from "./types";

const Container = styled.div`
  font-size: 3rem;
  width: ${100 / STARMAP_WIDTH}vw;
  height: ${100 / STARMAP_HEIGHT}vh;
  // border: 1px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
`;

const CollisionIndicator = styled.div`
  position: absolute;
  right: 0;
  animation: ${fadeInOutRight} 1000ms ease-in 0ms 1 both;
`;

const PlayerName = styled.div<{ colorHex: string }>`
  position: absolute;
  top: 30%;
  font-size: 0.8rem;
  line-height: 1;
  color: ${({ colorHex }) => colorHex};
  // background-color: ${({ colorHex }) => colorHex};
  text-transform: uppercase;
`;

const PlayerShipContainer = styled.div<{ colorHex: string }>`
  transform: rotate(45deg);
  // color: transparent;
  // text-shadow: 0 0 0 ${({ colorHex }) => colorHex};
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
      <PlayerName colorHex={player.color}>{player.name}</PlayerName>
      <PlayerShipContainer colorHex={player.color}>🚀</PlayerShipContainer>
      <PlayerStatusIndicator>
        {player.plannedCourse.lockedIn ? (
          <span style={{ backgroundColor: "black" }}></span>
        ) : (
          <span style={{ backgroundColor: "black" }}>
            {player.courseMovesRemaining}
          </span>
        )}
      </PlayerStatusIndicator>
      {player.collidedWith && <CollisionIndicator>💥</CollisionIndicator>}
    </Container>
  );
};
