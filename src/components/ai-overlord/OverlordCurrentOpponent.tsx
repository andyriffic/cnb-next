import styled from "styled-components";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { PlayerAvatar } from "../PlayerAvatar";

const PlayerAvatarGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: row-reverse;
`;

const Player = styled.div`
  width: 10vw;
`;

type Props = {
  aiOverlordGame: AiOverlordGame;
};

export const OverlordCurrentOpponent = ({ aiOverlordGame }: Props) => {
  const { makeOpponentMove } = useAiOverlordGame(aiOverlordGame.gameId);
  const currentOpponent =
    aiOverlordGame.taunts[aiOverlordGame.taunts.length - 1];
  const currentMove = aiOverlordGame.opponentMoves.find(
    (m) => m.playerId === currentOpponent?.playerId
  );

  return currentOpponent ? (
    <PlayerAvatarGroup>
      <Player>
        <PlayerAvatar playerId={currentOpponent.playerId} size="medium" />
      </Player>
      {currentMove ? (
        <div>{currentMove.move}</div>
      ) : (
        <div>
          <button
            onClick={() => makeOpponentMove(currentOpponent.playerId, "rock")}
          >
            Rock
          </button>
          <button
            onClick={() => makeOpponentMove(currentOpponent.playerId, "paper")}
          >
            Paper
          </button>
          <button
            onClick={() =>
              makeOpponentMove(currentOpponent.playerId, "scissors")
            }
          >
            Scissors
          </button>
        </div>
      )}
    </PlayerAvatarGroup>
  ) : (
    <div>Choose opponent</div>
  );
};
