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

type Props = {
  zombiePlayer: ZombiePlayer;
};

export const ZombieRunPlayer = ({ zombiePlayer }: Props) => {
  const { getName } = usePlayerNames();
  useEffect(() => {}, [zombiePlayer.gotBitten]);

  return (
    <ZombiePlayerContainer isZombie={zombiePlayer.gotBitten}>
      <PlayerAvatar playerId={zombiePlayer.id} size="thumbnail" />
      {zombiePlayer.gotBitten && (
        <BittenIndicator>
          {getName(zombiePlayer.id)} got bitten 😱
        </BittenIndicator>
      )}
    </ZombiePlayerContainer>
  );
};
