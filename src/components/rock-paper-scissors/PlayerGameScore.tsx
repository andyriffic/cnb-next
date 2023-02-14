import { useMemo } from "react";
import styled from "styled-components";
import {
  RPSGame,
  RPSPlayerMove,
  RPSSpectatorGameView,
  RPSSpectatorRoundView,
} from "../../services/rock-paper-scissors/types";
import { Card, PrimaryButton, SubHeading } from "../Atoms";

type Props = {
  playerId: string;
  game: RPSSpectatorGameView;
};

const ScoreContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-evenly;

  ${Card} {
    flex: 1;
  }
`;

const ScoreCount = styled.div`
  font-size: 3rem;
`;

export const PlayerGameScore = ({ playerId, game }: Props): JSX.Element => {
  const opponentPlayerId = game.playerIds.find((pid) => pid !== playerId);
  const opponentScore = game.scores.find(
    (s) => s.playerId === opponentPlayerId
  );

  return (
    <ScoreContainer>
      <Card style={{ textAlign: "center" }}>
        <SubHeading>You</SubHeading>
        <ScoreCount>
          {game.scores.find((s) => s.playerId === playerId)?.score}
        </ScoreCount>
      </Card>
      <Card style={{ textAlign: "center" }}>
        <SubHeading>Draw</SubHeading>
        <ScoreCount>
          {game.roundHistory.filter((r) => r.result && r.result.draw).length}
        </ScoreCount>
      </Card>
      <Card style={{ textAlign: "center" }}>
        <SubHeading>{opponentPlayerId}</SubHeading>
        <ScoreCount>
          {game.scores.find((s) => s.playerId !== playerId)?.score}
        </ScoreCount>
      </Card>
    </ScoreContainer>
  );
};
