import styled from "styled-components";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { PlayerAvatar } from "../PlayerAvatar";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { useDoOnce } from "../hooks/useDoOnce";
import { AiOverlordGameView } from "./hooks/useAiOverlordGameView";
import { selectRandomOneOf } from "../../utils/random";

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
  gameView: AiOverlordGameView;
};

export const OverlordWaitingOpponents = ({
  aiOverlordGame,
  gameView,
}: Props) => {
  const { initialiseOpponent, newOpponent } = useAiOverlordGame(
    aiOverlordGame.gameId
  );

  useDoOnce(() => {
    aiOverlordGame.opponents.map((o) => o.playerId).forEach(initialiseOpponent);
  });

  const loadedPlayerIds = aiOverlordGame.taunts.map((t) => t.playerId);

  return (
    <PlayerAvatarGroup>
      {gameView.remainingOpponents.map((opponent) => {
        const hasLoaded = loadedPlayerIds.includes(opponent.playerId);
        return (
          <Player key={opponent.playerId}>
            <PlayerAvatar playerId={opponent.playerId} size="thumbnail" />
            {hasLoaded && <span>✅</span>}
          </Player>
        );
      })}
      {gameView.remainingOpponents.length > 0 && (
        <button
          onClick={() =>
            newOpponent(selectRandomOneOf(gameView.remainingOpponents).playerId)
          }
        >
          Next opponent
        </button>
      )}
    </PlayerAvatarGroup>
  );
};
