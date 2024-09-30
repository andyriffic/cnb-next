import { useEffect, useMemo, useRef } from "react";
import styled, { css } from "styled-components";
import tinycolor from "tinycolor2";
import { Animation_Pulse_Plus } from "../animations/Attention";
import { fadeInOutRight, fadeOut } from "../animations/keyframes/fade";
import { useSound } from "../hooks/useSound";
import { STARMAP_CHART, STARMAP_HEIGHT, STARMAP_WIDTH } from "./constants";
import { SpaceRacePlayer } from "./types";

const Container = styled.div<{ hide: boolean; attention: boolean }>`
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
  z-index: unset;
  ${({ hide }) =>
    hide &&
    css`
      animation: ${fadeOut} 1000ms ease-in 0ms 1 both;
    `}

  ${({ attention }) =>
    attention &&
    css`
      animation: ${Animation_Pulse_Plus} 3s ease-in-out 1 both;
      z-index: 1;
    `}

  &:hover {
    z-index: 1;
  }
`;

const CollisionIndicator = styled.div`
  position: absolute;
  right: 0;
  animation: ${fadeInOutRight} 1000ms ease-in 0ms 1 both;
`;

const PlayerName = styled.div<{ attention: boolean }>`
  position: absolute;
  top: 30%;
  font-size: 0.8rem;
  line-height: 1;
  text-transform: uppercase;
  padding: 0.2rem 0.7rem 0.2rem 0.2rem;
  border-radius: 0 1rem 0 0;
  z-index: unset;
  ${({ attention }) =>
    attention &&
    css`
      animation: ${Animation_Pulse_Plus} 3s ease-in-out 1 both;
      // z-index: 1;
    `}
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

  const landed = useMemo(() => {
    return STARMAP_CHART.entities.some(
      (e) =>
        e.behaviour === "finish" &&
        e.position.x === player.currentPosition.x &&
        e.position.y === player.currentPosition.y
    );
  }, [player.currentPosition.x, player.currentPosition.y]);

  useEffect(() => {
    if (player.collidedWith) {
      if (player.collidedWith.behaviour === "block") {
        play("space-race-rocket-collision");
      }
      if (player.collidedWith.type === "earth") {
        play("space-race-player-finish");
      }
    }
  }, [play, player.collidedWith]);

  const playerNameFontColour = useRef(
    tinycolor.mostReadable(player.color, ["#fff", "#000"]).toHexString()
  );

  return (
    <Container hide={landed} attention={player.highlight}>
      <PlayerName
        attention={player.highlight}
        style={{
          color: playerNameFontColour.current,
          backgroundColor: player.color,
        }}
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
