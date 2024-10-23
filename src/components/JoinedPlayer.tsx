import styled, { css } from "styled-components";
import {
  Player,
  getPlayerAvailableCoins,
  getPlayerZombieRunDetails,
} from "../types/Player";
import { selectRandomOneOf } from "../utils/random";
import { replaceFirstLetterWithZ } from "../utils/string";
import { AvatarSize, PlayerAvatar } from "./PlayerAvatar";
import { Appear } from "./animations/Appear";
import { useDoOnce } from "./hooks/useDoOnce";
import { useSound } from "./hooks/useSound";
import { Animation_ShakeBottom, Attention } from "./animations/Attention";
import { Coins } from "./Coins";

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
  color: #ccc;
  /* font-size: 2rem; */
  text-align: center;
`;

const CoinContainer = styled.div`
  text-align: center;
`;

export const ZombieTransform = styled.div<{ isZombie: boolean }>`
  transition: filter 1s ease-in-out;
  // animation: ${Animation_ShakeBottom} 2.5s linear infinite both;
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
    <div style={{ position: "relative" }}>
      <ZombieTransform isZombie={isZombie}>
        <PlayerAvatar playerId={player.id} size={avatarSize} />
      </ZombieTransform>
      {player && !isZombie && (
        <Appear animation="text-focus-in">
          <Label>{player.name}</Label>
        </Appear>
      )}
      {player && isZombie && (
        <Appear animation="text-focus-in">
          <ZombieLabel>{replaceFirstLetterWithZ(player.name)}</ZombieLabel>
        </Appear>
      )}
      {player && getPlayerAvailableCoins(player) > 0 && (
        <CoinContainer>
          <Coins totalCoins={getPlayerAvailableCoins(player)} />
        </CoinContainer>
      )}
    </div>
  );
}
