import Image from "next/future/image";
import styled from "styled-components";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { AiOverlord, AiOverlordGame } from "../../services/ai-overlord/types";
import { SpeechText } from "./SpeechText";

const RobotLayout = styled.div`
  position: relative;
`;

const RobotBody = styled.div`
  position: relative;
  width: 25vh;
  height: 50vh;
`;

const RobotSpeech = styled.div`
  position: absolute;
  width: 30vw;
  top: -20vh;
  right: 0;
`;

type Props = {
  aiOverlordGame: AiOverlordGame;
};

export const OverlordRobot = ({ aiOverlordGame }: Props) => {
  const { makeRobotMove, isThinking, startThinking } = useAiOverlordGame(
    aiOverlordGame.gameId
  );

  const currentOpponent =
    aiOverlordGame.taunts[aiOverlordGame.taunts.length - 1];

  const moveAgainstCurrentOpponent = aiOverlordGame.aiOverlord.moves.find(
    (m) => m.opponentId === currentOpponent?.playerId
  );

  const currentOpponentsMove = aiOverlordGame.opponentMoves.find(
    (m) => m.playerId === currentOpponent?.playerId
  );

  const currentSpeech =
    moveAgainstCurrentOpponent?.text ||
    (currentOpponent
      ? aiOverlordGame.taunts.find(
          (t) => t.playerId === currentOpponent.playerId
        )!.taunt
      : aiOverlordGame.aiOverlord.introduction);

  return (
    <RobotLayout>
      <RobotBody>
        <Image
          src="/images/ai-overlords/overlord-01.png"
          alt="Menacing robot"
          fill={true}
        />
      </RobotBody>
      <RobotSpeech>
        <SpeechText text={currentSpeech} />
      </RobotSpeech>
      {moveAgainstCurrentOpponent && (
        <>
          <p>{moveAgainstCurrentOpponent.move}</p>
        </>
      )}
      {currentOpponent &&
        currentOpponentsMove &&
        !isThinking &&
        !moveAgainstCurrentOpponent && (
          <button
            onClick={() => {
              startThinking();
              makeRobotMove(currentOpponent.playerId);
            }}
          >
            Make move against {currentOpponent.playerId}
          </button>
        )}
      {isThinking && <p>Robot is thinking...</p>}
    </RobotLayout>
  );
};
