import styled from "styled-components";
import {
  AiOverlordGame,
  TranslatedText,
} from "../../services/ai-overlord/types";
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

export const OverlordOpponents = ({ aiOverlordGame }: Props) => {
  return (
    <PlayerAvatarGroup>
      {aiOverlordGame.opponents.map((opponent) => {
        return (
          <Player key={opponent.playerId}>
            <PlayerAvatar playerId={opponent.playerId} size="medium" />
          </Player>
        );
      })}
    </PlayerAvatarGroup>
  );
};
