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

export const OverlordOpponents = ({ aiOverlordGame }: Props) => {
  return (
    <PlayerAvatarGroup>
      {aiOverlordGame.opponents.map((opponent) => {
        const moveResult = aiOverlordGame.aiOverlord.moves.find(
          (m) => m.opponentId === opponent.playerId
        );
        return (
          <Player key={opponent.playerId}>
            <PlayerAvatar playerId={opponent.playerId} size="thumbnail" />
            {moveResult && (
              <BattleResultIndicator result={moveResult.outcome} />
            )}
          </Player>
        );
      })}
    </PlayerAvatarGroup>
  );
};
