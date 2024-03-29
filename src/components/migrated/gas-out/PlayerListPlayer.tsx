import { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { spinAwayAnimationUp } from "../../animations/keyframes/spinAnimations";
import { fadeInAnimation } from "../../animations/keyframes/fade";
import { GasGame, GasPlayer } from "../../../services/migrated/gas-out/types";
import { AvatarSize, PlayerAvatar } from "../../PlayerAvatar";
import { getOrdinal } from "../../../utils/string";
import { COLORS, FONT_FAMILY } from "../../../colors";
import { PlayerBonusPoints } from "./PlayerBonusPoints";
import { BalloonCard } from "./BalloonCard";

const CardContainer = styled.div`
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
`;

const PlayerAvatarContainer = styled.div<{ alive: boolean }>`
  opacity: ${({ alive }) => (alive ? 1 : 0.4)};
  ${({ alive }) =>
    !alive &&
    css`
      animation: ${spinAwayAnimationUp} 1000ms ease-in-out 0s 1 backwards;
    `}
`;

const PlayerListItem = styled.div<{ active: boolean }>`
  position: relative;
  transition: top 300ms ease-in-out, opacity 1s linear;
  top: ${({ active }) => (active ? "-20%" : "0")};
`;

const PlayerFinishedPosition = styled.div`
  font-size: 0.9rem;
  position: absolute;
  top: -40%;
  left: 50%;
  transform: translateX(-50%);
  color: #333;
  font-family: ${FONT_FAMILY.numeric};
`;

const PlayerPoints = styled.div`
  font-size: 1rem;
  position: absolute;
  bottom: -30%;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${FONT_FAMILY.numeric};
  border: 2px solid #444;
  background-color: crimson;
  color: white;
  padding: 3px;
  border-radius: 4px;
  animation: ${fadeInAnimation} 1000ms ease-in-out 2000ms both;
`;

const PlayerName = styled.div`
  position: absolute;
  bottom: -50%;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid white;
  color: ${COLORS.gasGame.cardTextColor01};
  background-color: ${COLORS.gasGame.cardBackgroundColor};
  padding: 5px;
  border-radius: 5px;
  text-transform: uppercase;
  font-size: 0.8rem;
  white-space: nowrap;
`;

const DeathIcon = styled.div``;
const TimedOutIcon = styled.div`
  position: absolute;
`;

const PlayerStatsContainer = styled.div`
  position: absolute;
  bottom: -200px;
`;

const getDeathIcons = (total: number) => {
  if (!total) {
    return [];
  }

  const icons = ["☠️"];

  if (total > 1) {
    icons.push(`x${total}`);
  }

  return icons;
};

const markedForDeath = (player: GasPlayer): JSX.Element | null => {
  if (!player.guesses.nominatedCount) {
    return null;
  }

  return (
    <DeathIcon>
      {getDeathIcons(player.guesses.nominatedCount).map((d, i) => (
        <span key={i}>{d}</span>
      ))}
    </DeathIcon>
  );
};

type Props = {
  player: GasPlayer;
  game: GasGame;
  gameOver: boolean;
  size?: AvatarSize;
};

export function PlayerListPlayer({
  player,
  game,
  gameOver,
  size = "small",
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
      <div style={{ position: "absolute", top: 0 }}>
        <PlayerBonusPoints points={player.guesses.correctGuessCount} />
      </div>
      {active &&
        game.currentPlayer.cardPlayed &&
        !gameOver &&
        player.status === "alive" && (
          <CardContainer>
            <BalloonCard
              card={game.currentPlayer.cardPlayed}
              pressesRemaining={game.currentPlayer.pressesRemaining}
            />
          </CardContainer>
        )}
      {markedForDeath(player)}
      {player.finishedPosition && (
        <PlayerFinishedPosition>
          {getOrdinal(player.finishedPosition)}
        </PlayerFinishedPosition>
      )}
      {(winner || (active && notDead && !gameOver)) && (
        <PlayerName>{player.player.name}</PlayerName>
      )}
      <PlayerAvatarContainer alive={alive}>
        <PlayerAvatar playerId={player.player.id} size={size} />
      </PlayerAvatarContainer>
      {(!notDead || winner) && <PlayerPoints>{player.points}</PlayerPoints>}
    </PlayerListItem>
  ) : null;
}
