import styled from "styled-components";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { PlayerAvatar } from "../PlayerAvatar";
import { Appear } from "../animations/Appear";
import { AiMove } from "./AiMove";

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
};

export const OverlordCurrentOpponent = ({ aiOverlordGame }: Props) => {
  const currentOpponent = aiOverlordGame.opponents.find(
    (o) => o.playerId === aiOverlordGame.currentOpponentId
  );
  const currentMove = aiOverlordGame.opponentMoves.find(
    (m) => m.playerId === currentOpponent?.playerId
  );

  return currentOpponent ? (
    <Appear>
      <PlayerAvatarGroup>
        <Player>
          <PlayerAvatar playerId={currentOpponent.playerId} size="medium" />
        </Player>
        {currentMove && (
          <CurrentMove>
            <Appear animation="roll-in-left">
              <AiMove moveName={currentMove.move} />
            </Appear>
          </CurrentMove>
        )}
      </PlayerAvatarGroup>
    </Appear>
  ) : (
    <div>Choose opponent</div>
  );
};
