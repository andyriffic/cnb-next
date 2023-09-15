import styled, { css } from "styled-components";
import { useEffect, useMemo } from "react";
import { PlayerAvatar } from "../PlayerAvatar";
import { usePlayerNames } from "../../providers/PlayerNamesProvider";
import { Appear } from "../animations/Appear";
import { fadeInOutBottomToTop } from "../animations/keyframes/fade";
import { ZombiePlayer } from "./types";

const ZombiePlayerContainer = styled.div<{ isZombie: boolean }>`
  position: relative;
  ${({ isZombie }) =>
    isZombie &&
    css`
      filter: hue-rotate(90deg);
    `}
`;

const BittenIndicator = styled.div`
  position: absolute;
  top: -50%;
  background: darkgreen;
  color: white;
  text-align: center;
  padding: 0.2rem 0;
  font-size: 1rem;
  filter: hue-rotate(-90deg);
  animation: ${fadeInOutBottomToTop} 3s ease-in-out 0.5s 1 both;
  border-radius: 0.5rem;
`;

const PlayerDetailsContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
`;

const ArrowIndicator = styled.div`
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;

  border-top: 20px solid #f00;
  margin: 0 auto;
`;

const PlayerName = styled.div`
  background: darkgreen;
  color: white;
  text-align: center;
  padding: 0.2rem;
  font-size: 0.9rem;
  border-radius: 0.5rem;
  margin: 0 0.5rem;
`;

type Props = {
  zombiePlayer: ZombiePlayer;
  stackIndex?: number;
};

export const ZombieRunPlayer = ({ zombiePlayer, stackIndex = 0 }: Props) => {
  const { getName } = usePlayerNames();
  useEffect(() => {}, [zombiePlayer.gotBitten]);

  return (
    <ZombiePlayerContainer
      isZombie={zombiePlayer.gotBitten || zombiePlayer.isZombie}
    >
      <PlayerAvatar playerId={zombiePlayer.id} size="thumbnail" />
      {zombiePlayer.gotBitten && (
        <BittenIndicator>
          {getName(zombiePlayer.id)} got bitten 😱
        </BittenIndicator>
      )}
      <PlayerDetailsContainer>
        <ArrowIndicator />
        <PlayerName style={{ transform: `translateY(${stackIndex * 100}%)` }}>
          {getName(zombiePlayer.id)}
        </PlayerName>
      </PlayerDetailsContainer>
    </ZombiePlayerContainer>
  );
};
