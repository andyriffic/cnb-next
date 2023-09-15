import styled, { css } from "styled-components";
import { useEffect, useMemo } from "react";
import { PlayerAvatar } from "../PlayerAvatar";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import { Appear } from "../animations/Appear";
import { fadeInOutBottomToTop } from "../animations/keyframes/fade";
import { ZombiePlayer } from "./types";

const ZOMBIE_COLOR = "#69B362";
const PLAYER_COLOR = "#A41E1F";

const ZombiePlayerContainer = styled.div`
  position: relative;
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
  top: -50%;
  background: ${ZOMBIE_COLOR}};
  color: white;
  text-align: center;
  padding: 0.2rem 0;
  font-size: 1rem;
  animation: ${fadeInOutBottomToTop} 3s ease-in-out 0.5s 1 both;
  border-radius: 0.5rem;
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
  margin: 0 0.5rem;
  transition: background 1s ease-in-out;
`;

type Props = {
  zombiePlayer: ZombiePlayer;
  stackIndex?: number;
};

export const ZombieRunPlayer = ({ zombiePlayer, stackIndex = 0 }: Props) => {
  const { getName } = usePlayerNames();
  useEffect(() => {}, [zombiePlayer.gotBitten]);

  const isZombie = zombiePlayer.gotBitten || zombiePlayer.isZombie;

  return (
    <ZombiePlayerContainer>
      <ZombieTransform isZombie={isZombie}>
        <PlayerAvatar playerId={zombiePlayer.id} size="thumbnail" />
      </ZombieTransform>
      {zombiePlayer.gotBitten && (
        <BittenIndicator>
          {getName(zombiePlayer.id)} got bitten 😱
        </BittenIndicator>
      )}
      <PlayerDetailsContainer>
        <ArrowIndicator isZombie={isZombie} />
        <PlayerName
          isZombie={isZombie}
          style={{ transform: `translateY(${stackIndex * 100}%)` }}
        >
          {getName(zombiePlayer.id)}
        </PlayerName>
      </PlayerDetailsContainer>
    </ZombiePlayerContainer>
  );
};
