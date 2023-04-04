import styled from "styled-components";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { fetchStartAiOverlordBattle } from "../../utils/api";
import { PlayerAvatar } from "../PlayerAvatar";

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
  const { newOpponent } = useAiOverlordGame(aiOverlordGame.gameId);

  return (
    <PlayerAvatarGroup>
      {aiOverlordGame.opponents.map((opponent) => {
        const hasBeenTaunted = aiOverlordGame.taunts.some(
          (t) => t.playerId === opponent.playerId
        );
        return (
          <Player key={opponent.playerId}>
            <PlayerAvatar playerId={opponent.playerId} size="thumbnail" />
            {!hasBeenTaunted && (
              <button
                onClick={() => {
                  newOpponent(opponent.playerId);
                }}
              >
                Choose
              </button>
            )}
          </Player>
        );
      })}
    </PlayerAvatarGroup>
  );
};
