import styled, { css } from "styled-components";
import { Player, getPlayerZombieRunDetails } from "../types/Player";
import { selectRandomOneOf } from "../utils/random";
import { AvatarSize, PlayerAvatar } from "./PlayerAvatar";
import { Appear } from "./animations/Appear";
import { useDoOnce } from "./hooks/useDoOnce";
import { useSound } from "./hooks/useSound";
import { Animation_ShakeBottom } from "./animations/Attention";

const Label = styled.div`
  background-color: goldenrod;
  color: black;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  border-radius: 1rem;
  border: white solid 0.1rem;
  text-transform: uppercase;
  display: inline-block;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
`;

const ZombieLabel = styled(Label)`
  background-color: #165b33;
  border-color: darkgreen;
  /* font-size: 2rem; */
  text-align: center;
`;

export const ZombieTransform = styled.div<{ isZombie: boolean }>`
  transition: filter 1s ease-in-out;
  animation: ${Animation_ShakeBottom} 2.5s linear infinite both;
  ${({ isZombie }) =>
    isZombie &&
    css`
      filter: hue-rotate(90deg);
    `}
`;

type Props = {
  player: Player;
  team: string | undefined;
  avatarSize: AvatarSize;
};

export function JoinedPlayer({ player, team, avatarSize }: Props) {
  const { play } = useSound();

  const isZombie = getPlayerZombieRunDetails(player).isZombie;

  useDoOnce(() => {
    play(
      selectRandomOneOf([
        "zombie-run-player-zombie-moving",
        "zombie-run-zombie-moving",
      ])
    );
  }, isZombie);

  return (
    <div>
      <ZombieTransform isZombie={isZombie}>
        <PlayerAvatar playerId={player.id} size={avatarSize} />
      </ZombieTransform>
      {player && (
        <Appear animation="text-focus-in">
          <Label>{player.name}</Label>
        </Appear>
      )}
      {player && isZombie && (
        <Appear animation="text-focus-in">
          <ZombieLabel>Zombie</ZombieLabel>
        </Appear>
      )}
    </div>
  );
}
