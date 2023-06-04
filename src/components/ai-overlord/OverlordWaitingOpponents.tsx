import styled from "styled-components";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { PlayerAvatar } from "../PlayerAvatar";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { useDoOnce } from "../hooks/useDoOnce";
import { selectRandomOneOf } from "../../utils/random";
import { AiOverlordGameView } from "./hooks/useAiOverlordGameView";

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
  const { initialiseOpponent, newOpponent, makeOpponentMove } =
    useAiOverlordGame(aiOverlordGame.gameId);

  useDoOnce(() => {
    aiOverlordGame.opponents.map((o) => o.playerId).forEach(initialiseOpponent);
  });

  const loadedPlayerIds = aiOverlordGame.taunts.map((t) => t.playerId);

  return (
    <PlayerAvatarGroup>
      {gameView.remainingOpponents.map((opponent) => {
        const hasLoaded = loadedPlayerIds.includes(opponent.playerId);
        const hasMoved = aiOverlordGame.opponentMoves.find(
          (m) => m.playerId === opponent.playerId
        );
        return (
          <Player key={opponent.playerId}>
            <PlayerAvatar playerId={opponent.playerId} size="thumbnail" />
            {hasLoaded && <span>✅</span>}
            {/* {hasMoved && <span>👍</span>}
            {!hasMoved && (
              <div>
                <button
                  onClick={() => makeOpponentMove(opponent.playerId, "rock")}
                >
                  Rock
                </button>
                <button
                  onClick={() => makeOpponentMove(opponent.playerId, "paper")}
                >
                  Paper
                </button>
                <button
                  onClick={() =>
                    makeOpponentMove(opponent.playerId, "scissors")
                  }
                >
                  Scissors
                </button>
              </div>
            )} */}
            {/* <button onClick={() => newOpponent(opponent.playerId)}>Next</button> */}
          </Player>
        );
      })}
      {/* {gameView.remainingOpponents.length > 0 && (
        <button
          onClick={() =>
            newOpponent(selectRandomOneOf(gameView.remainingOpponents).playerId)
          }
        >
          Next opponent
        </button>
      )} */}
    </PlayerAvatarGroup>
  );
};
