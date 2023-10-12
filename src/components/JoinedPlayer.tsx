import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Player, getPlayerZombieRunDetails } from "../types/Player";
import { fetchGetPlayer } from "../utils/api";
import { selectRandomOneOf } from "../utils/random";
import { PlayerAvatar } from "./PlayerAvatar";
import { Appear } from "./animations/Appear";
import { useSound } from "./hooks/useSound";
import { useDoOnce } from "./hooks/useDoOnce";

const Label = styled.div`
  background-color: goldenrod;
  color: black;
  padding: 0.5rem;
  font-size: 0.8rem;
  border-radius: 1rem;
  border: white solid 0.2rem;
  text-transform: uppercase;
  display: inline-block;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
`;

const ZombieTransform = styled.div<{ isZombie: boolean }>`
  transition: filter 1s ease-in-out;
  ${({ isZombie }) =>
    isZombie &&
    css`
      filter: hue-rotate(90deg);
    `}
`;

type Props = {
  playerId: string;
  team: string | undefined;
};

export function JoinedPlayer({ playerId, team }: Props) {
  const [player, setPlayer] = useState<Player | undefined>();
  const { play } = useSound();

  useEffect(() => {
    fetchGetPlayer(playerId).then((playerOrNull) => {
      setPlayer(playerOrNull);
    });
  }, [playerId]);

  useDoOnce(
    () => {
      play(
        selectRandomOneOf([
          "zombie-run-player-zombie-moving",
          "zombie-run-zombie-moving",
        ])
      );
    },
    player ? getPlayerZombieRunDetails(player).isZombie : false
  );

  return (
    <div>
      <ZombieTransform
        isZombie={player ? getPlayerZombieRunDetails(player).isZombie : false}
      >
        <PlayerAvatar playerId={playerId} size="small" />
      </ZombieTransform>
      {player && team && player.details?.team === team && (
        <Appear animation="text-focus-in">
          <Label>{player.details.team}</Label>
        </Appear>
      )}
    </div>
  );
}
