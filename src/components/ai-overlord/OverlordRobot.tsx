import Image from "next/future/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { AiOverlordGame } from "../../services/ai-overlord/types";
import { Appear } from "../animations/Appear";
import { Attention } from "../animations/Attention";
import { AiMove } from "./AiMove";
import { OverlordThinkingIndicator } from "./OverlordThinkingIndicator";
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

const GearsPosition = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const CurrentMovePosition = styled.div`
  position: absolute;
  left: -20%;
  top: 40%;
`;

type Props = {
  aiOverlordGame: AiOverlordGame;
};

export const OverlordRobot = ({ aiOverlordGame }: Props) => {
  const { makeRobotMove, isThinking, startThinking } = useAiOverlordGame(
    aiOverlordGame.gameId
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentOpponent =
    aiOverlordGame.taunts[aiOverlordGame.taunts.length - 1];

  const moveAgainstCurrentOpponent = aiOverlordGame.aiOverlord.moves.find(
    (m) => m.opponentId === currentOpponent?.playerId
  );

  const currentOpponentsMove = aiOverlordGame.opponentMoves.find(
    (m) => m.playerId === currentOpponent?.playerId
  );

  const currentSpeech =
    aiOverlordGame.aiOverlord.finalSummary ||
    moveAgainstCurrentOpponent?.text ||
    (currentOpponent
      ? aiOverlordGame.taunts.find(
          (t) => t.playerId === currentOpponent.playerId
        )!.taunt
      : aiOverlordGame.aiOverlord.introduction);

  useEffect(() => {
    if (
      currentOpponent &&
      currentOpponentsMove &&
      !isThinking &&
      !moveAgainstCurrentOpponent
    ) {
      startThinking();
      makeRobotMove(currentOpponent.playerId);
    }
  }, [
    currentOpponent,
    currentOpponentsMove,
    isThinking,
    makeRobotMove,
    moveAgainstCurrentOpponent,
    startThinking,
  ]);

  useEffect(() => {
    if (!isThinking) {
      setIsSpeaking(true);
    }
  }, [isThinking]);

  return (
    <RobotLayout>
      <Attention animate={isSpeaking} animation="shake">
        <RobotBody>
          <Image
            src="/images/ai-overlords/overlord-02.png"
            alt="Menacing robot"
            fill={true}
          />
        </RobotBody>
      </Attention>
      <RobotSpeech>
        <Appear show={!isThinking}>
          <SpeechText
            text={currentSpeech}
            onFinishedSpeaking={() => setIsSpeaking(false)}
          />
        </Appear>
      </RobotSpeech>
      {moveAgainstCurrentOpponent && (
        <CurrentMovePosition>
          <Appear animation="roll-in-right">
            <AiMove moveName={moveAgainstCurrentOpponent.move} />
          </Appear>
        </CurrentMovePosition>
      )}
      <GearsPosition>
        <OverlordThinkingIndicator isThinking={isThinking} />
      </GearsPosition>
    </RobotLayout>
  );
};
