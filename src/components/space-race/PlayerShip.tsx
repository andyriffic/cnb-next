import styled from "styled-components";
import tinycolor from "tinycolor2";
import { useEffect } from "react";
import { fadeInOutRight } from "../animations/keyframes/fade";
import { useSound } from "../hooks/useSound";
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
  cursor: pointer;

  &:hover {
    z-index: 1;
  }
`;

const CollisionIndicator = styled.div`
  position: absolute;
  right: 0;
  animation: ${fadeInOutRight} 1000ms ease-in 0ms 1 both;
`;

const PlayerName = styled.div`
  position: absolute;
  top: 30%;
  font-size: 0.8rem;
  line-height: 1;
  text-transform: uppercase;
  padding: 0.2rem 0.7rem 0.2rem 0.2rem;
  border-radius: 0 1rem 0 0;
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
  const { play } = useSound();

  useEffect(() => {
    if (player.collidedWith && player.collidedWith.behaviour === "block") {
      play("space-race-rocket-collision");
    }
  }, [play, player.collidedWith]);

  const playerNameFontColour = tinycolor
    .mostReadable(player.color, ["#fff", "#000"])
    .toHexString();

  return (
    <Container>
      <PlayerName
        style={{ color: playerNameFontColour, backgroundColor: player.color }}
      >
        {player.name}
      </PlayerName>
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
      {player.collidedWith && player.collidedWith.behaviour === "block" && (
        <CollisionIndicator>💥</CollisionIndicator>
      )}
    </Container>
  );
};
