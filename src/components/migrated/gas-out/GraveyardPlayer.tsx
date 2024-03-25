import styled from "styled-components";
import { FONT_FAMILY } from "../../../colors";
import { usePlayerNames } from "../../../providers/PlayerNamesProvider";
import { GasGame, GasPlayer } from "../../../services/migrated/gas-out/types";
import { getOrdinal } from "../../../utils/string";
import { PlayerAvatar } from "../../PlayerAvatar";
import { fadeInAnimation } from "../../animations/keyframes/fade";
import { textFocusIn } from "../../animations/keyframes/textFocusIn";
import { ZombieTransform } from "../../JoinedPlayer";
import { getPlayerZombieRunDetails } from "../../../types/Player";
import { PlayerBonusPoints } from "./PlayerBonusPoints";

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

const NextVoteName = styled.div`
  font-size: 1rem;
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid #444;
  background-color: lightblue;
  color: darkblue;
  padding: 0.3rem;
  border-radius: 1rem;
  animation: ${textFocusIn} 200ms ease-in-out both;
  text-transform: uppercase;
`;

const TimedOutIcon = styled.div`
  position: absolute;
  bottom: 0;
`;

type Props = {
  player: GasPlayer;
  game: GasGame;
};

export function GraveyardPlayer({ player, game }: Props): JSX.Element {
  const { getName } = usePlayerNames();

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
        <ZombieTransform
          isZombie={getPlayerZombieRunDetails(player.player).isZombie}
        >
          <PlayerAvatar playerId={player.player.id} size="thumbnail" />
        </ZombieTransform>
      </PlayerAvatarContainer>
      {player.guesses.nextPlayerOutGuess && (
        <NextVoteName>
          {getName(player.guesses.nextPlayerOutGuess)}
        </NextVoteName>
      )}
      {(!notDead || winner) && <PlayerPoints>{player.points}</PlayerPoints>}
      {player.killedBy?.deathType === "timeout" && (
        <TimedOutIcon>⏰</TimedOutIcon>
      )}
      {player.killedBy?.deathType === "bomb" && <TimedOutIcon>💣</TimedOutIcon>}
      {player.killedBy?.deathType === "boomerang" && (
        <TimedOutIcon>🪃</TimedOutIcon>
      )}
    </PlayerListItem>
  );
}
