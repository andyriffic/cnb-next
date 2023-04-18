import styled from "styled-components";
import {
  AiOverlordGame,
  AiOverlordOpponentMoveWithTextAndOutcome,
  AiOverlordOpponentResult,
} from "../../services/ai-overlord/types";
import { PlayerAvatar } from "../PlayerAvatar";
import { BattleResultIndicator } from "./BattleResultIndicator";

const PlayerAvatarGroup = styled.div`
  display: flex;
  gap: 1rem;
  /* flex-direction: row-reverse; */
`;

const Player = styled.div`
  width: 3vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OutcomeGrouping = styled.div<{ color: string }>`
  border-bottom: 2rem solid ${({ color }) => color};
  border-radius: 0 0 1rem 1rem;
  display: flex;
  position: relative;
`;

const Points = styled.div`
  position: absolute;
  bottom: -16%;
  color: white;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

type Props = {
  aiOverlordGame: AiOverlordGame;
};

export const OverlordFinishedOpponents = ({ aiOverlordGame }: Props) => {
  const winningFinishedOutcomes = aiOverlordGame.aiOverlord.moves.filter(
    (m) => m.outcome === "lose"
  );
  const drawnFinishedOutcomes = aiOverlordGame.aiOverlord.moves.filter(
    (m) => m.outcome === "draw"
  );
  const losingFinishedOutcomes = aiOverlordGame.aiOverlord.moves.filter(
    (m) => m.outcome === "win"
  );

  return (
    <PlayerAvatarGroup>
      {winningFinishedOutcomes.length > 0 && (
        <OutcomeGrouping color="green">
          {winningFinishedOutcomes.map((result) => (
            <Player key={result.opponentId}>
              <PlayerAvatar playerId={result.opponentId} size="thumbnail" />
              {/* <BattleResultIndicator result={result.outcome} /> */}
            </Player>
          ))}
          <Points>{winningFinishedOutcomes.length + 4}</Points>
        </OutcomeGrouping>
      )}
      {drawnFinishedOutcomes.length > 0 && (
        <OutcomeGrouping color="goldenrod">
          {drawnFinishedOutcomes.map((result) => (
            <Player key={result.opponentId}>
              <PlayerAvatar playerId={result.opponentId} size="thumbnail" />
              {/* <BattleResultIndicator result={result.outcome} /> */}
            </Player>
          ))}
          <Points>{drawnFinishedOutcomes.length + 2}</Points>
        </OutcomeGrouping>
      )}
      {losingFinishedOutcomes.length > 0 && (
        <OutcomeGrouping color="red">
          {losingFinishedOutcomes.map((result) => (
            <Player key={result.opponentId}>
              <PlayerAvatar playerId={result.opponentId} size="thumbnail" />
              {/* <BattleResultIndicator result={result.outcome} /> */}
            </Player>
          ))}
          <Points>{losingFinishedOutcomes.length}</Points>
        </OutcomeGrouping>
      )}
    </PlayerAvatarGroup>
  );
};
