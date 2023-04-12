import styled from "styled-components";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { PlayerAvatar } from "../PlayerAvatar";
import { BattleResultIndicator } from "./BattleResultIndicator";

const PlayerAvatarGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: row-reverse;
`;

const Player = styled.div`
  width: 3vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type Props = {
  aiOverlordGame: AiOverlordGame;
};

export const OverlordWaitingOpponents = ({ aiOverlordGame }: Props) => {
  const finishedOpponentIds = aiOverlordGame.aiOverlord.moves.map(
    (p) => p.opponentId
  );

  const waitingOpponents = aiOverlordGame.opponents.filter(
    (o) => !finishedOpponentIds.includes(o.playerId)
  );

  return (
    <PlayerAvatarGroup>
      {waitingOpponents.map((opponent) => {
        return (
          <Player key={opponent.playerId}>
            <PlayerAvatar playerId={opponent.playerId} size="thumbnail" />
          </Player>
        );
      })}
    </PlayerAvatarGroup>
  );
};
