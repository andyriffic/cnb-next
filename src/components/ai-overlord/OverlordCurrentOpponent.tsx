import styled from "styled-components";
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
  const currentOpponent =
    aiOverlordGame.taunts[aiOverlordGame.taunts.length - 1];

  return currentOpponent ? (
    <PlayerAvatarGroup>
      <Player>
        <PlayerAvatar playerId={currentOpponent.playerId} size="medium" />
      </Player>
    </PlayerAvatarGroup>
  ) : (
    <div>Choose opponent</div>
  );
};
