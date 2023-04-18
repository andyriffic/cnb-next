import styled from "styled-components";
import { useAiOverlordGame } from "../../../providers/SocketIoProvider/useAiOverlord";
import { AiOverlordGame } from "../../../services/ai-overlord/types";
import { Card, Heading, PrimaryButton, SubHeading } from "../../Atoms";
import { getMoveEmoji } from "../../rock-paper-scissors/ViewerPlayersMove";
import { useAiOverlordGameView } from "../hooks/useAiOverlordGameView";

const RobotText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

type Props = {
  aiOverlordGame: AiOverlordGame;
  playerId: string;
};

const View = ({ aiOverlordGame, playerId }: Props) => {
  const gameView = useAiOverlordGameView(aiOverlordGame);

  const { makeOpponentMove } = useAiOverlordGame(aiOverlordGame.gameId);
  const currentTaunt = aiOverlordGame.taunts.find(
    (t) => t.playerId === playerId
  );
  const currentMove = aiOverlordGame.opponentMoves.find(
    (m) => m.playerId === playerId
  );
  const currentOutcome = aiOverlordGame.aiOverlord.moves.find(
    (m) => m.opponentId === playerId
  );

  const hasntHadTurnYet =
    aiOverlordGame.currentOpponentId !== playerId && !currentMove;
  const showTaunt =
    currentTaunt &&
    (aiOverlordGame.currentOpponentId === playerId || currentOutcome);

  return (
    <>
      <SubHeading>{aiOverlordGame.gameId}</SubHeading>
      {hasntHadTurnYet && <Heading>Waiting for your turn</Heading>}
      {showTaunt && (
        <Card>
          <RobotText>{currentTaunt.taunt.english}</RobotText>
          <RobotText>{currentTaunt.taunt.chinese}</RobotText>
        </Card>
      )}
      {gameView.currentOpponent?.playerId === playerId && !currentMove && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "0.8rem",
          }}
        >
          <PrimaryButton
            style={{ display: "block", flex: 1 }}
            onClick={() => makeOpponentMove(playerId, "rock")}
          >
            {getMoveEmoji("rock")}
          </PrimaryButton>
          <PrimaryButton
            style={{ display: "block", flex: 1 }}
            onClick={() => makeOpponentMove(playerId, "paper")}
          >
            {getMoveEmoji("paper")}
          </PrimaryButton>
          <PrimaryButton
            style={{ display: "block", flex: 1 }}
            onClick={() => makeOpponentMove(playerId, "scissors")}
          >
            {getMoveEmoji("scissors")}
          </PrimaryButton>
        </div>
      )}
      {currentOutcome && (
        <Card>
          <RobotText> {currentOutcome.text.english}</RobotText>
          <RobotText> {currentOutcome.text.chinese}</RobotText>
        </Card>
      )}
    </>
  );
};

export default View;
