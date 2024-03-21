import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import { PlayerAvatar } from "../PlayerAvatar";
import { fadeInBottom } from "../animations/keyframes/fade";
import { useSound } from "../hooks/useSound";
import { replaceFirstLetterWithZ } from "../../utils/string";
import { ZombiePlayer } from "./types";

export const ZOMBIE_COLOR = "#69B362";
const PLAYER_COLOR = "#A41E1F";

const SlippedAnimation = keyframes`
  from {
    transform: rotate(0deg);
    transform-origin: bottom center;
  }
  to {
    transform: rotate(-90deg);
    transform-origin: bottom center;
  }
`;

const ZombiePlayerContainer = styled.div`
  position: relative;
`;

const SlippedOver = styled.div<{ fallen: boolean }>`
  ${({ fallen }) =>
    fallen &&
    css`
      animation: ${SlippedAnimation} 0.5s ease-in-out 0.5s 1 both;
    `};
`;

const ZombieTransform = styled.div<{ isZombie: boolean }>`
  ${({ isZombie }) =>
    isZombie &&
    css`
      filter: hue-rotate(90deg);
    `}
`;

const BittenIndicator = styled.div`
  position: absolute;
  background: ${ZOMBIE_COLOR}};
  color: white;
  text-align: center;
  padding: 0.2rem;
  font-size: 1rem;
  animation: ${fadeInBottom} 2s ease-in-out 0.5s 1 both;
  border-radius: 0.5rem;
`;

const FinishedIndicator = styled(BittenIndicator)`
  background: yellow;
  color: black;
`;

const ObstacleIndicator = styled(BittenIndicator)`
  background: black;
  color: yellow;
`;

const PlayerDetailsContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
`;

const ArrowIndicator = styled.div<{ isZombie: boolean }>`
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;

  border-top: 20px solid
    ${({ isZombie }) => (isZombie ? ZOMBIE_COLOR : PLAYER_COLOR)};
  margin: 0 auto;
  opacity: 0.4;
`;

const PlayerName = styled.div<{ isZombie: boolean }>`
  background: ${({ isZombie }) => (isZombie ? ZOMBIE_COLOR : PLAYER_COLOR)};
  color: white;
  text-align: center;
  padding: 0.2rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  margin: 1rem 0.5rem 0;
  transition: background 1s ease-in-out;
  min-width: 100%;
`;

type Props = {
  zombiePlayer: ZombiePlayer;
  stackIndex?: number;
};

export const ZombieRunPlayer = ({ zombiePlayer, stackIndex = 0 }: Props) => {
  const { getName } = usePlayerNames();
  const { play } = useSound();
  const [fallOver, setFallOver] = useState(false);

  const originalFinishedPosition = useRef(zombiePlayer.finishPosition || 0);

  useEffect(() => {
    if (
      !!zombiePlayer.finishPosition &&
      zombiePlayer.finishPosition > originalFinishedPosition.current
    ) {
      play("rps-award-winner");
    }
  }, [play, zombiePlayer.finishPosition]);

  useEffect(() => {
    if (zombiePlayer.obstacle) {
      setTimeout(() => {
        play("zombie-run-banana");
        setFallOver(true);
      }, 2000);
    }
  }, [zombiePlayer.obstacle, play]);

  const isZombie = zombiePlayer.gotBitten || zombiePlayer.isZombie;
  const playerName = isZombie
    ? replaceFirstLetterWithZ(getName(zombiePlayer.id))
    : getName(zombiePlayer.id);

  return (
    <ZombiePlayerContainer>
      <SlippedOver fallen={fallOver}>
        <ZombieTransform isZombie={isZombie}>
          <PlayerAvatar playerId={zombiePlayer.id} size="thumbnail" />
        </ZombieTransform>
      </SlippedOver>
      {zombiePlayer.obstacle && (
        <ObstacleIndicator style={{ top: `-${(stackIndex + 1) * 30}%` }}>
          {`${getName(zombiePlayer.id)} slipped on a ${
            zombiePlayer.obstacle.name
          }`}
        </ObstacleIndicator>
      )}

      {zombiePlayer.gotBitten && (
        <BittenIndicator style={{ top: `-${(stackIndex + 1) * 30}%` }}>
          {getName(zombiePlayer.id)} got bitten 😱
        </BittenIndicator>
      )}
      {!!zombiePlayer.finishPosition && (
        <FinishedIndicator style={{ top: `-${(stackIndex + 1) * 30}%` }}>
          {`${getName(zombiePlayer.id)} 🏁 # ${zombiePlayer.finishPosition}`}
        </FinishedIndicator>
      )}
      <PlayerDetailsContainer>
        {/* <ArrowIndicator isZombie={isZombie} /> */}
        <PlayerName
          isZombie={isZombie}
          style={{ transform: `translateY(${stackIndex * 100}%)` }}
        >
          {playerName}{" "}
          {zombiePlayer.totalMetresToRun > 0 &&
            `(${zombiePlayer.totalMetresToRun})`}
          {/* {`(index ${zombiePlayer.totalMetresRun})`} */}
        </PlayerName>
      </PlayerDetailsContainer>
    </ZombiePlayerContainer>
  );
};
