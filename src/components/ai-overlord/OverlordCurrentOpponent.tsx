import styled from "styled-components";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { PlayerAvatar } from "../PlayerAvatar";
import { Appear } from "../animations/Appear";
import { AiMove } from "./AiMove";
import { AiOverlordGameView } from "./hooks/useAiOverlordGameView";

const PlayerAvatarGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: row-reverse;
  position: relative;
`;

const Player = styled.div`
  /* width: 10vw; */
`;

const CurrentMove = styled.div`
  position: absolute;
  right: -20%;
  top: 30%;
`;

type Props = {
  aiOverlordGame: AiOverlordGame;
  gameView: AiOverlordGameView;
};

export const OverlordCurrentOpponent = ({
  aiOverlordGame,
  gameView,
}: Props) => {
  return gameView.currentOpponent ? (
    <Appear>
      <PlayerAvatarGroup>
        <Player>
          <PlayerAvatar
            playerId={gameView.currentOpponent.playerId}
            size="medium"
          />
        </Player>
        {gameView.currentOpponentMove && (
          <CurrentMove>
            <Appear animation="roll-in-left">
              <AiMove moveName={gameView.currentOpponentMove.move} />
            </Appear>
          </CurrentMove>
        )}
      </PlayerAvatarGroup>
    </Appear>
  ) : (
    <div>Choose opponent</div>
  );
};
