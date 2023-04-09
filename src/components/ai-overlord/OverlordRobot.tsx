import Image from "next/future/image";
import { useEffect } from "react";
import styled from "styled-components";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import { AiOverlord, AiOverlordGame } from "../../services/ai-overlord/types";
import { Appear } from "../animations/Appear";
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
        <Appear show={!isThinking}>
          <SpeechText text={currentSpeech} />
        </Appear>
      </RobotSpeech>
      {moveAgainstCurrentOpponent && (
        <>
          <p>{moveAgainstCurrentOpponent.move}</p>
        </>
      )}
      <GearsPosition>
        <OverlordThinkingIndicator isThinking={isThinking} />
      </GearsPosition>
    </RobotLayout>
  );
};
