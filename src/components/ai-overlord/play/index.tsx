import { useAiOverlordGame } from "../../../providers/SocketIoProvider/useAiOverlord";
import { AiOverlordGame } from "../../../services/ai-overlord/types";
import { Heading, PrimaryButton, SubHeading } from "../../Atoms";
import { getMoveEmoji } from "../../rock-paper-scissors/ViewerPlayersMove";

type Props = {
  aiOverlordGame: AiOverlordGame;
  playerId: string;
};

const View = ({ aiOverlordGame, playerId }: Props) => {
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

  return (
    <>
      <SubHeading>{aiOverlordGame.gameId}</SubHeading>
      {!currentTaunt && <Heading>Waiting for your turn</Heading>}
      {currentTaunt && (
        <div>
          <p>{currentTaunt.taunt.english}</p>
          <p>{currentTaunt.taunt.chinese}</p>
        </div>
      )}
      {currentTaunt && !currentMove && (
        <div>
          <PrimaryButton onClick={() => makeOpponentMove(playerId, "rock")}>
            {getMoveEmoji("rock")}
          </PrimaryButton>
          <PrimaryButton onClick={() => makeOpponentMove(playerId, "paper")}>
            {getMoveEmoji("paper")}
          </PrimaryButton>
          <PrimaryButton onClick={() => makeOpponentMove(playerId, "scissors")}>
            {getMoveEmoji("scissors")}
          </PrimaryButton>
        </div>
      )}
      {currentOutcome && <div>{currentOutcome.text.english}</div>}
    </>
  );
};

export default View;
