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
  return (
    <PlayerAvatarGroup>
      <Player>
        <PlayerAvatar
          playerId={aiOverlordGame.opponents[0]!.playerId}
          size="medium"
        />
      </Player>
    </PlayerAvatarGroup>
  );
};
