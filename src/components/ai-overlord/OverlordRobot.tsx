import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAiOverlordGame } from "../../providers/SocketIoProvider/useAiOverlord";
import {
  AiOverlord,
  AiOverlordGame,
  TranslatedText,
} from "../../services/ai-overlord/types";
import { Appear } from "../animations/Appear";
import { Attention } from "../animations/Attention";
import { getMoveEmoji } from "../rock-paper-scissors/ViewerPlayersMove";
import { selectRandomOneOf } from "../../utils/random";
import { AiMove } from "./AiMove";
import { OverlordThinkingIndicator } from "./OverlordThinkingIndicator";
import { SpeechText } from "./SpeechText";
import { AiOverlordGameView } from "./hooks/useAiOverlordGameView";

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

const MoveHistoryPosition = styled.div`
  position: absolute;
  display: flex;
  gap: 0.5rem;
  flex-direction: row-reverse;
`;

const CurrentMovePosition = styled.div`
  position: absolute;
  left: -20%;
  top: 40%;
`;

function getSpeechText(
  aiOverlord: AiOverlord,
  gameView: AiOverlordGameView
): TranslatedText {
  if (gameView.finalRobotSummary) {
    return gameView.finalRobotSummary;
  }
  if (gameView.currentRobotOpponentMove) {
    return gameView.currentRobotOpponentMove.text;
  }
  if (gameView.currentRobotOpponentTaunt) {
    return gameView.currentRobotOpponentTaunt.taunt;
  }
  return aiOverlord.introduction;
}

type Props = {
  aiOverlordGame: AiOverlordGame;
  gameView: AiOverlordGameView;
};

export const OverlordRobot = ({ aiOverlordGame, gameView }: Props) => {
  const {
    makeRobotMove,
    newOpponent,
    isThinking,
    startThinking,
    finaliseGame,
  } = useAiOverlordGame(aiOverlordGame.gameId);
  const [isSpeaking, setIsSpeaking] = useState(true);

  // const currentSpeech =
  //   aiOverlordGame.aiOverlord.finalSummary ||
  //   gameView.currentRobotOpponentMove?.text ||
  //   (gameView.currentOpponent
  //     ? aiOverlordGame.taunts.find(
  //         (t) => t.playerId === gameView.currentOpponent!.playerId
  //       )!.taunt
  //     : aiOverlordGame.aiOverlord.introduction);

  const currentSpeech = getSpeechText(aiOverlordGame.aiOverlord, gameView);

  useEffect(() => {
    if (
      !isSpeaking &&
      gameView.currentOpponent &&
      gameView.currentOpponentMove &&
      !isThinking &&
      !gameView.currentRobotOpponentMove
    ) {
      startThinking();
      makeRobotMove(gameView.currentOpponent.playerId);
    }
  }, [
    gameView.currentOpponent,
    gameView.currentOpponentMove,
    gameView.currentRobotOpponentMove,
    isSpeaking,
    isThinking,
    makeRobotMove,
    startThinking,
  ]);

  useEffect(() => {
    if (!isThinking) {
      setIsSpeaking(true);
    }
  }, [isThinking]);

  useEffect(() => {
    if (
      !(isSpeaking || gameView.currentOpponent) ||
      (!isSpeaking &&
        gameView.currentOpponentFinished &&
        !gameView.allPlayersHavePlayed &&
        gameView.preloadedOpponentsWaitingToPlay.length > 0)
    ) {
      const timeout = setTimeout(() => {
        startThinking();
        setIsSpeaking(true);
        newOpponent(
          selectRandomOneOf(gameView.preloadedOpponentsWaitingToPlay).playerId
        );
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [
    gameView.allPlayersHavePlayed,
    gameView.currentOpponent,
    gameView.currentOpponentFinished,
    gameView.preloadedOpponentsWaitingToPlay,
    gameView.remainingOpponents,
    isSpeaking,
    newOpponent,
    startThinking,
  ]);

  useEffect(() => {
    if (
      !isSpeaking &&
      gameView.allPlayersHavePlayed &&
      !gameView.finalRobotSummary
    ) {
      const timeout = setTimeout(() => {
        startThinking();
        setIsSpeaking(true);
        finaliseGame();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [
    finaliseGame,
    gameView.allPlayersHavePlayed,
    gameView.finalRobotSummary,
    isSpeaking,
    startThinking,
  ]);

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
      {gameView.currentRobotOpponentMove && (
        <CurrentMovePosition>
          <Appear animation="roll-in-right">
            <AiMove moveName={gameView.currentRobotOpponentMove.move} />
          </Appear>
        </CurrentMovePosition>
      )}
      <GearsPosition>
        <OverlordThinkingIndicator isThinking={isThinking} />
      </GearsPosition>
      <RobotSpeech>
        <Appear key={currentSpeech.english} show={!isThinking}>
          <SpeechText
            text={currentSpeech}
            onFinishedSpeaking={() => {
              console.log("Robot finished speaking");
              setIsSpeaking(false);
            }}
          />
        </Appear>
      </RobotSpeech>

      <MoveHistoryPosition>
        {aiOverlordGame.aiOverlord.moves.map((move, i) => (
          <div key={i}>{getMoveEmoji(move.move)}</div>
        ))}
      </MoveHistoryPosition>
    </RobotLayout>
  );
};
