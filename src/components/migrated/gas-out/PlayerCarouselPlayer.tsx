import { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { COLORS } from "../../../colors";
import { GasGame, GasPlayer } from "../../../services/migrated/gas-out/types";
import { AvatarSize, PlayerAvatar } from "../../PlayerAvatar";
import { shakeAnimationLeft } from "../../animations/keyframes/extreme";
import { spinAwayAnimationUp } from "../../animations/keyframes/spinAnimations";
import { Card } from "./Card";

const usePlayerCarousel = true;

const CardContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const PlayerAvatarContainer = styled.div<{ alive: boolean }>`
  display: flex;
  justify-content: center;
  width: 100%;
  ${({ alive }) =>
    !alive &&
    css`
      animation: ${spinAwayAnimationUp} 1000ms ease-in-out 0s 1 backwards;
    `}
`;

const PlayerListItem = styled.div<{ active: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Curse = styled.div`
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid white;
  color: ${COLORS.gasGame.cardTextColorSpecial};
  background-color: ${COLORS.gasGame.cardBackgroundColorSpecial};
  padding: 5px;
  border-radius: 5px;
  text-transform: uppercase;
  font-size: 0.7rem;
  white-space: nowrap;
  animation: ${shakeAnimationLeft} 800ms ease-in infinite both;
`;

const DeathContainer = styled.div<{ active: boolean }>`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.1s;
  opacity: ${({ active }) => (active ? "1" : "0.5")};
  /* border: 2px solid darkred;
  border-radius: 25%;
  background: black;
  padding: 4px; */
`;

const DeathIcon = styled.div`
  font-size: 1.3rem;
`;

const getDeathIcons = (total: number) => {
  if (!total) {
    return [];
  }

  if (usePlayerCarousel) {
    return new Array(total).fill("☠️");
  }

  const icons = ["☠️"];

  if (total > 1) {
    icons.push(`x${total}`);
  }

  return icons;
};

const markedForDeath = (
  player: GasPlayer,
  active: boolean
): JSX.Element | null => {
  if (!player.guesses.nominatedCount) {
    return null;
  }

  return (
    <DeathContainer active={active}>
      <DeathIcon>
        {getDeathIcons(player.guesses.nominatedCount).map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </DeathIcon>
    </DeathContainer>
  );
};

type Props = {
  player: GasPlayer;
  game: GasGame;
  gameOver: boolean;
  size?: AvatarSize;
};

export function PlayerCarouselPlayer({
  player,
  game,
  gameOver,
  size = "medium",
}: Props): JSX.Element | null {
  const alive = useMemo(() => {
    return player.status !== "dead";
  }, [player]);

  const [show, setShow] = useState(alive);

  useEffect(() => {
    if (alive) {
      return;
    }
    setTimeout(() => {
      setShow(false);
    }, 1000);
  }, [alive]);

  const active = player.player.id === game.currentPlayer.id;
  const winner = player.player.id === game.winningPlayerId;

  const notDead = player.status !== "dead";

  return show ? (
    <PlayerListItem
      key={player.player.id}
      active={notDead && (active || winner)}
    >
      {/* {(winner || (active && notDead && !gameOver)) && (
        <PlayerName>{player.player.name}</PlayerName>
      )} */}

      <PlayerAvatarContainer alive={alive}>
        <PlayerAvatar playerId={player.player.id} size={size} />
        {player.curse === "double-press" && <Curse>Double Press ‼️</Curse>}
      </PlayerAvatarContainer>
      {active &&
        game.currentPlayer.cardPlayed &&
        !gameOver &&
        player.status === "alive" && (
          <CardContainer>
            <Card
              card={game.currentPlayer.cardPlayed}
              pressesRemaining={game.currentPlayer.pressesRemaining}
            />
          </CardContainer>
        )}
      {markedForDeath(player, active)}
      {player.curse === "double-press" && <Curse>Double Press ‼️</Curse>}
    </PlayerListItem>
  ) : null;
}
