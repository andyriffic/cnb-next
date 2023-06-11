import styled from "styled-components";
import { FONT_FAMILY } from "../../../colors";
import { GasGame, GasPlayer } from "../../../services/migrated/gas-out/types";
import { getOrdinal } from "../../../utils/string";
import { PlayerAvatar } from "../../PlayerAvatar";
import { fadeInAnimation } from "../../animations/keyframes/fade";
import { PlayerBonusPoints } from "./PlayerBonusPoints";

const CardContainer = styled.div`
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
`;

const PlayerAvatarContainer = styled.div`
  opacity: 0.6;
`;

const PlayerListItem = styled.div<{ active: boolean }>`
  position: relative;
  transition: top 300ms ease-in-out, opacity 1s linear;
  top: ${({ active }) => (active ? "-20%" : "0")};
`;

const PlayerFinishedPosition = styled.div`
  font-size: 0.9rem;
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  color: #333;
  font-family: ${FONT_FAMILY.numeric};
`;

const PlayerPoints = styled.div`
  font-size: 1rem;
  position: absolute;
  bottom: 0;
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
};

export function GraveyardPlayer({ player, game }: Props): JSX.Element {
  const active = player.player.id === game.currentPlayer.id;
  const winner = player.player.id === game.winningPlayerId;

  const notDead = player.status !== "dead";
  return (
    <PlayerListItem
      key={player.player.id}
      active={notDead && (active || winner)}
    >
      <div style={{ position: "absolute", top: 0 }}>
        <PlayerBonusPoints points={player.guesses.correctGuessCount} />
      </div>
      {player.finishedPosition && (
        <PlayerFinishedPosition>
          {getOrdinal(player.finishedPosition)}
        </PlayerFinishedPosition>
      )}
      <PlayerAvatarContainer>
        <PlayerAvatar playerId={player.player.id} size="thumbnail" />
      </PlayerAvatarContainer>
      {(!notDead || winner) && <PlayerPoints>{player.points}</PlayerPoints>}
      {player.killedBy === "timeout" && <TimedOutIcon>⏰</TimedOutIcon>}
      {player.killedBy === "boomerang" && <TimedOutIcon>🪃</TimedOutIcon>}
    </PlayerListItem>
  );
}
